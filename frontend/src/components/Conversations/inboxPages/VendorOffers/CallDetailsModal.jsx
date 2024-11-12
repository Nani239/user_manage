import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import {
  GetZoomLink,
  ReportMissedCall,
  ZoomStatusUpdate,
} from "../../../../components/Header/Data2";
import { toast } from "react-toastify";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { missedCallSMS } from "../../../../components/Header/Data";
import CustomerAvaliableCalander from "../../../../components/Header/CustomerAvaliableCalander";
import moment from "moment";
const CallDetailsModal = ({
  isOpen,
  closeModal,
  fetchData,
  msg,
  reSchedule,
  setReSchedule,
  missedCall,
  setMissedCall,
}) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [reserveDate, setReserveDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isCallDisabled, setIsCallDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [reserveDateTime, setReserveDateTime] = useState(null);
  const callHistory =
    msg && msg.zoomCallHistory && JSON.parse(msg?.zoomCallHistory);
  const participants = callHistory?.participants || [];
  const dateTime = `${msg?.reserveDate} ${msg?.startTime}`;
  const fomrmatedTime = moment(dateTime, "YYYY-MM-DD HH:mm")?.format(
    "MMMM D, YYYY [at] hh:mm A"
  );
  const providerZone = msg?.providerTimezone;
  const CustZone = msg?.customerTimezone;

  const proTime = providerZone?.split(",")[0];
  const custTime = CustZone?.split(",")[0];

  const proZone = providerZone?.split(",")[1];
  const custZone = CustZone?.split(",")[1];

  const timeZoneFormat = (newDate, timeZone1, timeZone2) => {
    let protimelast, custtimelast;
    if (msg?.zoomRole === msg?.createdBy) {
      const protime = moment.tz(newDate, timeZone1);
      protimelast = protime.format("MMMM D, YYYY [at] hh:mm A");
      const custtime = moment.tz(protime, timeZone2);
      custtimelast = custtime.format("MMMM D, YYYY [at] hh:mm A");
    } else {
      const protime = moment.tz(newDate, timeZone2);
      protimelast = protime.format("MMMM D, YYYY [at] hh:mm A");
      const custtime = moment.tz(protime, timeZone1);
      custtimelast = custtime.format("MMMM D, YYYY [at] hh:mm A");
    }
    return { protimelast, custtimelast };
  };
  const response = timeZoneFormat(dateTime, proTime, custTime);
  const custDateTime = moment(
    response.custtimelast,
    "MMMM DD, YYYY [at] hh:mm A"
  );
  const custoDate = custDateTime.format("YYYY-MM-DD");
  const custoTime = custDateTime.format("HH:mm");
  // Parse and format the professional's date and time
  const proDateTime = moment(
    response.protimelast,
    "MMMM DD, YYYY [at] hh:mm A"
  );
  const provDate = proDateTime.format("YYYY-MM-DD");
  const provTime = proDateTime.format("HH:mm");
  useEffect(() => {
    if (!msg) return;
    let reserveDateTime;
    if (msg?.zoomRole !== user?.UserID) {
      reserveDateTime = new Date(`${custoDate}T${custoTime}`);
    } else {
      reserveDateTime = new Date(`${provDate}T${provTime}`);
    }
    setReserveDateTime(reserveDateTime);
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDiffInSeconds = (reserveDateTime - currentTime) / 1000;
      if (timeDiffInSeconds <= 5 * 60 && timeDiffInSeconds >= -15 * 60) {
        setIsCallDisabled(false); // Enable the button when within the 15-minute window
      } else {
        setIsCallDisabled(true); // Disable the button when outside the 15-minute window
      }
    }, 1000); // Check every second

    // Initial check when component mounts
    const currentTime = new Date();
    const timeDiffInSeconds = (reserveDateTime - currentTime) / 1000;
    if (timeDiffInSeconds <= 5 * 60 && timeDiffInSeconds >= -15 * 60) {
      setIsCallDisabled(false); // Enable the button when within the 15-minute window
    } else {
      setIsCallDisabled(true); // Disable the button when outside the 15-minute window
    }

    return () => clearInterval(intervalId);
  }, []);
  const handleClick = () => {
    setMissedCall(true);
  };
  const ReportOther = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const email =
      participants[0]?.user_email === msg.senderEmail
        ? msg.customerEmail
        : msg.senderEmail;
    await ReportMissedCall(email);
    closeModal();
    setIsLoading(false);
    toast.success(`Reported Other Party`);
  };

  const CallCancel = async () => {
    const formData = {
      updatedBy: user.UserID,
      zoomStatus: 7,
    };
    await ZoomStatusUpdate(formData, msg.Id);
    toast.info("Call Canceled");
    closeModal();
  };

  const CallLaunch = async (e, msg) => {
    e.stopPropagation();
    if (msg.meetingLink) {
      window.open(msg.meetingLink, "_blank");
    } else {
      toast.error(" Link is not available.");
    }
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
      toast.error("Please do not enter a previous date");
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
      customerTimezone: CustZone,
      providerTimezone: providerZone,
      zoomRole: user.UserID,
    };
    await ZoomStatusUpdate(formData, msg.Id);
    closeModal();
    toast.success(`Reschedule Request Sent`);
    fetchData();
  };
  const MessageRemainder = async () => {
    // createdBy is sender
    // customerId is reciver or owner
    // ownerId is owner of the need /service
    // if (isLoading) return;
    // setIsLoading(true);

    const customerId =
      msg?.ownerId === user?.UserID ? msg?.createdBy : msg.ownerId;
    const formData = {
      msgId: msg?.Id,
      postName: msg?.postName,
      meetingLink: msg?.meetingLink,
      customerName:
        msg?.createdBy === user?.UserID ? msg?.providerUserName : msg?.userName,
    };
    await missedCallSMS(formData, customerId);
    closeModal();
    setIsLoading(false);
    toast.success("Remainder sent");
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
  const convertTo12Hour = (time) => {
    if (typeof time !== "string") {
      return "";
    }
    const [hours, minutes] = time.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes} ${suffix}`;
  };

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
  const isPastDateTime = (reserveDate, startTime) => {
    const reserveDateTime = new Date(`${reserveDate}T${startTime}`);
    const currentDateTime = new Date();
    return reserveDateTime < currentDateTime;
  };
  const isPast = isPastDateTime(msg?.reserveDate, msg?.startTime);
  const AcceptZoomCall = async () => {
    setIsLoading(true);

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

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={closeModal}
        onRequestClose={() => {
          closeModal();
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
            // height: "80%",
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
          {reSchedule ? (
            <div>
              <div className="m-2">
                <p className="py-2">
                  <b className="text-black">Note: </b>All the scheduled calls
                  are set to the default PST timezone. If necessary, please go
                  to the Profile section to change the timezone
                </p>
                {msg?.ownerId === user.UserID ? (
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
                ) : (
                  <>
                    <span>
                      <small>
                        <b>
                          {" "}
                          Please schedule the call using the tool below within
                          the Other Party mentioned availability schedule.
                        </b>
                      </small>
                    </span>
                    <CustomerAvaliableCalander
                      reserveDate={reserveDate}
                      startTime={startTime}
                      setReserveDate={setReserveDate}
                      setStartTime={setStartTime}
                      availableDays={parsedAvailability}
                      ownerId={msg.customerId}
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
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-warning mx-1"
                  onClick={() => setReSchedule(false)}
                >
                  Go back
                </button>
                <button
                  type="button"
                  className="btn btn-danger mx-1"
                  onClick={() => {
                    ReSchedule();
                  }}
                >
                  Reschedule
                </button>
              </div>
            </div>
          ) : missedCall ? (
            <>
              <h3 className="text-center">Report Missed Call</h3>

              <div className="mt-3 text-center inter-font">
                Utilize this feature to instantly send vendor a TEXT reminder to
                join meeting. Wait up to 5mins for vendor to join the scheduled
                meeting. If vendor does not "show" then proceed with reporting
                the vendor with the "Report" button below
              </div>

              <div className="mt-5 d-flex justify-content-evenly">
                <button
                  className="btn btn-success"
                  onClick={MessageRemainder}
                  disable={isLoading}
                >
                  Send Text Message Remainder
                </button>
                <button
                  className="btn btn-danger"
                  onClick={ReportOther}
                  disable={isLoading}
                >
                  Report Other Party
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="text-center mt-3">
                {msg?.zoomStatus === 0 && (
                  <h5 className="mb-4">No Calls Scheduled</h5>
                )}
                {msg?.zoomStatus === 1 && (
                  <>
                    {msg?.zoomRole === user.UserID ? (
                      <>
                        <h5>
                          {" "}
                          Call Request Sent for {response.protimelast}
                          {providerZone?.split(",")[1]} for 30 mins
                        </h5>
                      </>
                    ) : (
                      <>
                        <h5 className="">
                          Call Requested for{" "}
                          {user.RoleId !== 1
                            ? response.custtimelast
                            : response.protimelast}{" "}
                          {user.RoleId !== 1
                            ? CustZone?.split(",")[1]
                            : providerZone?.split(",")[1]}{" "}
                          for 30 mins
                        </h5>
                      </>
                    )}
                  </>
                )}
                {msg?.zoomStatus === 2 && <h5>Call rejected</h5>}
                {msg?.zoomStatus === 3 && (
                  <>
                    {msg?.zoomRole === user?.UserID ? (
                      <>
                        <h5 className="m-3">
                          {" "}
                          Call Scheduled for {response.protimelast}{" "}
                          {msg?.zoomRole !== msg?.createdBy
                            ? custZone
                            : proZone}
                          &nbsp;for 30 mins
                        </h5>
                      </>
                    ) : user.RoleId !== 1 ? (
                      <>
                        <h5 className="m-3">
                          Call Scheduled for {response.custtimelast}
                          {msg?.zoomRole !== msg?.createdBy
                            ? proZone
                            : custZone}{" "}
                          for 30 mins
                        </h5>
                      </>
                    ) : (
                      <h5 className="m-3">
                        {" "}
                        Call Scheduled for {response.protimelast}{" "}
                        {msg?.zoomRole !== msg?.createdBy ? custZone : proZone}{" "}
                        for 30 mins
                      </h5>
                    )}
                  </>
                )}
                {msg?.zoomStatus === 4 && (
                  <>
                    {msg?.updatedBy === msg?.zoomRole ? (
                      <h5>
                        Rescheduled To{" "}
                        {msg?.zoomRole === user?.UserID
                          ? (user?.UserID === 4 && response.protimelast) ||
                            response.protimelast
                          : (user?.UserID !== 4 && response.custtimelast) ||
                            response.custtimelast}{" "}
                        {user && user.UserID === msg?.createdBy
                          ? providerZone?.split(",")[1]
                          : user?.UserID === 1
                          ? proZone?.split(",")[1]
                          : CustZone?.split(",")[1]}
                        &nbsp;for 30 mins
                      </h5>
                    ) : (
                      <h5>
                        Rescheduled To{" "}
                        {msg?.zoomRole !== user?.UserID
                          ? response.protimelast
                          : response.custtimelast}{" "}
                        {user && user.UserID !== 4
                          ? providerZone?.split(",")[1]
                          : user?.UserID === 1
                          ? proZone?.split(",")[1]
                          : CustZone?.split(",")[1]}{" "}
                        &nbsp;for 30 mins
                      </h5>
                    )}
                  </>
                )}
                {msg?.zoomStatus === 5 && (
                  <h5>Both or either parties not joined the call</h5>
                )}
                {msg?.zoomStatus === 6 && <h5>Call completed</h5>}
                {msg?.zoomStatus === 7 && <h5>Call Cancelled</h5>}
              </div>
              <div>
                {msg?.zoomStatus === 3 && user.RoleId !== 1 && (
                  <small className="mx-4">
                    <b>Note:</b> The "Start Call" button is enabled 5 minutes
                    before the scheduled call time
                  </small>
                )}
              </div>
              <div className="d-flex justify-content-end mt-1">
                <div>
                  {user.UserID !== msg?.zoomRole &&
                    // user.RoleId !== 1 &&
                    (msg?.zoomStatus === 1 || msg?.zoomStatus === 4) && (
                      <>
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
                      </>
                    )}
                  {msg?.zoomStatus !== 0 && user.RoleId !== 1 && (
                    <button
                      type="button"
                      className="btn btn-danger mx-1 text-nowrap"
                      onClick={() => {
                        setReSchedule(true);
                        setMissedCall(false);
                      }}
                    >
                      {msg?.zoomStatus === 2 ||
                      msg?.zoomStatus === 5 ||
                      msg?.zoomStatus === 6 ||
                      msg?.zoomStatus === 7
                        ? "Schedule Again"
                        : "Request Reschedule"}
                    </button>
                  )}

                  {msg?.zoomStatus === 3 && (
                    //  user.RoleId !== 1 &&
                    <>
                      <button
                        type="button"
                        className="btn btn-success mx-1 text-nowrap"
                        onClick={(e) => CallCancel(e, msg)}
                        // disabled={isCallDisabled}
                      >
                        Cancel Call
                      </button>
                      <button
                        type="button"
                        className="btn btn-success mx-1 text-nowrap"
                        onClick={(e) => CallLaunch(e, msg)}
                        disabled={isCallDisabled}
                      >
                        Start Call
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {!missedCall &&
            !reSchedule &&
            user.RoleId !== 1 &&
            !isCallDisabled &&
            (msg.zoomStatus === 3 || msg.zoomStatus === 5) && (
              <div className="text-end mx-1 mt-2" onClick={handleClick}>
                <a style={{ cursor: "pointer" }}>
                  <u>Report Missed Call</u>
                </a>
              </div>
            )}
          {user.RoleId !== 1 && !isPast && !missedCall && (
            <span className="text-danger d-flex justify-content-end mt-3">
              <small>
                <b>
                  Warning: Your communication score will be negatively affected
                  if you reschedule.
                </b>
              </small>
            </span>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CallDetailsModal;
