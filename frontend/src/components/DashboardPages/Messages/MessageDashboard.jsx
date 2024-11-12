import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import ChatWindow from "./ChatWindow";
import { initialConversations } from "./dummy";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../Home/fetchData/fetchData";
import {
  setConversation,
  setSelectedContact,
  setSelectedConvo,
} from "../../../Redux/Slices/msgSlice";

const MessagesDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { AllUsers } = useSelector((state) => state.user);
  const { conversation, selectedContact } = useSelector(
    (state) => state.messages
  );
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  console.log(user, "user");
  const dispatch = useDispatch();
  useEffect(() => {
    // Check screen width to determine if mobile view is active
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowChatWindow(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectConversation = (conversationId) => {
    const conversation = AllUsers.find((conv) => conv.id === conversationId);
    dispatch(setSelectedContact(conversation));
    if (isMobileView) {
      setShowChatWindow(true);
    }
  };
  React.useEffect(() => {
    if (selectedContact) {
      currentChat();
    }
  }, [selectedContact]);
  const currentChat = async () => {
    const chat = await fetchConversations(user.uid, selectedContact.id);
    console.log(chat, "chat");
    dispatch(setConversation(chat));
  };
  console.log(conversation, "conversation");
  console.log(selectedContact, "selectedContact");
  console.log(user, "selectedContact");
  const handleBackToList = () => {
    setShowChatWindow(false);
  };
  return (
    <div className="message-container">
      {!isMobileView || !showChatWindow ? (
        <MessageList
          conversations={AllUsers}
          seleCtedContactId={selectedContact ? selectedContact.uid : null}
          onSelectConversation={handleSelectConversation}
        />
      ) : null}
      {conversation && (!isMobileView || showChatWindow) && (
        <ChatWindow onBack={handleBackToList} isMobileView={isMobileView} />
      )}
    </div>
  );
};

export default MessagesDashboard;
