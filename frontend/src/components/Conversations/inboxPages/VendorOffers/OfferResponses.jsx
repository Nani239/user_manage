/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MessageStatusUpdate } from "../../../../components/Header/Data";
import OfferDetailsModal from "./OfferDetailsModal";
import NegotiateModal from "./NegotiateModal";
import AdminResponseModal from "./AdminResponseModal";
import OfferStatus from "./OfferStatus";
import CallResponses from "./CallRepsonses";
import OfferDetails from "./OfferDetails";
// import OfferResponses from "./OfferResponses";

const OfferResponses = ({ msg, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [selectedMsg, setSelectedMsg] = useState(null);
  const navigate = useNavigate();

  const handleClick = (e) => {
    const offerAmount = msg.finalBudget !== null ? msg.finalBudget : 0;
    e.stopPropagation();
    if (islogin) {
      navigate("/order/summary", {
        state: {
          msg,
          offerAmount,
        },
      });
    } else {
      navigate("/login");
      toast.info("Please Login");
    }
    setSelectedMsg(msg);
  };

  return (
    <Row
      className="d-flex align-items-center justify-content-center ms-1"
      style={{ width: "100%" }}
    >
      <Col sm={4} xs="6" className="p-0">
        <OfferDetails
          msg={msg}
          selectedMsg={selectedMsg}
          fetchData={fetchData}
          setSelectedMsg={setSelectedMsg}
        />
      </Col>
      <Col sm={2} xs="6" className="p-0">
        <CallResponses
          msg={msg}
          fetchData={fetchData}
          selectedMsg={selectedMsg}
          setSelectedMsg={setSelectedMsg}
        />
      </Col>
      <Col
        sm={2}
        xs="3"
        className="p-0"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {msg?.orderStatus === "COMPLETED" ? (
          " "
        ) : (
          <div>
            {(msg.messageStatus === 4 || msg.messageStatus === 9) &&
              msg.ownerId === user.UserID && (
                <button
                  className="btn btn-success btn-sm text-nowrap m-0 px-2"
                  onClick={(e) => handleClick(e)}
                >
                  Pay
                </button>
              )}
          </div>
        )}
      </Col>
      <Col sm={4} xs="9" className="p-0">
        <OfferStatus msg={msg} />
      </Col>
    </Row>
  );
};

export default OfferResponses;
