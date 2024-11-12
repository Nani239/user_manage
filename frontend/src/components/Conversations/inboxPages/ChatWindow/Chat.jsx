/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Input,
} from "reactstrap";
import { ChatItem, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import "../InboxPage.css";
import Sidebar from "../../../SideBar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GetZoomLink,
  ZoomStatusUpdate,
  getConvoById,
} from "../../../../components/Header/Data2";
import { useSelector } from "react-redux";
import { sendMessage } from "../../../../components/Header/Data";
import AcceptZoomModal from "../VendorOffers/AcceptZoomModal";
import { toast } from "react-toastify";
import OfferResponsesInChat from "./OfferResponsesInChat";
import ChatFooter from "./ChatFooter";

const ChatComponent = () => {
  const navigate = useNavigate();
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const isAdmin = user && user.Role === "admin"; // Check if user is admin
  const location = useLocation();
  const parentMsg = location.state && location.state.msg;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [modelOpen, setModelOpen] = useState(false);
  const lastMsgIndex = messages?.findIndex(
    (message) => message.postType === 3 && message.messageStatus !== 8
  );
  const lastMsg = lastMsgIndex !== -1 ? messages[lastMsgIndex] : null;
  const fetchMsgs = async () => {
    const messagesData = await getConvoById(parentMsg?.Id);
    setMessages(messagesData);
  };
  useEffect(() => {
    fetchMsgs();
  }, [location.state?.msg]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMsgs();
    }, 500);

    return () => clearInterval(interval);
  }, []);
  const handleSendMessage = async () => {
    setNewMessage("");
    if (newMessage) {
      const form = {
        userName: user.UserName,
        Email: user.Email,
        postType: 3, // message 1 or requestQuote 2 or offer my service 3
        Description: newMessage,
        messageStatus: 8,
        createdBy: user.UserID,
        roleId: user.RoleId,
        postId: parentMsg.postId,
        parentId: parentMsg.parentId === 0 ? parentMsg.Id : parentMsg.parentId,
        ownerId: parentMsg.ownerId,
        needName: parentMsg.postName,
        customerId:
          parentMsg.customerId === user.UserID
            ? parentMsg.createdBy
            : parentMsg.customerId,
      };
      await sendMessage(form);
      const newMsg = {
        Message: newMessage,
        createdAt: new Date().toISOString(),
        createdBy: user.UserID,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleModelOpen = () => {
    setModelOpen(!modelOpen);
  };

  const ViewProfile = (msg) => {
    if (msg.createdBy === user.UserID) {
      navigate(`/userDetails/${msg.customerId}`);
    } else {
      navigate(`/userDetails/${msg.createdBy}`);
    }
  };

  return (
    <section className="home-after-login bg-white">
      <div className="container">
        <Row>
          <Col sm={3}>
            <Sidebar />
          </Col>

          <Col sm={9} className="">
            <Modal
              isOpen={handleModelOpen}
              toggle={() => navigate(-1)}
              size={"lg"}
            >
              <ModalHeader className="chat-header" toggle={() => navigate(-1)}>
                <div
                  className="chat-head w-100"
                  style={{
                    position: "sticky",
                    top: "0px",
                    // display: "flex",
                    backgroundColor: "white",
                  }}
                >
                  <a
                    onClick={() => ViewProfile(parentMsg)}
                    className="w-100 p-0 rounded"
                  >
                    <ChatItem
                      avatar={
                        parentMsg?.receiverProfilePhoto
                          ? parentMsg?.receiverProfilePhoto
                          : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                      }
                      alt={parentMsg?.userName}
                      title={parentMsg?.userName}
                      //subtitle={"Subtitle"}
                      //date={new Date()}
                      date={parentMsg?.createdAt}
                      unread={0}
                    />
                  </a>
                </div>
              </ModalHeader>
              {parentMsg?.postType === 3 && (
                <OfferResponsesInChat lastMsg={lastMsg} parentMsg={parentMsg} />
              )}
              <ModalBody>
                <Row>
                  <Col sm={12}>
                    {messages && (
                      <div className="mt-1">
                        <div
                          style={{
                            overflowY: "scroll",
                            scrollBehavior: "smooth",
                          }}
                        >
                          <p className="text-center border-bottom pb-2">
                            <small>
                              We encourage you to keep communication within the
                              application to avoid any scams/fraud. We will
                              credit you $50 for reporting those requesting to
                              take communication off the platform.
                            </small>
                          </p>
                          {parentMsg?.postType === 3 && (
                            <div>
                              <p className="text-center fw-bold">
                                <small>
                                  Starting Offer $ {parentMsg.Budget}
                                </small>
                              </p>
                              <p className="text-center text-success fw-bold">
                                <small>
                                  Negotiated $ {parentMsg?.finalBudget}
                                </small>
                              </p>
                            </div>
                          )}
                          <div
                            style={{
                              height: "65vh",
                            }}
                          >
                            <div
                              ref={chatContainerRef}
                              style={{
                                marginTop: "10px",
                                display: "flex",
                                flexDirection: "column-reverse",
                              }}
                            >
                              {messages.map((message, index) => (
                                <React.Fragment key={index}>
                                  <MessageBox
                                    position={
                                      message.createdBy === user.UserID
                                        ? "right"
                                        : "left"
                                    }
                                    type={"text"}
                                    text={message.Message}
                                    date={message.createdAt}
                                    avatar={
                                      "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                                    }
                                    alt={"Avatar"}
                                    title={message.senderName}
                                    subtitle={"Subtitle"}
                                    status={
                                      message.createdBy === user.UserID
                                        ? message.seenCustomer === 1 ||
                                          message.seenProvider === 1
                                          ? "read"
                                          : "sent"
                                        : undefined
                                    }
                                  />
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <ChatFooter
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                />
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ChatComponent;
