import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import PlaceHolder from "../../../../assets/images/Placeholder.png";
import { useSelector } from "react-redux";
import {
  MessageStatusUpdate,
  NegotiateOffer,
} from "../../../../components/Header/Data";
import { toast } from "react-toastify";
import { Input, Label, FormGroup, Form } from "reactstrap";
import "./offers.css";
import ScheduleCallModal from "./ScheduleCallModal";
import CallDetailsModal from "./CallDetailsModal";

const AdminResponseModal = ({
  isOpen,
  closeModal,
  adminResponseType,
  msg,
  fetchData,
}) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, []);

  const handleApproveAdmin = async (event, msg) => {
    if (!message) {
      toast.error("Enter Message");
      return;
    }
    event.stopPropagation();
    const status = {
      messageStatus: 3,
      updatedBy: user.UserID,
      customerId: msg.ownerId,
      needName: msg.postName,
      Budget: msg.Budget,
      Message: msg.Message,
      Email: msg.customerEmail,
      createdBy: msg.createdBy,
      messageComment: message,
    };
    await MessageStatusUpdate(status, msg.Id);
    fetchData();
    toast.success("Offer Accepted");
  };
  const handlerejectAdmin = async (event, msg) => {
    if (!message) {
      toast.error("Enter Message");
      return;
    }
    event.stopPropagation();
    const status = {
      messageStatus: 2,
      postId: msg?.postId,
      updatedBy: user.UserID,
      createdBy: msg?.createdBy,
      needName: msg?.postName,
      Message: msg?.Message,
      messageComment: message,
      createdBy: msg.createdBy,
    };
    await MessageStatusUpdate(status, msg.Id);
    fetchData();
    toast.success("Offer Rejected");
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={closeModal}
        onRequestClose={() => {
          closeModal(); // Close the modal
          setMessage("");
        }}
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
          {msg && adminResponseType === "approve" ? (
            <div>
              <h5 className="text-center">Accepting Offer</h5>
              <Form>
                <FormGroup>
                  <Label>
                    Message <b className="text-danger">*</b>
                  </Label>
                  <Input
                    type="textarea"
                    name="message"
                    placeholder="Please explain why you are rejecting the offer..."
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </FormGroup>
              </Form>
              <div className="d-flex justify-content-end align-items-center mt-3">
                <button
                  type="button"
                  className="btn btn-success m-1"
                  onClick={(event) => handleApproveAdmin(event, msg)}
                >
                  Accept Offer
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h5 className="text-center"> Rejecting Offer</h5>
              <Form>
                <FormGroup>
                  <Label>
                    Message <b className="text-danger">*</b>
                  </Label>
                  <Input
                    type="textarea"
                    name="message"
                    placeholder="Please explain why you are rejecting the offer..."
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </FormGroup>
              </Form>
              <div className="d-flex justify-content-end align-items-center mt-3">
                <button
                  type="button"
                  className="btn m-1"
                  style={{ backgroundColor: "#A2D4ED" }}
                  onClick={(event) => handlerejectAdmin(event, msg)}
                >
                  Reject Offer
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AdminResponseModal;
