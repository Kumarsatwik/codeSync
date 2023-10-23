import { io } from "socket.io-client";
export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
//   console.log(`Connecting to http://localhost:5000`);
  return io("http://localhost:5000", options);
};
