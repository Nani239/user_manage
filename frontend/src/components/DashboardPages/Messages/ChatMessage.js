import React from "react";
import "./messages.css";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
const socket = io.connect("http://localhost:3001");
function ChatMessage({ message }) {
  const isOwnMessage = message.senderId === 1;
  const isOtherMessage = message.senderId !== 1;
  const user = useSelector((state) => state.auth.user);
  console.log(message, "message");
  return (
    <div
      className={`chat-message ${
        message.senderId === user.uid ? "own" : "other"
      }`}
    >
      <div className="message-content">
        <div className="avatar d-flex align-items-center">
          {message.senderId == user.uid ? (
            <img
              src={
                message.senderImage ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }
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
              src={
                message.receiverImage ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }
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
          {message.senderId == user.uid ? (
            <span className="sender">You</span>
          ) : (
            <span className="sender">Others</span>
          )}
        </div>
        <p className="m-0 p-0">{message.message || "Image"}</p>
        <span className="time">{message.time || "Now"}</span>
      </div>
    </div>
  );
}

export default ChatMessage;
