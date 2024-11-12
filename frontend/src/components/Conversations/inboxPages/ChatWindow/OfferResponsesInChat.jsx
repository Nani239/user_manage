import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import {
  GetZoomLink,
  ZoomStatusUpdate,
} from "../../../../components/Header/Data2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AcceptZoomModal from "../VendorOffers/AcceptZoomModal";
import OfferDetailsModal from "../VendorOffers/OfferDetailsModal";
import { useNavigate } from "react-router-dom";
import ScheduleCallModal from "../VendorOffers/ScheduleCallModal";

const OfferResponsesInChat = ({ lastMsg, parentMsg }) => {
  const navigate = useNavigate();
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [reSchedule, setReSchedule] = useState(false);
  const [zoomModal, setZoomModal] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [isCallDisabled, setIsCallDisabled] = useState(true);
  function formatDate(inputDate) {
    var dateParts = inputDate.split("-");
    var date = new Date(dateParts[2], parseInt(dateParts[0]) - 1, dateParts[1]);
    var options = { year: "numeric", month: "long", day: "numeric" };
    var formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }
  const AcceptZoomCall = async () => {
    const formattedStartTime = "2024-04-20T08:09:58.000Z";
    const formData = {
      startTime: formattedStartTime,
      needName: parentMsg?.postName,
    };
    try {
      const linkResponse = await GetZoomLink(formData, parentMsg.Id);
      if (linkResponse && linkResponse.id && linkResponse.join_url) {
        const updateFormData = {
          updatedBy: user.UserID,
          zoomStatus: 3,
          meetingId: linkResponse.id,
          meetingLink: linkResponse.join_url,
          meetingStartLink: linkResponse.start_url,
          needName: parentMsg?.postName,
        };
        await ZoomStatusUpdate(updateFormData, parentMsg.Id);
        closeZoomModal();
        toast.success("Call Accepted");
        navigate(-1);
      } else {
        toast.error("Error: Invalid response format or join_url not found");
      }
    } catch (error) {
      console.error("Error accepting Zoom call:", error);
      toast.error("An error occurred while accepting the Zoom call");
    }
  };

  // const handleAcceptOffer = async () => {
  //   if (lastMsg.ownerId === user.UserID) {
  //     const status = {
  //       messageStatus: parentMsg.ownerId === user.UserID ? 4 : 9,
  //       updatedBy: user.UserID,
  //       Email: user.Email,
  //       parentId: parentMsg?.parentId,
  //       needOwnerId: parentMsg?.ownerId,
  //       finalBudget: parentMsg?.finalBudget,
  //       id: parentMsg?.Id,
  //       messageComment: message,
  //       serviceNeed: "need",
  //       ownerId: parentMsg?.ownerId,
  //       postId: parentMsg?.postId,
  //       customerId: parentMsg?.customerId,
  //     };
  //     if (!status.messageComment) {
  //       toast.error("Enter Message");
  //       return;
  //     }
  //     await MessageStatusUpdate(status, parentMsg?.Id);
  //     toast.success("Offer Accepted");
  //     setAccept(false);
  //     setMessage("");
  //     closeModal();
  //     navigate(-1);
  //   }
  // };

  const handleReschedule = () => {
    setReSchedule(true);
    setZoomModal(true);
    // navigate(-1);
  };
  const closeZoomModal = () => {
    setZoomModal(false);
    setReSchedule(false);
  };
  const RejectZoomCall = async () => {
    const formData = {
      updatedBy: user.UserID,
      zoomStatus: 2,
    };
    await ZoomStatusUpdate(formData, parentMsg.Id);
    toast.info("Call Rejected");
    navigate(-1);
  };
  const CallLaunch = async () => {
    if (parentMsg.meetingLink) {
      window.open(parentMsg.meetingLink, "_blank");
    } else {
      toast.error(" Link is not available.");
    }
  };

  let reserveDateParts = null;
  let formattedReserveDate = null;
  let formattedStartTime = null;

  if (parentMsg && typeof parentMsg.reserveDate === "string") {
    try {
      reserveDateParts = parentMsg.reserveDate.split("-");
      formattedReserveDate = `${reserveDateParts[1]}-${reserveDateParts[2]}-${reserveDateParts[0]}`;
    } catch (error) {
      console.error("Error parsing selectedCard.availableFrom:", error);
      formattedReserveDate = "";
    }
  }

  useEffect(() => {
    if (!parentMsg) return;
    const startTimeParts = parentMsg?.startTime?.split(":");
    const reserveDate = new Date(parentMsg?.reserveDate);
    reserveDate.setHours(startTimeParts && startTimeParts[0]);
    reserveDate.setMinutes(startTimeParts && startTimeParts[1]);
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDiffInSeconds = (currentTime - reserveDate) / 1000; // Difference in seconds
      if (timeDiffInSeconds >= 0 && timeDiffInSeconds <= 15 * 60) {
        setIsCallDisabled(false); // Enable the button when within the 15-minute window
      } else {
        setIsCallDisabled(true); // Disable the button when outside the 15-minute window
      }
    }, 1000); // Check every second
    return () => clearInterval(intervalId);
  }, [parentMsg]);

  function convertTo12HourFormat(time24) {
    if (!time24) {
      return "";
    }
    const [hour24, minute] = time24.split(":").map(Number);
    if (isNaN(hour24) || isNaN(minute)) {
      return "";
    }
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  if (parentMsg && typeof parentMsg.startTime === "string") {
    formattedStartTime = convertTo12HourFormat(parentMsg.startTime);
  } else {
    formattedStartTime = "";
  }
  return (
    <div>
      <Row
        sm={6}
        style={{
          width: "100%",
          height: "100%",
          marginTop: "2%",
          marginLeft: "0%",
        }}
      >
        <Col
          sm={6}
          className="d-flex flex-column align-items-center justify-content-around"
        >
          <h5 style={{ fontSize: "15px" }}>
            {parentMsg &&
            parentMsg.messageStatus === 3 &&
            parentMsg.postType === "3"
              ? "Offer Response"
              : "No Offer Response"}
          </h5>
          {lastMsg &&
            (lastMsg.messageStatus === 3 ||
              lastMsg.messageStatus === 6 ||
              lastMsg.messageStatus === 7) &&
            lastMsg.postType === "3" && (
              <Row className="mb-1 pb-1">
                <Col sm={4}>
                  {" "}
                  {parentMsg?.zoomStatus === 6 && (
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      // onClick={(event) => AcceptToggle(event)}
                    >
                      Accept
                    </button>
                  )}
                </Col>
                <Col sm={4}>
                  {parentMsg?.zoomStatus === 6 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      // onClick={(event) => RejectToggle(event)}
                    >
                      Reject
                    </button>
                  )}
                </Col>
                <Col sm={4}>
                  {parentMsg?.zoomStatus === 6 && (
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      // onClick={(e) => negotiateClick(e, msg)}
                    >
                      Negotiate
                    </button>
                  )}
                </Col>
              </Row>
            )}
        </Col>
        <Col
          sm={6}
          className="d-flex flex-column align-items-center justify-content-around"
        >
          <h5 style={{ fontSize: "15px" }}>
            {(parentMsg &&
              user.RoleId !== 1 &&
              user.UserID !== parentMsg.zoomRole &&
              parentMsg.zoomStatus === 1) ||
            parentMsg.zoomStatus === 0
              ? "Call Response"
              : parentMsg && user.RoleId !== 1 && parentMsg.zoomStatus === 3
              ? `Call scheduled on ${formatDate(
                  formattedReserveDate
                )} at ${convertTo12HourFormat(parentMsg?.startTime)} for 15mins`
              : "No Call Response"}
          </h5>
          {parentMsg &&
            user.RoleId !== 1 &&
            user.UserID !== parentMsg.zoomRole &&
            parentMsg.zoomStatus === 1 && (
              <Row className="mb-1 pb-1">
                <Col sm={4}>
                  {" "}
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => AcceptZoomCall()}
                  >
                    Accept
                  </button>
                </Col>

                <Col sm={4}>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => RejectZoomCall()}
                  >
                    Reject
                  </button>
                </Col>
                <Col sm={4}>
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={() => handleReschedule()}
                  >
                    ReSchedule
                  </button>
                  <ScheduleCallModal
                    isOpen={zoomModal}
                    closeModal={() => setZoomModal(false)}
                    msg={parentMsg}
                    // fetchData={fetchData}
                  />
                </Col>
              </Row>
            )}
          {parentMsg && user.RoleId !== 1 && parentMsg.zoomStatus === 0 && (
            <>
              <button
                type="button"
                className="btn btn-sm text-nowrap m-0 px-1 mt-1"
                style={{ backgroundColor: "#98D9EE" }}
                onClick={console.log("Clicked")}
              >
                Schedule a Call
              </button>
            </>
          )}
          {parentMsg && user.RoleId !== 1 && parentMsg.zoomStatus === 3 && (
            <>
              <small className="mt-2">
                Note: Only Start the call at the Scheduled Time!
              </small>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => CallLaunch()}
                disabled={isCallDisabled}
              >
                Start Call
              </button>
            </>
          )}
        </Col>
      </Row>
      <hr />
    </div>
  );
};

export default OfferResponsesInChat;
