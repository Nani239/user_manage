import React, { useState, useEffect } from "react";
import MessageList from "./MessagesList";
import ChatWindow from "./ChatWindow";
import { initialConversations } from "./dummy";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessages } from "../../../components/Header/Data";
import {
  setConversations,
  setLoadingNotif,
  setMessages,
  setMyConnections,
  setMyJobOffers,
  setSelectedConversation,
} from "../../../redux/slices/MsgSlice";
import { FadeLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GetConnections,
  GetItemOrderById,
  GetJobOffers,
} from "../../../components/Header/Data3";

const InboxPage2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const conversations = useSelector((state) => state.messages.convos);
  const { loadingNotif, myConnections } = useSelector(
    (state) => state.messages
  );
  const convo = useSelector((state) => state.messages);
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const fetchData = async () => {
    setIsLoading(true);
    dispatch(setLoadingNotif(true));
    const connectionResponse = await GetConnections(user.UserID);
    const jobResponse = await GetJobOffers(user.UserID);
    dispatch(setMyConnections(connectionResponse));
    dispatch(setMyJobOffers(jobResponse));
    dispatch(setLoadingNotif(false));
    if (user.RoleId === 1) {
      const msgForm = {
        roleId: 1,
      };
      const messagesData = await getAllMessages(msgForm);
      const filterParent = messagesData.filter((msg) => msg.parentId === 0);
      dispatch(setConversations(filterParent));
      setIsLoading(false);
      window.scroll(0, 0);
      if (filterParent.length > 0) {
        dispatch(setSelectedConversation(filterParent[0]));
      }
    } else {
      const msgForm = {
        customerId: user.UserID,
        createdBy: user.UserID,
      };
      const messagesData = await getAllMessages(msgForm);
      const filterParent = messagesData.filter((msg) => msg.parentId === 0);
      const myMessages = filterParent.filter(
        (msg) =>
          msg.messageStatus !== 0 &&
          msg.messageStatus !== 1 &&
          msg.messageStatus !== 2
      );
      dispatch(setConversations(myMessages));
      window.scroll(0, 0);
      if (filterParent.length > 0) {
        dispatch(setSelectedConversation(myMessages[0]));
      }
      console.log(filterParent, "conversations");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
    dispatch(setConversations(initialConversations));
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
      if (window.innerWidth > 767) {
        setShowChatWindow(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectConversation = (conversationId) => {
    if (selectedConversation.Id == conversationId) {
      return;
    }
    dispatch(setMessages(null));
    const conversation = conversations.find(
      (conv) => conv.Id === conversationId
    );
    dispatch(setSelectedConversation(conversation));
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("chat", conversationId);
    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: true }
    ); // Use replace to avoid adding to the history stack
    if (isMobileView) {
      setShowChatWindow(true);
    }
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
  };

  return (
    <div className="message-container inter-font">
      {isLoading ? (
        <FadeLoader // FadeLoader component
          css={{ margin: "0 auto" }}
          color={"#36D7B7"}
          loading={isLoading}
          className="position-absolute top-50 start-50 translate-middle"
          //style={{ left: "0%", top: "40%" }}
        />
      ) : (
        <>
          {!isMobileView || !showChatWindow ? (
            <MessageList onSelectConversation={handleSelectConversation} />
          ) : null}
          {selectedConversation && (!isMobileView || showChatWindow) && (
            <ChatWindow
              conversation={selectedConversation}
              onBack={handleBackToList}
              isMobileView={isMobileView}
              fetchData={fetchData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InboxPage2;
