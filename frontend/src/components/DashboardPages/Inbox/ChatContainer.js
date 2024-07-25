import React, { useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { sendMessage } from "../Inbox/chatService";

const ChatContainer = ({ contact, messages, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const currentUserId = auth.currentUser.uid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    await onSendMessage(contact.id, message, currentUserId);
    setMessage("");
  };

  return (
    <div>
      <h3>Chat with {contact.name}</h3>
      <ListGroup className="mb-3">
        {messages.map((msg, index) => (
          <ListGroup.Item
            key={index}
            className={
              msg.senderId === currentUserId ? "text-end" : "text-start"
            }
            style={{
              backgroundColor:
                msg.senderId === currentUserId ? "#d1e7dd" : "#f8f9fa",
              borderRadius: "10px",
              margin: "5px 0",
              maxWidth: "70%",
              alignSelf:
                msg.senderId === currentUserId ? "flex-end" : "flex-start",
            }}
          >
            {msg.message}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form className="mt-3" onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <Button type="submit" className="mt-2">
          Send
        </Button>
      </Form>
    </div>
  );
};

export default ChatContainer;
