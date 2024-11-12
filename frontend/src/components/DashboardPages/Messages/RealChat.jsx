import React from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const RealChat = () => {
    const [data, setData] = React.useState("");
  const send = () => {
    const message = document.querySelector("input").value;
    socket.emit("send_message", message);
  };

  React.useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setData(data);
    });
  }, [socket]);

  return (
    <div>
      <input type="text" placeholder="Type a message" />
      <button className="btn btn-primary" type="submit" onClick={() => send()}>
        Send
      </button>
      <p>{data}</p>
    </div>
  );
};

export default RealChat;
