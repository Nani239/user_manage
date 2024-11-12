/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState } from "react";
import { Row, Col, Modal, ModalBody, Button } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import OfferResponses from "./OfferResponses";
import PayModal from "../../../../components/Header/modals/PayModal";
import OfferProfile from "./OfferProfile";
const OfferCards = ({ allMessages, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
    //handlePay();
  };

  return (
    <div className="p-0">
      {allMessages.length > 0 ? (
        <>
          {allMessages &&
            allMessages.map((msg) => (
              <div
                key={msg.Id}
                className="message-card mb-3 p-2 bg-white rounded"
                style={{
                  width: "110%",
                  cursor: "pointer",
                  marginLeft: "-10px",
                }}
              >
                <div>
                  <Row className="message-card-body p-1 mb-1 d-flex align-items-center position-relative">
                    <Col sm={5} xs={12}>
                      <OfferProfile
                        msg={msg}
                        setSelectedMsg={setSelectedMsg}
                        handleToggleModal={handleToggleModal}
                      />
                    </Col>
                    <Col sm={7} xs={12}>
                      <OfferResponses msg={msg} fetchData={fetchData} />
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
          No Offer Messages
        </div>
      )}

      <PayModal
        isModalOpen={isModalOpen}
        handleToggleModal={handleToggleModal}
        selectedMsg={selectedMsg}
      />
    </div>
  );
};

export default OfferCards;
