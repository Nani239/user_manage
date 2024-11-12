import React, { useState } from "react";
import { Input, Label, FormGroup, Form } from "reactstrap";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { MakeAnOffer } from "../../../../components/Header/Data";
import { toast } from "react-toastify";
import { FaQuestionCircle } from "react-icons/fa";
import CustomerAvaliableCalander from "../../../../components/Header/CustomerAvaliableCalander";
const ReasonModal = ({ isOpen, closeModal, msg, makeOffer, setMakeOffer }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [reserveDate, setReserveDate] = useState("");
  const [startTime, setStartTime] = useState("");

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
      setBudget(value);
    }
  };

  const MakeSecondOffer = async () => {
    if (isLoading) return;
    setIsLoading(true);
    // createdBy is sender
    // customerId is reciver or owner
    // ownerId is owner of the need /service
    const messageForm = {
      customerId: msg.ownerId,
      postId: msg.postId,
      postType: 3, // message 1 or requestQuote 2 or offer my service 3
      Description: message,
      messageStatus: 0,
      createdBy: user.UserID,
      roleId: user.RoleId,
      ownerId: msg.ownerId,
      userName: user.UserName,
      Email: user.Email,
      serviceNeed: "need",
      Budget: budget,
      needId: msg.postId,
      needName: msg.postName,
      startTime: startTime,
      reserveDate: reserveDate,
      zoomStatus: startTime !== "" ? 1 : 0,
      zoomRole: startTime !== "" ? user.UserID : null,
    };
    if (!budget || budget == 0) {
      toast.error("Enter valid Price");
      return;
    } else if (!messageForm.Description) {
      toast.error("Enter Message");
      return;
    }
    await MakeAnOffer(messageForm);
    toast.success("Offer sent to Admin for Approval");
    setIsLoading(false);
    closeModal();
    setMakeOffer(false);
  };

  let parsedAvailability = [];
  if (msg && typeof msg.availableFrom === "string") {
    try {
      parsedAvailability = JSON.parse(msg.availableFrom);
      console.log(parsedAvailability, "parsedAvailability");
    } catch (error) {
      console.error("Error parsing msg.availableFrom:", error);
      parsedAvailability = [];
    }
  }
  const convertTo12Hour = (time) => {
    if (typeof time !== "string") {
      return "";
    }
    const [hours, minutes] = time.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes} ${suffix}`;
  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      onRequestClose={() => {
        closeModal();
        setMakeOffer(false);
        setBudget(null);
        setMessage("");
        setSchedule(false);
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
          overflowY: "scroll",
          maxHeight: "90vh",
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
            setSchedule(false);
          }}
        ></button>
      </div>
      <div className="modal-body">
        {!makeOffer ? (
          <>
            <h5>{msg.messageComment}</h5>
            <div className="d-flex justify-content-end mt-3">
              {(msg.messageStatus === 5 || msg.messageStatus === 2) && (
                <>
                  {msg.createdBy === user.UserID &&
                    msg.updatedBy !== user.UserID && (
                      <>
                        {" "}
                        <button
                          type="button"
                          className="btn btn-danger mx-1"
                          onClick={() => setMakeOffer(true)}
                        >
                          Make Another Offer
                        </button>
                      </>
                    )}
                </>
              )}

              <button
                type="button"
                className="btn btn-outline-primary px-5"
                onClick={() => closeModal()}
              >
                Ok
              </button>
            </div>
          </>
        ) : (
          <div>
            {" "}
            <Form>
              <FormGroup>
                <Label>
                  Package Price <b className="text-danger">*</b>
                </Label>
                <Input
                  type="text"
                  name="Budget"
                  // value={budget ? `$${budget}` : null}
                  placeholder="$00.00"
                  // value={budget !== null ? `$${budget}` : 0}
                  onChange={(e) => handlebudget(e)}
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  Details <b className="text-danger">*</b>{" "}
                  <FaQuestionCircle
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Please list all services included for the price otherwise the offer may not be approved and sent to the customer"
                  />
                </Label>
                <Input
                  type="textarea"
                  placeholder="Details of the items included in the package.."
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="checkbox"
                  onChange={() => setSchedule(!schedule)}
                />{" "}
                <Label>Schedule Zoom Call</Label>
              </FormGroup>
              {schedule && (
                <Form>
                  <span>
                    <small>
                      <b>
                        {" "}
                        Please schedule the call using the tool below within the
                        Customer's mentioned availability schedule.
                      </b>
                    </small>
                  </span>
                  <p className="py-2">
                    <b className="text-black">Note: </b>All the scheduled calls
                    are set to the default PST timezone. If necessary, please go
                    to the Profile section to change the timezone
                  </p>
                  {parsedAvailability.length > 0 && (
                    <CustomerAvaliableCalander
                      reserveDate={reserveDate}
                      startTime={startTime}
                      setReserveDate={setReserveDate}
                      setStartTime={setStartTime}
                      availableDays={parsedAvailability}
                      ownerId={msg.customerId}
                    />
                  )}
                  {startTime && (
                    <p>
                      <small>
                        The Calls will be scheduled for 30 min starting from{" "}
                        {convertTo12Hour(startTime)}
                      </small>
                    </p>
                  )}
                </Form>
              )}
            </Form>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-outline-danger mx-1"
                onClick={() => setMakeOffer(false)}
              >
                Go Back
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => MakeSecondOffer()}
                disabled={isLoading}
              >
                Make Offer
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReasonModal;
