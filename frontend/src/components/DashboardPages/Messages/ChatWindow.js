import React from "react";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import "./messages.css";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { getChatId, getMessages } from "../Inbox/chatService";

const socket = io.connect("http://localhost:3001");

function ChatWindow({ onBack, isMobileView }) {
  const { selectedContact } = useSelector((state) => state.messages);
  const [conversations, setConversations] = React.useState([]);
  const user = useSelector((state) => state.auth.user);

  React.useEffect(() => {
    socket.on("receive_message", (newMessage) => {
      setConversations((prevConversations) => [
        ...prevConversations,
        newMessage,
      ]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  React.useEffect(() => {
    if (selectedContact) {
      const fetchChatIdAndMessages = async () => {
        const chatId = await getChatId(selectedContact.id, user.uid);
        if (chatId) {
          const unsubscribe = getMessages(chatId, (messages) => {
            setConversations(messages); // Directly set `messages` as an array
          });
          return () => unsubscribe();
        }
        console.log(chatId, "chatId");
      };
      fetchChatIdAndMessages();
    }
  }, [selectedContact, user.uid]);

  console.log(conversations, "conversations"); // Should now be an array of messages
  console.log(selectedContact, "selectedContact");

  return (
    <div className="chat-window">
      <div className="chat-header">
        {isMobileView && (
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
        )}
        <h2>{selectedContact?.email}</h2>
      </div>
      <div className="chat-messages">
        {conversations.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
      <InputBox />
    </div>
  );
}

export default ChatWindow;
