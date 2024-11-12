/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { FaCopy } from "react-icons/fa";
import { Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageSeen } from "../../../components/Header/Data2";

const UnReadMsgs = ({ allMessages, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();

  const handleClientIdCopy = (e, clientId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(clientId);
  };

  console.log(allMessages, "allMessages");

  const handlePlay = (e, msg) => {
    e.stopPropagation();
    window.open(msg?.playZoomUrl, "_blank");
  };
  const OpenMessage = async (msg) => {
    let request = {};
    if (msg?.createdBy === user.UserID) {
      request = {
        createdBy: user.UserID,
      };
    } else {
      request = {
        customerId: user.UserID,
      };
    }
    await MessageSeen(msg.Id, request);
    navigate(`/chat/${msg.Id}`, { state: { msg } });
  };

  return (
    <div className="p-0">
      {allMessages.length > 0 ? (
        <>
          {allMessages &&
            allMessages.map((msg) => (
              <div
                key={msg?.Id}
                className="message-card mb-3 p-2 bg-white rounded"
                style={{
                  width: "103%",
                  cursor: "pointer",
                  marginLeft: "-10px",
                }}
              >
                <div>
                  <Row className="message-card-body p-1 mb-1 d-flex align-items-center">
                    <Col lg={1}>
                      <div>
                        {msg?.createdBy === user.UserID ? (
                          <img
                            src={
                              msg?.receiverProfilePhoto
                                ? msg?.receiverProfilePhoto
                                : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                            }
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                        ) : (
                          <img
                            src={
                              msg?.senderPhoto
                                ? msg?.senderPhoto
                                : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                            }
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                        )}
                      </div>
                    </Col>{" "}
                    <Col lg={2}>
                      {msg?.createdBy === user.UserID ? (
                        <p style={{ fontSize: "small" }}>
                          <strong>
                            {msg?.userName?.length > 9 ? (
                              <span title={msg.userName}>
                                {msg?.userName.slice(0, 9)}...
                              </span>
                            ) : (
                              <span>{msg?.userName}</span>
                            )}
                          </strong>
                        </p>
                      ) : (
                        <p style={{ fontSize: "small" }}>
                          <strong>
                            {msg?.senderName?.length > 9 ? (
                              <span title={msg.senderName}>
                                {msg?.senderName.slice(0, 9)}...
                              </span>
                            ) : (
                              <span>{msg?.senderName}</span>
                            )}
                          </strong>
                        </p>
                      )}
                    </Col>
                    <Col lg={3}>
                      <a
                        onClick={() => OpenMessage(msg)}
                        style={{ textDecorationLine: "underline" }}
                        className=""
                      >
                        <small>View Conversation</small>
                      </a>
                    </Col>
                    <Col lg={6}>
                      {msg?.playZoomUrl !== null && user.RoleId === 1 && (
                        <div className="d-flex justify-content-center align-items-center px-2 mt-1">
                          <p className="d-flex align-items-center">
                            <input
                              type="text"
                              style={{ width: "50%", marginTop: "-7px" }}
                              name="clientId"
                              value={msg?.zoomPassCode}
                              className="input-width"
                              disabled
                              //onChange={(e) => setClientId(e.target.value)}
                            />
                            <button
                              onClick={(e) =>
                                handleClientIdCopy(e, msg?.zoomPassCode)
                              }
                              color="primary"
                              style={{ marginLeft: "10px", marginTop: "-7px" }}
                            >
                              <FaCopy />
                            </button>
                            <button
                              onClick={(e) => handlePlay(e, msg)}
                              className="btn btn-success btn-sm text-nowrap"
                              style={{ marginLeft: "10px", marginTop: "-7px" }}
                            >
                              <span>Play</span>
                            </button>
                          </p>
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
        </>
      ) : (
        <div
          className="position-absolute translate-middle inter-font"
          style={{ left: "60%", top: "40%" }}
        >
          {allMessages[0]?.playZoomUrl ? "No Recordings" : "No Messages"}
        </div>
      )}
    </div>
  );
};

export default UnReadMsgs;
