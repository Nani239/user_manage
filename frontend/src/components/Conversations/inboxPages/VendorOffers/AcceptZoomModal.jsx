import React, { useState, useEffect } from "react";
import {
  GetZoomLink,
  ZoomStatusUpdate,
} from "../../../../components/Header/Data2";
import Modal from "react-modal";
import PlaceHolder from "../../../../assets/images/Placeholder.png";
import { useSelector } from "react-redux";
import { Input, Label, FormGroup, Form } from "reactstrap";
import { toast } from "react-toastify";
import CustomerAvaliableCalander from "../../../../components/Header/CustomerAvaliableCalander";
import moment from "moment-timezone";

const AcceptZoomModal = ({
  isOpen,
  closeModal,
  reSchedule,
  setReSchedule,
  msg,
  fetchData,
}) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [reserveDate, setReserveDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const providerZone = msg?.providerTimezone;
  const CustZone = msg?.customerTimezone;
  console.log(msg, "msg");
  const AcceptZoomCall = async () => {
    setIsLoading(true);
    // const reserveDate = new Date(msg.reserveDate); // Convert reserveDate to a Date object
    // const startTime = new Date(reserveDate.getTime() + msg.startTime); // Add startTime to reserveDate
    // const formattedStartTime1 = startTime.toISOString();
    const formattedStartTime = "2024-04-20T08:09:58.000Z";
    const formData = {
      startTime: formattedStartTime,
      customerName: msg?.userName,
      vendorName: msg?.senderName,
      needName: msg?.postName,
    };
    try {
      const linkResponse = await GetZoomLink(formData, msg.Id);
      if (linkResponse && linkResponse.id && linkResponse.join_url) {
        const updateFormData = {
          updatedBy: user.UserID,
          zoomStatus: 3,
          meetingId: linkResponse.id,
          meetingLink: linkResponse.join_url,
          meetingStartLink: linkResponse.start_url,
          needName: msg?.postName,
          customerTimezone: CustZone,
          providerTimezone: providerZone,
        };
        await ZoomStatusUpdate(updateFormData, msg.Id);
        closeModal();
        toast.success("Call Accepted");
      } else {
        toast.error("Error: Invalid response format or join_url not found");
      }
    } catch (error) {
      console.error("Error accepting Zoom call:", error);
      toast.error("An error occurred while accepting the Zoom call");
    }
    fetchData();
    setIsLoading(false);
  };

  const dateTime = `${msg?.reserveDate} ${msg?.startTime}`;

  const timeZoneFormat = (newDate, timeZone1, timeZone2) => {
    if (msg?.zoomRole === msg?.createdBy) {
      const protime = moment.tz(newDate, timeZone1);
      const protimelast = protime.format("MMMM D, YYYY [at] hh:mm A");
      const custtime = moment.tz(protime, timeZone2);
      const custtimelast = custtime.format("MMMM D, YYYY [at] hh:mm A");
      return { protimelast, custtimelast };
    } else {
      const protime = moment.tz(newDate, timeZone2);
      const protimelast = protime.format("MMMM D, YYYY [at] hh:mm A");
      const custtime = moment.tz(protime, timeZone1);
      const custtimelast = custtime.format("MMMM D, YYYY [at] hh:mm A");
      return { protimelast, custtimelast };
    }
  };

  const response = timeZoneFormat(
    dateTime,
    providerZone?.split(",")[0],
    CustZone?.split(",")[0]
  );

  const RejectZoomCall = async () => {
    setIsLoading(true);
    const formData = {
      updatedBy: user.UserID,
      zoomStatus: 2,
    };
    await ZoomStatusUpdate(formData, msg.Id);
    toast.info("Call Rejected");
    closeModal();
    fetchData();
    setIsLoading(false);
  };
  const ReScheduleZoomCall = async () => {
    setReSchedule(!reSchedule);
  };
  const ReSchedule = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date();
    if (!reserveDate) {
      toast.error("Please enter date");
      return;
    }
    if (!startTime) {
      toast.error("Please enter time");
      return;
    }
    if (reserveDate < currentDate) {
      toast.error("Please do not enter a completed date");
      return;
    }

    const selectedDateTime = new Date(`${reserveDate}T${startTime}`);
    if (selectedDateTime < currentTime) {
      toast.error("Please do not enter a completed time");
      return;
    }
    const formData = {
      updatedBy: user.UserID,
      zoomStatus: 4,
      reserveDate: reserveDate,
      startTime: startTime,
      zoomRole: user.UserID,
    };
    await ZoomStatusUpdate(formData, msg.Id);
    closeModal();
    toast.success(`Reschedule Request Sent`);
    fetchData();
  };

  let parsedAvailability = [];
  if (msg && typeof msg.availableFrom === "string") {
    try {
      parsedAvailability = JSON.parse(msg.availableFrom);
    } catch (error) {
      console.error("Error parsing msg.availableFrom:", error);
      parsedAvailability = [];
    }
  }

  const isPastDateTime = (reserveDate, startTime) => {
    const reserveDateTime = new Date(`${reserveDate}T${startTime}`);
    const currentDateTime = new Date();
    return reserveDateTime < currentDateTime;
  };
  const isPast = isPastDateTime(msg?.reserveDate, msg?.startTime);

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
          onClick={closeModal}
        ></button>
      </div>
      <div className="modal-body">
        <div className="modal-body ">
          <div className="d-flex flex-row align-items-center pb-3">
            <div style={{ width: "50px", height: "50px", marginRight: "30px" }}>
              <img
                src={
                  msg
                    ? msg?.createdBy === user?.UserID
                      ? msg?.receiverProfilePhoto
                      : msg?.senderPhoto
                    : PlaceHolder
                }
                alt="Selected Card"
                style={{ height: "100%", width: "100%", borderRadius: "50%" }}
              />
            </div>
            <div>
              <h5>
                {msg?.createdBy === user?.UserID
                  ? msg?.customerName === null
                    ? msg?.userName
                    : msg?.customerName
                  : msg?.senderName === null
                  ? msg?.providerUserName
                  : msg?.senderName}
              </h5>
            </div>
          </div>
          {msg && !reSchedule ? (
            <>
              <h5>
                {msg?.zoomStatus === 4
                  ? `The other party has requested to Reschedule at this time:`
                  : "The other party has requested to Schedule a call at the following time"}{" "}
                {msg?.zoomRole === user?.UserID
                  ? (user?.UserID === 4 && response.protimelast) ||
                    response.protimelast
                  : (user?.UserID !== 4 && response.custtimelast) ||
                    response.custtimelast}
                {msg?.zoomRole !== msg?.createdBy
                  ? providerZone?.split(",")[1]
                  : CustZone?.split(",")[1]}
                &nbsp;for 30 mins
              </h5>

              {isPast && (
                <p className="pt-2 text-danger">
                  Scheduled call is expired, please schedule again
                </p>
              )}
            </>
          ) : (
            <>
              <span>
                <small>
                  <b>
                    {" "}
                    Please schedule the call using the tool below within the
                    Other Party mentioned availability schedule.
                  </b>
                </small>
              </span>
              <p className="py-2">
                <b className="text-black">Note: </b> All the scheduled calls are
                set to the default PST timezone. If necessary, please go to the
                Profile section to change the timezone
              </p>
              {msg?.ownerId === user.UserID ? (
                <div>
                  <Form>
                    <FormGroup>
                      <Label>
                        Date <b className="text-danger">*</b>
                      </Label>
                      <Input
                        type="date"
                        name="date"
                        onChange={(e) => setReserveDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        // min={new Date().toLocaleTimeString([], {
                        //   hour: "2-digit",
                        //   minute: "2-digit",
                        // })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>From</Label>
                      <Input
                        type="time"
                        name="StartTime"
                        onChange={(e) => setStartTime(e.target.value)}
                        min={new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      />
                    </FormGroup>
                  </Form>
                </div>
              ) : (
                <>
                  <CustomerAvaliableCalander
                    reserveDate={reserveDate}
                    startTime={startTime}
                    setReserveDate={setReserveDate}
                    setStartTime={setStartTime}
                    availableDays={parsedAvailability}
                    ownerId={msg?.customerId}
                  />
                </>
              )}
              {startTime && (
                <p>
                  <small>
                    The Calls will be scheduled for 30 min starting from{" "}
                    {convertTo12Hour(startTime)}
                  </small>
                </p>
              )}
            </>
          )}
          {msg && !reSchedule ? (
            <div>
              <div
                className="d-flex justify-content-end mt-3"
                style={{ gap: "2px" }}
              >
                {!isPast && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => {
                        AcceptZoomCall();
                      }}
                      disabled={isLoading}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        RejectZoomCall();
                      }}
                      disabled={isLoading}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-outline-warning"
                  onClick={() => {
                    ReScheduleZoomCall();
                  }}
                  disabled={isLoading}
                >
                  Reschedule
                </button>
              </div>
              {user.RoleId !== 1 && !isPast && (
                <span className="text-danger d-flex justify-content-end mt-3">
                  <small>
                    <b>
                      Warning: Your communication score will be negatively
                      affected if you reschedule.
                    </b>
                  </small>
                </span>
              )}
            </div>
          ) : (
            <div
              className="d-flex justify-content-end mt-3"
              style={{ gap: "2px" }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  ReScheduleZoomCall();
                }}
              >
                Go Back
              </button>
              <button
                type="button"
                className="btn btn-outline-warning"
                onClick={() => {
                  ReSchedule();
                }}
              >
                Schedule
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AcceptZoomModal;
