import React, { useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";

const ChatContainer = ({ contact, messages, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    await onSendMessage(contact.id, message);
    setMessage("");
  };

  return (
    <div>
      <h3>Chat with {contact.name}</h3>
      <ListGroup className="mb-3">
        {messages.map((msg, index) => (
          <ListGroup.Item
            key={index}
            className={msg.senderId === user.userId ? "text-end" : "text-start"}
            style={{
              backgroundColor:
                msg.senderId === user.userId ? "#d1e7dd" : "#f8f9fa",
              borderRadius: "10px",
              margin: "5px 0",
              maxWidth: "70%",
              alignSelf:
                msg.senderId === user.userId ? "flex-end" : "flex-start",
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
