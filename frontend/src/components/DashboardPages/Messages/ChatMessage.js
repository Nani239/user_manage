import React from "react";
import "./messages.css";

function ChatMessage({ message }) {
  const userId = 1;
  console.log(message, "message");
  return (
    <div
      className={`chat-message ${
        message.senderId === userId ? "own" : "other"
      }`}
    >
      <div className="message-content">
        <div className="avatar d-flex align-items-center">
          {message.senderId == userId ? (
            <img
              src={message.senderImage}
              alt="Avatar"
              className="rounded-circle border border-3 border-secondary bg-light avatar shadow p-1 mb-1 d-inline-block"
              width={50}
              height={50}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.9)",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:focus-visible": {
                  outline: "none",
                },
                "&:focus-within": {
                  outline: "none",
                },
              }}
            />
          ) : (
            <img
              src={message.receiverImage}
              alt="Avatar"
              className="rounded-circle border border-3 border-secondary bg-light avatar shadow p-1 mb-1 d-inline-block"
              width={50}
              height={50}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.9)",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:focus-visible": {
                  outline: "none",
                },
                "&:focus-within": {
                  outline: "none",
                },
              }}
            />
          )}
          {message.senderId == userId ? (
            <span className="sender">You</span>
          ) : (
            <span className="sender">Others</span>
          )}
        </div>
        <p className="m-0 p-0">{message.text}</p>
        <span className="time">{message.time}</span>
      </div>
    </div>
  );
}

export default ChatMessage;
