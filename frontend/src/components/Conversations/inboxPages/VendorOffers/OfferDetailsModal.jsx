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
import { useNavigate } from "react-router-dom";

const OfferDetailsModal = ({
  isOpen,
  closeModal,
  negotiate,
  setNegotiate,
  accept,
  setAccept,
  msg,
  fetchData,
}) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState(null);
  const [reject, setReject] = useState(false);
  const [explore, setExplore] = useState(false);
  const [openCall, setOpenCall] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [reSchedule, setReSchedule] = useState(false);
  const [missedCall, setMissedCall] = useState(false);
  const navigate = useNavigate();
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
  const AcceptToggle = (event) => {
    event.stopPropagation();
    setAccept(true);
  };
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
  };
  const RejectToggle = (event) => {
    event.stopPropagation();
    setReject(true);
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
      setBudget(value || null);
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
  const negotiateClick = (e, msg) => {
    setNegotiate(true);
  };
  const GoBackNego = (e, msg) => {
    e.stopPropagation();
    setNegotiate(false);
  };

  useEffect(() => {
    setBudget("");
    setMessage("");
    setAccept(false);
    setExplore(false);
    setReject(false);
  }, []);
  const closeModalhere = () => {
    closeModal();
    setExplore(false);
    closeModal(); // Close the modal
    setBudget(null);
    setMessage("");
    setExplore(false);
    setAccept(false);
    setNegotiate(false);
    setReject(false);
  };

  const handleCallModal = () => {
    closeModal();
    setOpenCall(true);
    setExplore(false);
  };

  const handleDetailsModal = () => {
    closeModal();
    setOpenDetails(true);
    setExplore(false);
  };
  console.log(msg, "msg");

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={closeModal}
        onRequestClose={() => {
          closeModal(); // Close the modal
          setBudget(null);
          setMessage("");
          setExplore(false);
          setAccept(false);
          setNegotiate(false);
          setReject(false);
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
            maxHeight: "80%",
            overflowY: "scroll",
            borderRadius: "20px",
          },
        }}
        size="lg"
      >
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn-close"
            onClick={closeModalhere}
          ></button>
        </div>
        <div className="modal-body position-relative">
          {msg && !negotiate && !accept && !reject ? (
            <div className="">
              <div
                style={{ position: "absolute", top: "-80px", gap: "15px" }}
                className="d-flex align-items-center justify-content-center"
              >
                <img
                  src={
                    msg?.createdBy === user?.UserID
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
                  className="mt-0 "
                />
                <h5 className="mt-2">
                  {msg?.createdBy === user?.UserID
                    ? msg?.userName
                    : msg?.senderName}
                </h5>
              </div>
              <div className="mt-5">
                <p className="text-center text-dark">
                  We recommend to speak to the vendor & reach an agreement of
                  terms before “Accepting the offer”
                </p>
                <div className="mb-3">
                  <label htmlFor="Approve" className="mb-2">
                    {" "}
                    Offer Details
                  </label>
                  <div className="square-details d-flex align-items-center p-2 ">
                    <span>{msg?.Message}</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="Approve" className="mb-2">
                    {" "}
                    Price
                  </label>
                  <div className="square-price d-flex align-items-center p-2">
                    <span>$ {msg?.finalBudget}</span>
                  </div>
                </div>
              </div>
              {explore && (
                <div className="text-center m-3">
                  {msg?.zoomStatus === 0 ? (
                    <>
                      <p className="text-start text-dark">
                        A call with{" "}
                        {msg?.ownerId === user.UserID ? ` vendor` : `customer`}{" "}
                        not been scheduled yet, please click on{" "}
                        <b
                          className="btn btn-primary btn-sm"
                          style={{ cursor: "pointer" }}
                          onClick={handleCallModal}
                        >
                          Schedule a Call
                        </b>{" "}
                        to speak with vendor
                      </p>
                    </>
                  ) : (
                    <p className=" text-start text-dark">
                      {" "}
                      A call has been scheduled with{" "}
                      {msg?.ownerId === user.UserID
                        ? ` vendor`
                        : `customer`}{" "}
                      already, please click on &nbsp;
                      <b
                        className="btn btn-primary btn-sm"
                        style={{ cursor: "pointer" }}
                        onClick={handleDetailsModal}
                      >
                        View Details
                      </b>{" "}
                      or{" "}
                      <a
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={(event) => RejectToggle(event)}
                      >
                        Reject
                      </a>{" "}
                      the Offer
                    </p>
                  )}
                </div>
              )}
              <div
                className="d-flex justify-content-end mt-3"
                style={{ gap: "2px" }}
              >
                {msg?.zoomStatus === 6 && msg?.messageStatus === 3 && (
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={(event) => AcceptToggle(event)}
                  >
                    Accept
                  </button>
                )}
                {(msg?.messageStatus === 4 || msg?.messageStatus === 9) &&
                  msg?.ownerId === user.UserID && (
                    <button
                      className="btn btn-success text-nowrap m-0 px-3"
                      onClick={(e) => handleClick(e)}
                    >
                      Proceed To Pay
                    </button>
                  )}
                {msg?.zoomStatus !== 6 && (
                  <>
                    {!explore && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setExplore(true)}
                        disabled={explore}
                      >
                        Explore Further
                      </button>
                    )}
                  </>
                )}
                {msg?.zoomStatus === 6 && msg?.messageStatus === 3 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={(event) => RejectToggle(event)}
                  >
                    Reject
                  </button>
                )}
                {msg?.zoomStatus === 6 && msg?.messageStatus === 3 && (
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={(e) => negotiateClick(e, msg)}
                  >
                    Negotiate
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
                  Before you accept the offer or proceed with payment, please
                  make sure you have discussed all deal terms with the site
                  inbox section to document all details of the deal
                </b>
              </div>

              {/* <div>
                  {msg.reserveDate} {msg.startTime} {msg.finalBudget}
                </div> */}
              <div className="d-flex justify-content-end align-items-center mt-3">
                <button
                  type="button"
                  className="btn btn-success m-1"
                  onClick={handleAcceptOffer}
                >
                  Accept Offer
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger m-1"
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
                  className="btn m-1"
                  style={{ backgroundColor: "#A2D4ED" }}
                  onClick={handleRejectOffer}
                >
                  Reject Offer
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger m-1"
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
                    msg?.createdBy === user?.UserID
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
              {/* <h5 className="text-center"> Negotiating Offer</h5>
              <div className="d-flex justify-content-start mt-3">
                <span>
                  <b>Note :</b> Here we offer you a chance to suggest a fair
                  price to the vendor, but please note that we do not allow
                  negotiation price drops to exceed 10% of the initial offer.
                  Vendors may stay firm on their rates.
                </span>
              </div> */}
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
                  {msg?.ownerId === user.UserID &&
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
              <div className="d-flex justify-content-end mt-3">
                <div className="col-sm-8">
                  <span>
                    <b>Note :</b> Here we offer you a chance to suggest a fair
                    price to the vendor, but please note that we do not allow
                    negotiation price drops to exceed 10% of the initial offer.
                    Vendors may stay firm on their rates.
                  </span>
                </div>
                <div className="col-sm-4 d-flex align-self-center gap-1">
                  <button
                    type="button"
                    className="btn btn-primary text-nowrap"
                    onClick={(e) => GoBackNego(e, msg)}
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning text-nowrap"
                    onClick={(e) => handleNegociateOffer(e)}
                  >
                    Negotiate Offer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <ScheduleCallModal
        isOpen={openCall}
        closeModal={() => setOpenCall(false)}
        msg={msg}
        fetchData={fetchData}
      />
      <CallDetailsModal
        isOpen={openDetails}
        closeModal={() => {
          setOpenDetails(false);
          setReSchedule(false);
          setMissedCall(false);
        }}
        fetchData={fetchData}
        msg={msg}
        reSchedule={reSchedule}
        setReSchedule={setReSchedule}
        missedCall={missedCall}
        setMissedCall={setMissedCall}
      />
    </>
  );
};

export default OfferDetailsModal;
