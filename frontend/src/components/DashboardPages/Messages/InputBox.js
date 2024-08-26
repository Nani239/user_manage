import React, { useState } from "react";
import "./messages.css";

function InputBox({ conversationId }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Logic to send the message and update the conversation's messages
      setMessage("");
    }
  };

  return (
    <div className="input-box">
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default InputBox;
