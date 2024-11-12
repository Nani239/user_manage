/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RequestAppointments = ({ allMessages, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();

  const OpenMessage = (msg) => {
    navigate(`/chat/${msg?.Id}`, { state: { msg } });
  };

  return (
    <div className="p-0">
      {allMessages &&
        allMessages.map((msg) => (
          <div
            key={msg?.Id}
            className="message-card mb-3 p-2 bg-white rounded"
            style={{ width: "103%", cursor: "pointer", marginLeft: "-10px" }}
          >
            <div>
              <Row className="message-card-body p-1 mb-1 d-flex align-items-center">
                <Col lg={1}>
                  <img
                    src={
                      msg?.profilePhoto
                        ? msg?.profilePhoto
                        : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                    }
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                </Col>
                <Col lg={2}>
                  <p style={{ fontSize: "small" }}>
                    {msg?.userName.length > 9 ? (
                      <span title={msg?.userName}>
                        {msg?.userName.slice(0, 9)}...
                      </span>
                    ) : (
                      <span>{msg?.userName}</span>
                    )}
                  </p>
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
                  <div className="d-flex justify-content-end gap-1">
                    {" "}
                    <button className="btn btn-success btn-sm">Accept</button>
                    <button className="btn btn-danger btn-sm" type="button">
                      Reject
                    </button>
                    <button className="btn btn-warning btn-sm" type="button">
                      Negotiate
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
    </div>
  );
};

export default RequestAppointments;
