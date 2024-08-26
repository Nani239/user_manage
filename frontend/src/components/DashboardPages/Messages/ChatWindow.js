import React from "react";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import "./messages.css";

function ChatWindow({ conversation }) {
  const userId = 1;
  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{conversation.name}</h2>
      </div>
      <div className="chat-messages">
        {conversation.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
      <InputBox conversationId={conversation.id} />
    </div>
  );
}

export default ChatWindow;
