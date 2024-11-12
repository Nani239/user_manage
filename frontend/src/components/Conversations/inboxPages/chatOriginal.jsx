import React, { useState, useEffect, useRef } from "react";
import { ChatItem, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { Row, Col, Input } from "reactstrap";
import Sidebar from "../../SideBar";
import io from "socket.io-client";
import { useLocation, useNavigate, Link } from "react-router-dom";

const socket = io("http://localhost:7000");

function ChatComponent() {
  const location = useLocation();
  const parentMsg = location.state && location.state.msg;
  const [messages, setMessages] = useState([
    {
      sender: "recipient",
      message: "Hello!",
      date: new Date(),
    },
    {
      sender: "user",
      message: "Hi! How can I help you?",
      date: new Date(),
    },
    {
      sender: "user",
      message: "need help in chat window",
      date: new Date(),
    },
    {
      sender: "recipient",
      message: "yes",
      date: new Date(),
    },
    {
      sender: "user",
      message: "how to integrate",
      date: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    console.log(parentMsg, "parentMsg");
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const handleSendMessage = () => {
    // Send message to the server
    socket.emit("message", inputValue);
    const currentDate = new Date();
    const newMessageObject = {
      sender: "user",
      message: inputValue,
      date: currentDate,
    };
    setMessages([...messages, newMessageObject]);
    setInputValue(""); // Clear input field after sending message
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="home-after-login bg-white">
      <div className="container">
        <Row>
          <Col sm={3}>
            <Sidebar />
          </Col>
          <Col sm={9}>
            <Row>
              <Col sm={10}>
                {" "}
                <div>
                  <div>
                    <div
                      style={{
                        position: "sticky",
                        top: "0px",
                        display: "flex",
                      }}
                    >
                      <ChatItem
                        avatar={"https://placeimg.com/100/100/people"}
                        alt={"Avatar"}
                        title={"Recipient Name"}
                        subtitle={"Subtitle"}
                        date={new Date()}
                        unread={0}
                      />
                      <div></div>
                    </div>
                    <div
                      ref={chatContainerRef}
                      style={{
                        height: "65vh",
                        overflowY: "scroll",
                        scrollBehavior: "smooth",
                      }}
                    >
                      {messages.map((message, index) => (
                        <React.Fragment key={index}>
                          <MessageBox
                            position={
                              message.sender === "user" ? "right" : "left"
                            }
                            type={"text"}
                            text={message.message}
                            date={message.date}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

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
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      style={{ flex: 1, marginRight: 10 }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleSendMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </Col>
              <Col sm={2}>user Info</Col>
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default ChatComponent;
