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
import "./InboxPage.css";
import Sidebar from "../../SideBar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GetZoomLink,
  ZoomStatusUpdate,
  getConvoById,
} from "../../../components/Header/Data2";
import { useSelector } from "react-redux";
import { sendMessage } from "../../../components/Header/Data";
import AcceptZoomModal from "./VendorOffers/AcceptZoomModal";
import { toast } from "react-toastify";

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
  const [reSchedule, setReSchedule] = useState(false);
  const [zoomModal, setZoomModal] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const lastMsgIndex = messages.findIndex(
    (message) => message.postType === "3" && message.messageStatus !== 8
  );
  const lastMsg = lastMsgIndex !== -1 ? messages[lastMsgIndex] : null;
  const fetchMsgs = async () => {
    const messagesData = await getConvoById(parentMsg.Id);
    setMessages(messagesData);
  };
  useEffect(() => {
    console.log(parentMsg, "parentMsg");
    console.log(user, "user");
    fetchMsgs();
  }, [parentMsg]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMsgs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const handleSendMessage = async () => {
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

  const handleAcceptOffer = () => {
    if (lastMsg.ownerId === user.UserID) {
    }
  };
  const handleReschedule = () => {
    setReSchedule(true);
    setZoomModal(true);
  };
  const closeZoomModal = () => {
    setZoomModal(false);
    setReSchedule(false);
  };
  const RejectZoomCall = async () => {
    const formData = {
      updatedBy: user.UserID,
      zoomStatus: 2,
    };
    await ZoomStatusUpdate(formData, parentMsg.Id);
    toast.info("Call Rejected");
  };
  const AcceptZoomCall = async () => {
    const formattedStartTime = "2024-04-20T08:09:58.000Z";
    const formData = {
      startTime: formattedStartTime,
    };
    try {
      const linkResponse = await GetZoomLink(formData, parentMsg.Id);
      if (linkResponse && linkResponse.id && linkResponse.join_url) {
        const updateFormData = {
          updatedBy: user.UserID,
          zoomStatus: 3,
          meetingId: linkResponse.id,
          meetingLink: linkResponse.join_url,
          meetingStartLink: linkResponse.start_url,
        };
        await ZoomStatusUpdate(updateFormData, parentMsg.Id);
        closeZoomModal();
        toast.success("Call Accepted");
      } else {
        toast.error("Error: Invalid response format or join_url not found");
      }
    } catch (error) {
      console.error("Error accepting Zoom call:", error);
      toast.error("An error occurred while accepting the Zoom call");
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const CallLaunch = async () => {
    if (parentMsg.meetingLink) {
      window.open(parentMsg.meetingLink, "_blank");
    } else {
      toast.error(" Link is not available.");
    }
  };

  const handleModelOpen = () => {
    setModelOpen(!modelOpen);
  };

  // Splitting reserveDate into parts and rearranging
  let reserveDateParts = null;
  let formattedReserveDate = null;
  let formattedStartTime = null;

  if (parentMsg && typeof parentMsg.reserveDate === "string") {
    try {
      reserveDateParts = parentMsg.reserveDate.split("-");
      formattedReserveDate = `${reserveDateParts[1]}-${reserveDateParts[2]}-${reserveDateParts[0]}`;
    } catch (error) {
      console.error("Error parsing selectedCard.availableFrom:", error);
      formattedReserveDate = "";
    }
  }

  // Function to convert 24-hour time to 12-hour time
  function convertTo12HourFormat(time24) {
    const [hours, minutes] = time24.split(":");
    const d = new Date(2020, 1, 1, hours, minutes);
    return d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  if (parentMsg && typeof parentMsg.startTime === "string") {
    formattedStartTime = convertTo12HourFormat(parentMsg.startTime);
  } else {
    formattedStartTime = "";
  }

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
                        parentMsg.profilePhoto
                          ? parentMsg.profilePhoto
                          : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                      }
                      alt={parentMsg.userName}
                      title={parentMsg.userName}
                      //subtitle={"Subtitle"}
                      //date={new Date()}
                      date={parentMsg.createdAt}
                      unread={0}
                    />
                  </a>
                </div>
              </ModalHeader>
              {parentMsg.postType === "3" && (
                <div>
                  <Row
                    sm={6}
                    style={{
                      width: "100%",
                      height: "100%",
                      marginTop: "2%",
                      marginLeft: "0%",
                    }}
                  >
                    <Col
                      sm={6}
                      className="d-flex flex-column align-items-center justify-content-around"
                    >
                      <h5 style={{ fontSize: "15px" }}>
                        {lastMsg &&
                        lastMsg.messageStatus === 3 &&
                        lastMsg.ownerId === user.UserID &&
                        lastMsg.postType === "3"
                          ? "Offer Response"
                          : "No Offer Response"}
                      </h5>
                      {lastMsg &&
                        lastMsg.messageStatus === 3 &&
                        lastMsg.ownerId === user.UserID &&
                        lastMsg.postType === "3" && (
                          <Row className="mb-1 pb-1">
                            <Col sm={4}>
                              {" "}
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={(event) => handleAcceptOffer(event)}
                              >
                                Accept
                              </button>
                            </Col>

                            <Col sm={4}>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                              >
                                Reject
                              </button>
                            </Col>
                            <Col sm={4}>
                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                style={{ width: "120%", marginLeft: "-10px" }}
                              >
                                Negotiate
                              </button>
                            </Col>
                          </Row>
                        )}
                    </Col>
                    <Col
                      sm={6}
                      className="d-flex flex-column align-items-center justify-content-around"
                    >
                      <h5 style={{ fontSize: "15px" }}>
                        {(parentMsg &&
                          user.RoleId !== 1 &&
                          user.UserID !== parentMsg.zoomRole &&
                          parentMsg.zoomStatus === 1) ||
                        parentMsg.zoomStatus === 0
                          ? "Call Response"
                          : parentMsg &&
                            user.RoleId !== 1 &&
                            parentMsg.zoomStatus === 3
                          ? `Call Scheduled on ${formattedReserveDate}, ${formattedStartTime} at for 15mins`
                          : "No Call Response"}
                      </h5>
                      {parentMsg &&
                        user.RoleId !== 1 &&
                        user.UserID !== parentMsg.zoomRole &&
                        parentMsg.zoomStatus === 1 && (
                          <Row className="mb-1 pb-1">
                            <Col sm={4}>
                              {" "}
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={() => AcceptZoomCall()}
                              >
                                Accept
                              </button>
                            </Col>

                            <Col sm={4}>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => RejectZoomCall()}
                              >
                                Reject
                              </button>
                            </Col>
                            <Col sm={4}>
                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() => handleReschedule()}
                              >
                                ReSchedule
                              </button>
                              <AcceptZoomModal
                                isOpen={zoomModal}
                                closeModal={(e) => closeZoomModal(e)}
                                reSchedule={reSchedule}
                                setReSchedule={setReSchedule}
                                msg={parentMsg}
                              />
                            </Col>
                          </Row>
                        )}
                      {parentMsg &&
                        user.RoleId !== 1 &&
                        parentMsg.zoomStatus === 0 && (
                          <>
                          <button
                            type="button"
                            className="btn btn-sm text-nowrap m-0 px-1 mt-1"
                            style={{ backgroundColor: "#98D9EE" }}
                            onClick={console.log("Clicked")}
                          >
                            Schedule a Call
                          </button>
                         </>
                        )}
                      {parentMsg &&
                        user.RoleId !== 1 &&
                        parentMsg.zoomStatus === 3 && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => CallLaunch()}
                          >
                            Start Call
                          </button>
                        )}
                    </Col>
                  </Row>
                  <hr />
                </div>
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
                          {/* <div
                            className="chat-head"
                            style={{
                              position: "sticky",
                              top: "0px",
                              display: "flex",
                              backgroundColor: "white",
                            }}
                          >
                            <ChatItem
                              avatar={"https://placeimg.com/100/100/people"}
                              alt={"Avatar"}
                              title={parentMsg.userName}
                              //subtitle={"Subtitle"}
                              //date={new Date()}
                              date={parentMsg.createdAt}
                              unread={0}
                              className="w-100 p-0 rounded"
                            />
                          </div> */}
                          {parentMsg.postType === "3" && (
                            <div>
                              <p className="text-center fw-bold">
                                <small>
                                  Starting Offer $ {parentMsg.Budget}
                                </small>
                              </p>
                              <p className="text-center text-success fw-bold">
                                <small>
                                  Negotiated $ {parentMsg.finalBudget}
                                </small>
                              </p>
                            </div>
                          )}
                          <div
                            style={{
                              height: "65vh", // Set a fixed height for the container
                              overflowY: "scroll", // Allow vertical scrolling
                              scrollBehavior: "smooth",
                            }}
                          >
                            <div
                              ref={chatContainerRef}
                              style={{
                                // height: "65vh",
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
                                    title={message.userName}
                                    subtitle={"Subtitle"}
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
                      Having issues communicating with Vendor? call platform
                      customer service{" "}
                      <a href={`tel:${8002453610}`}>800 245 3610</a>
                    </small>
                  </p>
                </div>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ChatComponent;
