import React, { useEffect, useState } from "react";
import { Row, Col, Input, Label, Button, FormGroup } from "reactstrap";

import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PlaceHolder from "../../../../assets/images/Placeholder.png";
import Payment from "../../settingsComponents/Payment";
import { MessageStatusUpdate } from "../../../../components/Header/Data";
import { statusOfRequest } from "../../../../components/Header/Data";

const AcceptOffer = ({ isOpen, closeModal, selectedMsg, fetchData }) => {
  const navigate = useNavigate();
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const RemoveNeed = async () => {
    closeModal();
    const data = {
      Status: 2,
      createdBy: user.UserID,
    };
    await statusOfRequest(data, selectedMsg.postId);
    fetchData();
  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      onRequestClose={closeModal}
      className="hire-modal"
      style={{
        content: {
          width: "50%",
          margin: "auto",
          backgroundColor: "#fff",
          padding: "40px",
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "1px solid gray",
          borderRadius: "20px",
        },
      }}
      size="lg"
    >
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close"
          onClick={closeModal}
        ></button>
      </div>
      <div className="modal-body">
        <div className="modal-body ">
          <div className="d-flex flex-row align-items-center pb-3">
            <div style={{ width: "50px", height: "50px", marginRight: "30px" }}>
              <img
                src={
                  selectedMsg && selectedMsg?.profilePhoto
                    ? selectedMsg?.profilePhoto
                    : PlaceHolder
                }
                // alt="Selected Card"
                style={{ height: "100%", width: "100%", borderRadius: "50%" }}
              />
            </div>
            <div>
              <h5>{selectedMsg ? selectedMsg.userName : ""}</h5>
            </div>
          </div>
        </div>
        <div>
          <div>
            <h5>
              We recommend to speak to the vendor & reachan agreement of terms
              before "Accepting the offer"
            </h5>
          </div>
          <div className="text-center">
            {/* <input type="checkbox" className="custom-checkbox m-1" />{" "} */}
            <label>Are you want to remove this request</label>
          </div>
          <div className="d-flex justify-content-end align-items-center mt-3">
            <button
              type="button"
              className="btn btn-primary m-1"
              onClick={() => RemoveNeed()}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-primary m-1"
              onClick={() => {
                closeModal();
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptOffer;
