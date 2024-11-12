import React from "react";
import { Col, Row, Badge } from "reactstrap"; // Import Badge from reactstrap
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MessageSeen } from "../../../../components/Header/Data2";

const OfferProfile = ({ msg, setSelectedMsg, handleToggleModal }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();
  const logUser = localStorage.getItem("USER_ROLE");

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

  const ViewProfile = (msg) => {
    if (msg.createdBy === user.UserID) {
      navigate(`/userDetails/${msg.customerId}`, { state: msg.ownerId });
    } else {
      navigate(`/userDetails/${msg.createdBy}`, { state: msg.ownerId });
    }
  };

  return (
    <Row className=" p-1 mb-1 d-flex align-items-center">
      <Col xs={3} sm={3}>
        <div style={{ position: "relative" }}>
          {msg.createdBy === user.UserID ? (
            <>
              <img
                src={
                  msg?.receiverProfilePhoto !== null &&
                  msg?.receiverProfilePhoto !== ""
                    ? msg?.receiverProfilePhoto
                    : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                }
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                alt=""
                className="rounded-circle"
                onClick={() => ViewProfile(msg)}
              />
              {/* {msg.unreadMessages > 0 && ( */}
              {/* <Badge
                color="danger"
                pill
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "-5px",
                  fontSize: "0.7rem",
                }}
              >
                5
              </Badge> */}
              {/* )} */}
            </>
          ) : (
            <>
              <img
                src={
                  msg?.senderPhoto !== null && msg?.senderPhoto !== ""
                    ? msg?.senderPhoto
                    : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                }
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => ViewProfile(msg)}
                alt={msg?.userName}
                className="rounded-circle"
              />
              {/* {msg.unreadMessages > 0 && ( */}
              {/* <Badge
                color="danger"
                pill
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "25px",
                  fontSize: "0.7rem",
                }}
              >
                5
              </Badge> */}
              {/* )} */}
            </>
          )}
          <br />
          <a
            style={{
              fontSize: "8px",
              textDecorationLine: "underline",
            }}
            onClick={() => ViewProfile(msg)}
            className="text-center text-decoration-underline"
          >
            View Profile
          </a>
        </div>
      </Col>
      <Col xs={9} sm={4} className="p-0">
        {msg.createdBy === user.UserID ? (
          <a
            className="text-primary"
            style={{ fontSize: "small", cursor: "pointer" }}
            onClick={() => ViewProfile(msg)}
          >
            <strong>
              {/* {msg?.userName.length > 12 ? (
                <span title={msg.customerName}>{msg.userName.slice(0, 12)}...</span>
              ) : ( */}
              <span>{msg?.customerName}</span>
              {/* )} */}
            </strong>
          </a>
        ) : (
          <a
            className="text-primary"
            style={{ fontSize: "small", cursor: "pointer" }}
            onClick={() => ViewProfile(msg)}
          >
            <strong>
              {/* {msg?.senderName?.length > 12 ? (
                <span title={msg.senderName}>
                  {msg.senderName.slice(0, 12)}...
                </span>
              ) : ( */}
              <span>{msg.senderName}</span>
              {/* )} */}
            </strong>
          </a>
        )}
        <p style={{ fontSize: "x-small" }}>
          <strong>
            {msg?.categoryName?.length > 18 ? (
              <span title={msg.categoryName}>
                {msg.categoryName.slice(0, 18)}...
              </span>
            ) : (
              <span>{msg.categoryName}</span>
            )}
          </strong>
        </p>
      </Col>
      <Col xs={12} sm={5}>
        <Row>
          <Col sm="12" xs="6">
            <a
              onClick={() => OpenMessage(msg)}
              className="text-nowrap text-decoration-underline"
            >
              View Conversation
            </a>
          </Col>
          <Col sm="6" xs="12">
            {user.RoleId !== 1 && (
              <>
                {logUser === "customer" && msg.providerPhone !== "0" && (
                  <small>{msg.providerPhone}</small>
                )}
                {logUser === "provider" && msg.customerPhone !== "0" && (
                  <small>{msg.customerPhone}</small>
                )}
                {(logUser !== "customer" || msg.providerPhone === "0") &&
                  (logUser !== "provider" || msg.customerPhone === "0") && (
                    <a
                      onClick={() => {
                        setSelectedMsg(msg); // Update selectedMsg with the current message
                        handleToggleModal(); // Toggle modal visibility
                      }}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        textDecoration: "underline", // Added textDecoration for clarity
                      }}
                      className="text-decoration-underline"
                    >
                      <small className="text-nowrap">
                        Request Phone Number
                      </small>
                    </a>
                  )}
              </>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default OfferProfile;
