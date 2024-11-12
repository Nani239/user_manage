import React from "react";
import { Input } from "reactstrap";

const ChatFooter = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className="w-100">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          style={{ flex: 1, marginRight: 10 }}
        />
        <button
          className="btn btn-primary btn-sm m-0"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      <p className="text-center">
        <small>
          Having issues communicating with Vendor? call platform customer
          service <a href={`tel:${8002453610}`}>800 245 3610</a>
        </small>
      </p>
    </div>
  );
};

export default ChatFooter;
