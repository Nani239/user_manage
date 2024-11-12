import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Input, Label, FormGroup, Form, Row, Col } from "reactstrap";
import { NegotiateOffer } from "../../../../components/Header/Data";
import { getConvoById } from "../../../../components/Header/Data2";

const NegotiateAppointmentModal = ({ isOpen, closeModal, msg, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState(null);
  const [negotiate, setNegotiate] = useState(false);
  const [history, setHistory] = useState([]);

  const handleNegociateOffer = async (e) => {
    const negot = {
      Id: msg?.Id,
      customerId: msg?.createdBy,
      postId: msg?.postId,
      postType: 3, // message 1 or requestQuote 2 or offer my service 3
      Description: message,
      Email: user.Email,
      messageStatus: msg.ownerId !== user.UserID ? 6 : 7, // messageStatus === 6 customer Negotiated messageStatus === 7 Provider Negotiated
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

  const GoBackNego = (e, msg) => {
    e.stopPropagation();
    setNegotiate(false);
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDateTime = date.toLocaleDateString("en-US", options);
    return formattedDateTime;
  }

  const fetchMsgs = async () => {
    const messagesData = await getConvoById(msg.Id);
    const filterhistory = messagesData.filter(
      (msg) => msg.messageStatus === 6 || msg.messageStatus === 7
    );
    setHistory(filterhistory);
  };
  useEffect(() => {
    if (history.length === 0) {
      setNegotiate(true);
    }
    fetchMsgs();
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {
        closeModal();
        setNegotiate(false);
        setBudget(null);
        setMessage("");
      }}
      onRequestClose={closeModal}
      //   onRequestClose={() => {
      //     closeModal();
      //     setNegotiate(false);
      //     setBudget(null);
      //     setMessage("");
      //   }}
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
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            closeModal();
            setNegotiate(false);
            setBudget(null);
            setMessage("");
          }}
        ></button>
      </div>
      <div className="modal-body">
        {!negotiate ? (
          <div>
            <h5 className="text-center">View Negotiation History</h5>
            <div style={{ height: "auto", overflowY: "scroll" }}>
              {history &&
                history.map((message, index) => (
                  <div className="history-box" key={index}>
                    <div className="mb-3 ">
                      <Label htmlFor="Approve"> Quote Details</Label>{" "}
                      {index === 0 ? (
                        <span className="float-end">
                          {formatDate(new Date())}
                        </span>
                      ) : (
                        ""
                      )}
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
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-warning mx-1"
                onClick={() => setNegotiate(true)}
              >
                Negotiate
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <div>
              <Label>
                Budget <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="number"
                name="message"
                id="exampleFormControlInput1"
                placeholder="Enter Budget..."
                value={budget}
                onChange={(e) => handlebudget(e)}
              />
              <Label>
                Message <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="textarea"
                name="message"
                id="exampleFormControlInput1"
                placeholder="Enter Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-danger mx-1"
                onClick={(e) => GoBackNego(e, msg)}
              >
                Go Back
              </button>
              <button
                type="button"
                className="btn btn-warning mx-1"
                onClick={(e) => handleNegociateOffer(e)}
              >
                Negotiate Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NegotiateAppointmentModal;
{
  /* <div className="d-flex justify-content-end mt-3">
  <button
    type="button"
    className="btn btn-warning mx-1"
    onClick={(e) => negotiateClick(e, msg)}
  >
    Negotiate
  </button>
</div>; */
}
