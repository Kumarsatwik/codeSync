import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Room created");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Please fill all the fields");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="/code-sync.png" className="logo" alt="code-sync-logo" />
        <h4 className="mainLabel">Paste invitation code</h4>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="inputBox"
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="inputBox"
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invitation code then create{" "}
            <a href="" onClick={createRoom} className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Copyright © 2023 CodeSync</h4>
      </footer>
    </div>
  );
};

export default Home;
