import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { MessageStatusUpdate } from "../../../../components/Header/Data";
import { toast } from "react-toastify";
import NegotiateAppointmentModal from "./NegotiateAppointment";

const QuoteResponces = ({ msg, fetchData }) => {
  const [negotiate, setNegotiate] = useState(false);
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;

  const handleApproveAdmin = async (event, msg) => {
    event.stopPropagation();
    const status = {
      messageStatus: 3,
      updatedBy: user.UserID,
      customerId: msg.ownerId,
      needName: msg.postName,
      Budget: msg.Budget,
      Message: msg.Message,
      Email: msg.customerEmail,
      postType: 2,
      createdBy: msg.createdBy,
    };
    await MessageStatusUpdate(status, msg.Id);
    fetchData();
    toast.success("Appointment Approved");
  };
  const handlerejectAdmin = async (event, msg) => {
    event.stopPropagation();
    const status = {
      messageStatus: 2,
      postId: msg.postId,
      updatedBy: user.UserID,
      createdBy: msg.createdBy,
      needName: msg.postName,
      Message: msg.Message,
      postType: 2,
      createdBy: msg.createdBy,
    };
    await MessageStatusUpdate(status, msg.Id);
    fetchData();
    toast.success("Appointment Canceled");
  };
  const handlereject = async (event, msg) => {
    event.stopPropagation();
    const status = {
      messageStatus: msg.ownerId === user.UserID ? 10 : 5,
      //messageStatus === 5 customer Rejected offer
      //messageStatus === 10 Provider Rejected offer
      postId: msg.postId,
      updatedBy: user.UserID,
      createdBy: msg.createdBy,
      needName: msg.postName,
      Message: msg.Message,
      createdBy: msg.createdBy,
    };
    await MessageStatusUpdate(status, msg.Id);
    fetchData();
    toast.success("Appointment Canceled");
  };
  const handleAccept = async (event, msg) => {
    event.stopPropagation();
    const status = {
      //messageStatus === 4 customer Accepted offer
      //messageStatus === 9 Provider Accepted offer
      messageStatus: msg.ownerId === user.UserID ? 9 : 4,
      updatedBy: user.UserID,
      Email: user.Email,
      parentId: msg?.parentId,
      needOwnerId: msg?.ownerId,
      finalBudget: msg?.finalBudget,
      id: msg?.Id,
      serviceNeed: "service",
      ownerId: msg?.ownerId,
      postId: msg?.postId,
      customerId: msg?.customerId,
      createdBy: msg.createdBy,
    };

    await MessageStatusUpdate(status, msg?.Id);
    toast.success("Appointment Accepted");
    fetchData();
  };
  return (
    <div>
      {(msg.messageStatus === 1 || msg.messageStatus === 0) && (
        <>
          {user.RoleId === 1 ? (
            <>
              <Button
                color="success"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handleApproveAdmin(event, msg)}
              >
                Approve
              </Button>
              <Button
                color="danger"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handlerejectAdmin(event, msg)}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              color="outline-success"
              className="btn-sm me-2 mb-2 mb-md-0"
            >
              Appointment Requested
            </Button>
          )}
        </>
      )}
      {msg.messageStatus === 2 && (
        <Button color="outline-danger" className="btn-sm me-2 mb-2 mb-md-0">
          Admin Rejected the Appointment
        </Button>
      )}
      {msg.messageStatus === 3 && (
        <>
          {msg.ownerId === user.UserID ? (
            <>
              <Button
                color="success"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handleAccept(event, msg)}
              >
                Accept
              </Button>
              <Button
                color="danger"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handlereject(event, msg)}
              >
                Reject
              </Button>
              <Button
                color="warning"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={() => setNegotiate(true)}
              >
                Negotiate
              </Button>
            </>
          ) : (
            <Button
              color="outline-warning"
              className="btn-sm me-2 mb-2 mb-md-0"
            >
              Waiting For Vendor Response
            </Button>
          )}
        </>
      )}
      {(msg.messageStatus === 4 || msg.messageStatus === 9) && (
        <>
          <Button color="outline-success" className="btn-sm me-2 mb-2 mb-md-0">
            Appointment fixed
          </Button>
        </>
      )}
      {(msg.messageStatus === 5 || msg.messageStatus === 10) && (
        <Button color="outline-danger" className="btn-sm me-2 mb-2 mb-md-0">
          {msg.createdBy === user.UserID
            ? "You cancelled the appointment"
            : "Other party cancelled the appointment"}
        </Button>
      )}
      {user.RoleId !== 1 && msg.messageStatus === 6 && (
        <>
          {msg.ownerId !== user.UserID ? (
            <>
              <Button
                color="outline-warning"
                className="btn-sm me-2 mb-2 mb-md-0"
              >
                You Negotiated
              </Button>
            </>
          ) : (
            <>
              <Button
                color="success"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handleAccept(event, msg)}
              >
                Accept
              </Button>
              <Button
                color="danger"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handlereject(event, msg)}
              >
                Reject
              </Button>
              <Button
                color="warning"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={() => setNegotiate(true)}
              >
                View Negotiation
              </Button>
            </>
          )}
        </>
      )}
      {user.RoleId !== 1 && msg.messageStatus === 7 && (
        <>
          {msg.ownerId === user.UserID ? (
            <Button
              color="outline-warning"
              className="btn-sm me-2 mb-2 mb-md-0"
            >
              You Negotiated
            </Button>
          ) : (
            <>
              <Button
                color="success"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handleAccept(event, msg)}
              >
                Accept
              </Button>
              <Button
                color="danger"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={(event) => handlereject(event, msg)}
              >
                Reject
              </Button>
              <Button
                color="warning"
                className="btn-sm me-2 mb-2 mb-md-0"
                onClick={() => setNegotiate(true)}
              >
                View Negotiation
              </Button>
            </>
          )}
        </>
      )}
      {user.RoleId === 1 &&
        (msg.messageStatus === 6 || msg.messageStatus === 7) && (
          <Button color="outline-warning" className="btn-sm me-2 mb-2 mb-md-0">
            Disscussing
          </Button>
        )}
      <NegotiateAppointmentModal
        isOpen={negotiate}
        closeModal={() => setNegotiate(false)}
        msg={msg}
        fetchData={fetchData}
      />
    </div>
  );
};

export default QuoteResponces;
