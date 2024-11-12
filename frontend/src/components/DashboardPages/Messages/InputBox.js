import React, { useState } from "react";
import "./messages.css";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { sendMessage } from "../Inbox/chatService";

const socket = io.connect("http://localhost:3001");
function InputBox() {
  const user = useSelector((state) => state.auth.user);
  const { selectedContact } = useSelector((state) => state.messages);
  const [text, setText] = useState("");
  const msgData = {
    conversationId: selectedContact.id,
    text,
    senderId: user.uid,
    receiverId: 2,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    seen: false,
    senderImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    receiverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    receiverName: "Matt Black",
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (text.trim() != "") {
      socket.emit("send_message", msgData);
      try {
        await handleSendMessage(selectedContact.id, text);
      } catch (err) {
        console.log(err);
      }

      setText("");
    }
  };
  const handleSendMessage = async (contactId, message) => {
    const reciverId = selectedContact.uid;
    await sendMessage(contactId, user.uid, reciverId, message, user);
    console.log("Message sent successfully!");
  };

  return (
    <div className="input-box">
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default InputBox;
