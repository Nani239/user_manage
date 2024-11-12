import React, { useEffect, useState } from "react";
import "./messages.css";
import Conversation from "./Conversation";
import MsgInputBox from "./MsgInputBox";
import { getAllMessages } from "../../../components/Header/Data";
import { getConvoById } from "../../../components/Header/Data2";
import { useDispatch, useSelector } from "react-redux";
import { setLodingConvo, setMessages } from "../../../redux/slices/MsgSlice";
import { FaClock, FaEllipsisH, FaEnvelope, FaVideo } from "react-icons/fa";
import ChatHeader from "./ChatHeader";
import ContactDetails from "./ContactDetails";
import ChatCommunication from "./ChatCommunication";

function ChatWindow({ conversation, onBack, isMobileView, fetchData }) {
  const userId = 1;
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const selectedFile = useSelector((state) => state.messages.selectedFile);
  const loadingConvo = useSelector((state) => state.messages.loadingConvo);
  const messages = useSelector((state) => state.messages.messages);
  const sendingFile = useSelector((state) => state.messages.sendingFile);
  const [isDrawerOpen, setDrawerOpen] = useState(!isMobileView); // Open by default on desktop

  const fetchMsgs = async () => {
    dispatch(setLodingConvo(true));
    const messagesData = await getConvoById(selectedConversation?.Id);
    dispatch(setMessages(messagesData));
    dispatch(setLodingConvo(false));
  };

  useEffect(() => {
    fetchMsgs();
  }, [selectedConversation]);

  useEffect(() => {
    if (!isMobileView) {
      setDrawerOpen(true);
    }
  }, [isMobileView]);
  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  console.log(messages, "messages");
  return (
    <div className="chat-window">
      <ChatCommunication
        isMobileView={isMobileView}
        onBack={onBack}
        toggleDrawer={toggleDrawer}
        fetchMsgs={fetchData}
        isChatModal={false}
      />
      <ContactDetails
        message={selectedConversation}
        toggleDrawer={toggleDrawer}
        isMobileView={isMobileView}
        isDrawerOpen={isDrawerOpen}
        fetchMsgs={fetchData}
      />
    </div>
  );
}

export default ChatWindow;
