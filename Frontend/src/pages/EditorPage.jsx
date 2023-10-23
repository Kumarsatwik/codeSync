import { useEffect, useRef, useState } from "react";
import Clients from "../components/Clients";
import Editor from "../components/Editor";
import { initSocket } from "../../socket";
import ACTIONS from "../Action";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

const EditorPage = () => {
  const [clients, setClients] = useState([]);

  const reactNavigator = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("socket error", err);
        toast.error("Socket connection failed , try again later");
        reactNavigator("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          console.log(codeRef.current);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });

      socketRef.current.on("error", (error) => {
        console.error("Socket error:", error);
        // Handle the error (e.g., show an error message to the user)
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id has been copied");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't copy");
    }
  }

  const leaveRoom = () => {
    reactNavigator("/");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/code-sync.png" alt="code-sync" className="logoEditor" />
            {/* <hr /> */}
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Clients key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
      <div className="output">
        
      </div>
    </div>
  );
};

export default EditorPage;
