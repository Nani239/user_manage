import React from "react";
import "./messages.css";

function MessageItem({ conversation, isSelected, onSelectConversation }) {
  return (
    <div
      className={`message-item ${conversation.unread ? "unread" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onClick={() => onSelectConversation(conversation.id)}
    >
      <hr />
      <div className="avatar">{/* Avatar goes here */}</div>
      <div className="message-info">
        <div className="name">{conversation.name}</div>
        <div className="last-message">{conversation.lastMessage}</div>
      </div>
      <div className="message-date">{conversation.date}</div>
      {conversation.unread && (
        <div className="unread-count">{conversation.unreadCount}</div>
      )}
    </div>
  );
}

export default MessageItem;
