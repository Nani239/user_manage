import React from "react";
import MessageItem from "./MessageItem";
import "./messages.css";
function MessageList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) {
  return (
    <div className="message-list">
      {conversations.map((conv) => (
        <>
          <MessageItem
            key={conv.id}
            conversation={conv}
            isSelected={conv.id === selectedConversationId}
            onSelectConversation={onSelectConversation}
          />
        </>
      ))}
    </div>
  );
}

export default MessageList;
