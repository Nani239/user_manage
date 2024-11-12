import React, { useEffect, useState } from "react";
// import Modal from "react-modal";
import { useSelector } from "react-redux";
import PlaceHolder from "../../../../assets/images/Placeholder.png";
import { toast } from "react-toastify";
import { Input, Label, FormGroup, Form, Row, Col, Modal } from "reactstrap";
import {
  ReportCustomer,
  getConvoById,
} from "../../../../components/Header/Data2";
import "./offers.css";
import {
  MessageStatusUpdate,
  NegotiateOffer,
} from "../../../../components/Header/Data";

const NegotiateModal = ({ isOpen, closeModal, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [history, setHistory] = useState([]);
  const [budgetThreshold, setBudgetThreshold] = useState([]);
  const [accept, setAccept] = useState(false);
  const [negotiate, setNegotiate] = useState(false);
  const [reject, setReject] = useState(false);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const msg = useSelector((state) => state.messages.selectedConvo);
  const fetchMsgs = async () => {
    const messagesData = await getConvoById(msg.Id);
    const filterhistory = messagesData.filter(
      (msg) => msg.messageStatus === 6 || msg.messageStatus === 7
    );
    const negoThreshold = msg.Budget * 0.9;
    const filterThreshold = messagesData.filter(
      (message) =>
        (message.messageStatus === 6 || message.messageStatus === 7) &&
        message.createdBy !== user.UserID &&
        message.Budget < negoThreshold
    );
    setBudgetThreshold(filterThreshold);
    setHistory(filterhistory);
  };
  const negotiateClick = (e, msg) => {
    setNegotiate(true);
  };
  const RejectToggle = (event) => {
    event.stopPropagation();
    setReject(true);
  };
  const AcceptToggle = (event) => {
    event.stopPropagation();
    setAccept(true);
  };
  useEffect(() => {
    fetchMsgs();
    console.log(history, "history");
    console.log(msg, "msg");
  }, [msg]);
  const handleReport = async () => {
    if (isLoading) return;
    setIsLoading(true);
    // toast.warning(`Reported ${msg.userName}`);
    if (budgetThreshold.length > 0) {
      await ReportCustomer(msg.Id);
      toast.warning(`Reported ${msg.userName}`);
      closeModal();
    }
    setIsLoading(false);
  };
  const handleRejectOffer = async () => {
    const status = {
      id: msg?.Id,
      messageStatus: msg.ownerId === user.UserID ? 5 : 10,
      updatedBy: user.UserID,
      Email: user.Email,
      needOwnerId: msg?.ownerId,
      finalBudget: msg?.finalBudget,
      serviceNeed: "need",
      ownerId: msg?.ownerId,
      postId: msg?.postId,
      customerId: msg?.customerId,
      messageComment: message,
      createdBy: msg.createdBy,
    };
    if (!status.messageComment) {
      toast.error("Enter Message");
      return;
    }
    await MessageStatusUpdate(status, msg?.Id);
    closeModal();
    setReject(false);
    toast.success("Offer Rejected");
    fetchData();
    setMessage("");
  };
  const handlebudget = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      value = value.substring(0, value.lastIndexOf("."));
    }
    if (value.length <= 6) {
      const parts = value.split(".");
      if (parts.length > 1) {
        parts[1] = parts[1].slice(0, 2);
        value = parts.join(".");
      }
      setBudget(value || "");
    }
  };
  const handleNegociateOffer = async (e) => {
    const negot = {
      Id: msg?.Id,
      customerId: msg?.createdBy,
      postId: msg?.postId,
      postType: 3, // message 1 or requestQuote 2 or offer my service 3
      Description: message,
      Email: user.Email,
      messageStatus: msg.ownerId !== user.UserID ? 7 : 6,
      createdBy: user.UserID,
      roleId: user.RoleId,
      ownerId: msg?.ownerId,
      Budget: budget,
      finalBudget: budget,
      needId: msg?.postId,
      needName: msg?.postName,
      updatedBy: user.UserID,
      userName: user.UserName,
      needName: msg?.postName,
      serviceNeed: "need",
      parentId: msg?.parentId == 0 ? msg?.Id : msg?.parentId,
      updatedBy: user.UserID,
    };
    if (!budget) {
      toast.error("Enter Budget");
      return;
    } else if (!message) {
      toast.error("Enter Message");
      return;
    }
    await NegotiateOffer(negot);
    closeModal();
    toast.success(`Sent Negotiation to ${budget} `);
    fetchData();
    setBudget(null);
    setMessage("");
  };
  const GoBackNego = (e, msg) => {
    e.stopPropagation();
    setNegotiate(false);
  };
  const handleAcceptOffer = async () => {
    const status = {
      messageStatus: msg.ownerId === user.UserID ? 4 : 9,
      updatedBy: user.UserID,
      Email: user.Email,
      parentId: msg?.parentId,
      needOwnerId: msg?.ownerId,
      finalBudget: msg?.finalBudget,
      id: msg?.Id,
      messageComment: message,
      serviceNeed: "need",
      ownerId: msg?.ownerId,
      postId: msg?.postId,
      customerId: msg?.customerId,
      createdBy: msg.createdBy,
    };
    // if (!status.messageComment) {
    //   toast.error("Enter Message");
    //   return;
    // }
    await MessageStatusUpdate(status, msg?.Id);
    toast.success("Offer Accepted");
    setAccept(false);
    setMessage("");
    fetchData();
    closeModal();
  };

  function convertTo12HourFormat(time24) {
    if (!time24) {
      return "";
    }
    const [hour24, minute] = time24.split(":").map(Number);
    if (isNaN(hour24) || isNaN(minute)) {
      return "";
    }
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = (hour24 % 12 || 12).toString().padStart(2, "0"); // Added padStart
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  }
  function convertDate(dateStr) {
    if (!dateStr) {
      return ""; // Return a placeholder or indication for an empty date
    }
    let date = new Date(dateStr);
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let formattedDate = `${
      monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;

    return formattedDate;
  }
  console.log(history, "history");
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
          padding: "20px",
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "1px solid gray",
          borderRadius: "20px",
          maxHeight: "80%",
          overflowY: "scroll",
        },
      }}
      size="lg"
    >
      <div className="d-flex me-3 mt-3 justify-content-end">
        <button
          type="button"
          className="btn-close"
          onClick={closeModal}
        ></button>
      </div>
      <div className="modal-body">
        {msg && !negotiate && !accept && !reject ? (
          <div>
            <h5 className="text-center">View Negotiation History</h5>
            <div style={{ height: "300px", overflowY: "scroll" }}>
              {history &&
                history.map((message, index) => (
                  <div className="history-box" key={index}>
                    <div className="d-flex justify-content-end">
                      {index === 0 && (
                        <span>
                          {convertDate(message?.createdAt.split("T")[0])}{" "}
                          {convertTo12HourFormat(
                            message?.createdAt.split("T")[1]
                          )}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        // position: "absolute",
                        //top: "-80px",
                        gap: "15px",
                      }}
                      className="d-flex align-items-center "
                    >
                      <img
                        src={
                          message?.messageStatus === 6
                            ? msg?.receiverProfilePhoto === ""
                              ? PlaceHolder
                              : msg?.receiverProfilePhoto
                            : msg?.senderPhoto === ""
                            ? PlaceHolder
                            : msg?.senderPhoto
                        }
                        alt={message?.senderName}
                        style={{
                          height: "60px",
                          width: "60px",
                          borderRadius: "50%",
                        }}
                        className="mt-0"
                      />
                      <h5
                        className="mt-2"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "150px",
                        }}
                      >
                        {message?.senderName}
                      </h5>
                    </div>
                    <div className="mb-3 ">
                      <Label htmlFor="Approve"> Offer Details</Label>{" "}
                      <div className="square-details d-flex align-items-center p-2 ">
                        <span>{message.Message}</span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="Approve"> Price</label>
                      <div className="square-price d-flex align-items-center p-2">
                        <span>$ {message.Budget}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="d-flex justify-content-start mt-3">
              {msg.createdBy === user.UserID && (
                <span>
                  <b>Note:</b> We do not allow customers to suggest prices
                  exceeding a 10% price drop from the initial offer. Vendors may
                  stay firm on their rates.
                </span>
              )}
            </div>
            <div className="d-flex flex-wrap justify-content-center justify-content-md-end mt-3">
              {msg?.zoomStatus === 6 && (
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm mx-1 my-1"
                  onClick={(event) => AcceptToggle(event)}
                >
                  Accept
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-danger btn-sm mx-1 my-1"
                onClick={(event) => RejectToggle(event)}
              >
                Reject
              </button>
              {msg?.zoomStatus === 6 && (
                <button
                  type="button"
                  className="btn btn-warning btn-sm mx-1 my-1"
                  onClick={(e) => negotiateClick(e, msg)}
                >
                  Negotiate
                </button>
              )}
              {msg.createdBy === user.UserID && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm mx-1 my-1"
                  disabled={(budgetThreshold.length > 0 && false) || isLoading}
                  onClick={() => {
                    handleReport();
                  }}
                >
                  Report customer
                </button>
              )}
            </div>
          </div>
        ) : !negotiate && accept ? (
          <div>
            <h5 className="text-center">Accepting Offer</h5>
            {/* <Form>
              <FormGroup>
                <Label>
                  Message <b className="text-danger">*</b>
                </Label>
                <Input
                  type="textarea"
                  name="message"
                  placeholder="Type message.."
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormGroup>
            </Form> */}
            <div className="text-center p-2">
              <b>
                Before you accept the offer or proceed with payment, please make
                sure you have discussed all deal terms with the site inbox
                section to document all details of the deal
              </b>
            </div>
            <div className="d-flex justify-content-end align-items-center mt-3">
              <button
                type="button"
                className="btn btn-success mx-1"
                onClick={handleAcceptOffer}
              >
                Accept Offer
              </button>
              <button
                type="button"
                className="btn btn-danger mx-1"
                onClick={() => {
                  setAccept(false);
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        ) : !negotiate && reject ? (
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
                className="btn mx-1"
                style={{ backgroundColor: "#A2D4ED" }}
                onClick={handleRejectOffer}
              >
                Reject Offer
              </button>
              <button
                type="button"
                className="btn btn-danger mx-1"
                onClick={() => {
                  setReject(false);
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <div className="position-relative">
            <div
              style={{ position: "absolute", top: "-80px", gap: "15px" }}
              className="d-flex align-items-center justify-content-center"
            >
              <img
                src={
                  message?.messageStatus === 6
                    ? msg?.receiverProfilePhoto === ""
                      ? PlaceHolder
                      : msg?.receiverProfilePhoto
                    : msg?.senderPhoto === ""
                    ? PlaceHolder
                    : msg?.senderPhoto
                }
                alt={
                  msg?.createdBy === user?.UserID
                    ? msg?.userName
                    : msg?.senderName
                }
                style={{ height: "60px", width: "60px", borderRadius: "50%" }}
                className="mt-0"
              />
              <h5 className="mt-2">
                {msg?.createdBy === user?.UserID
                  ? msg?.userName
                  : msg?.senderName}
              </h5>
            </div>
            {/* <h5 className="text-center"> Negotiating Offer</h5> */}
            <div className="mt-5">
              <Form>
                <FormGroup>
                  <Label>
                    Package price <b className="text-danger">*</b>
                  </Label>
                  <Input
                    type="number"
                    name="Budget"
                    //value={`${budget}`}
                    placeholder="$00.00"
                    onChange={(e) => handlebudget(e)}
                  />
                </FormGroup>
                {msg.ownerId === user.UserID &&
                  budget &&
                  budget < msg.finalBudget * 0.9 && (
                    <div className="text-danger">
                      You may not suggest prices exceeding 10% price drop from
                      the initial offer ({msg.finalBudget})
                    </div>
                  )}
                <FormGroup>
                  <Label>
                    Message<b className="text-danger">*</b>
                  </Label>
                  <Input
                    type="textarea"
                    // value={message}
                    placeholder="Type message.."
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </FormGroup>
              </Form>
            </div>
            <div>
              {msg?.createdBy !== user?.UserID && (
                <span>
                  <b>Note :</b> Here we offer you a chance to suggest a fair
                  price to the vendor, but please note that we do not allow
                  negotiation price drops to exceed 10% of the initial offer.
                  Vendors may stay firm on their rates.
                </span>
              )}
            </div>
            <div className="d-flex justify-content-end mt-3">
              {" "}
              <button
                type="button"
                className="btn btn-warning mx-1 text-nowrap"
                onClick={(e) => handleNegociateOffer(e)}
              >
                Negotiate Offer
              </button>
              <button
                type="button"
                className="btn btn-danger mx-1 text-nowrap"
                onClick={(e) => GoBackNego(e, msg)}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NegotiateModal;
