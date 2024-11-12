import React, { useState } from "react";
import CallDetailsModal from "../VendorOffers/CallDetailsModal";
import ScheduleCallModal from "../VendorOffers/ScheduleCallModal";
import AcceptZoomModal from "../VendorOffers/AcceptZoomModal";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { FaChevronDown } from "react-icons/fa";

const CallButton = () => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [acceptZoom, setAcceptZoom] = useState(false);
  const [reSchedule, setReSchedule] = useState(false);
  const [missedCall, setMissedCall] = useState(false);
  const [scheduleCall, setScheduleCall] = useState(false);
  const [callDetails, setCallDetails] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const closeZoomModal = (e) => {
    // e.stopPropagation();
    setAcceptZoom(false);
    setReSchedule(false);
  };
  const handleAccept = (event, msg) => {
    event.stopPropagation();
    setSelectedMsg(msg);
    setAcceptZoom(true);
  };
  console.log(selectedConversation, "Call_Details");
  return (
    <div>
      {/* ZoomStatus === 1 view call*/}
      {user.RoleId !== 1 &&
        selectedConversation.postType === 3 &&
        selectedConversation.zoomStatus === 1 && (
          <div>
            {user.UserID !== selectedConversation.zoomRole ? (
              <div className="d-flex justify-content-start align-items-center">
                <button
                  className="btn btn-sm text-nowrap mt-4 m-0 px-1"
                  style={{ backgroundColor: "#FBAFC9" }}
                  onClick={(event) => handleAccept(event, selectedConversation)}
                >
                  Call Requested
                </button>{" "}
                <AcceptZoomModal
                  isOpen={acceptZoom}
                  closeModal={(e) => closeZoomModal(e)}
                  reSchedule={reSchedule}
                  setReSchedule={setReSchedule}
                  msg={selectedMsg}
                  // fetchData={fetchData}
                />
              </div>
            ) : (
              <div>
                {" "}
                <div className="d-flex justify-content-start align-items-center">
                  <button
                    className="btn btn-sm text-nowrap mt-4 m-0 px-1"
                    style={{ backgroundColor: "#FBAFC9" }}
                    disabled
                  >
                    Call Request Sent
                  </button>{" "}
                </div>
              </div>
            )}
          </div>
        )}
      {user.RoleId === 1 &&
        selectedConversation.postType === 3 &&
        selectedConversation.zoomStatus === 1 && (
          <div className="d-flex justify-content-start align-items-center">
            <button
              className="btn btn-sm text-nowrap mt-4 m-0 px-1"
              style={{ backgroundColor: "#FBAFC9" }}
              disabled
            >
              Call Requested
            </button>{" "}
          </div>
        )}
      {selectedConversation?.postType === 3 &&
        selectedConversation?.zoomStatus === 4 && (
          <div>
            {selectedConversation.zoomRole !== user.UserID ? (
              <div className="d-flex justify-content-start align-items-center ">
                <button
                  className="btn btn-warning btn-sm text-nowrap m-0 px-1 mt-4"
                  onClick={(event) => handleAccept(event, selectedConversation)}
                >
                  View Reschedule
                </button>{" "}
                <AcceptZoomModal
                  isOpen={acceptZoom}
                  closeModal={(e) => closeZoomModal(e)}
                  reSchedule={reSchedule}
                  setReSchedule={setReSchedule}
                  msg={selectedMsg}
                  // fetchData={fetchData}
                />
              </div>
            ) : (
              <div className="d-flex justify-content-start align-items-center">
                <button
                  className="btn btn-sm text-nowrap mt-4 m-0 px-1"
                  style={{ backgroundColor: "#FBAFC9" }}
                  disabled
                >
                  Call Rescheduled
                </button>{" "}
              </div>
            )}
          </div>
        )}
      {selectedConversation?.postType === 3 &&
        selectedConversation?.zoomStatus === 6 && (
          <div className="d-flex justify-content-start align-items-center">
            <button
              className="btn btn-success btn-sm text-nowrap mt-4 m-0 px-1"
              // style={{ backgroundColor: "#FBAFC9" }}
              disabled
            >
              Call Discussed
            </button>{" "}
          </div>
        )}
      {selectedConversation?.postType === 3 &&
        selectedConversation?.zoomStatus === 7 && (
          <div className="d-flex justify-content-start align-items-center">
            <button
              className="btn btn-danger btn-sm text-nowrap mt-4 m-0 px-1"
              // style={{ backgroundColor: "#FBAFC9" }}
              disabled
            >
              Call Cancelled
            </button>{" "}
          </div>
        )}
      {selectedConversation?.postType === 3 &&
        selectedConversation?.zoomStatus === 5 && (
          <div className="d-flex justify-content-start align-items-center">
            <button
              className="btn btn-danger btn-sm text-nowrap mt-4 m-0 px-1"
              // style={{ backgroundColor: "#FBAFC9" }}
              disabled
            >
              Call Not Attended
            </button>{" "}
          </div>
        )}
      {selectedConversation?.postType === 3 &&
        selectedConversation?.zoomStatus === 3 && (
          <Button
            className="d-flex justify-content-start text-white align-items-center"
            style={{ backgroundColor: "#69706b", fontSize: "x-small" }}
            disabled
            size="sm"
          >
            Call Scheduled
          </Button>
        )}
      {selectedConversation?.postType === 3 &&
        selectedConversation?.zoomStatus === 0 &&
        user.RoleId === 1 && (
          <div className="d-flex justify-content-start align-items-center">
            <button
              className="btn btn-sm text-nowrap m-0 px-1 mt-4"
              style={{ backgroundColor: "#98D9EE" }}
              disabled
            >
              Call Not Scheduled
            </button>{" "}
          </div>
        )}
      {selectedConversation?.postType === 3 &&
        selectedConversation?.zoomStatus === 2 && (
          <div className="d-flex justify-content-start align-items-center">
            <button
              className="btn btn-danger btn-sm text-nowrap mt-4 m-0 px-3"
              disabled
            >
              Rejected
            </button>{" "}
          </div>
        )}
      {user.RoleId !== 1 &&
        selectedConversation.postType === 3 &&
        selectedConversation.zoomStatus === 0 && (
          <>
            {selectedConversation.messageStatus !== 2 ? (
              <div className="d-flex justify-content-start align-items-center">
                <button
                  type="button"
                  className="btn btn-sm text-nowrap m-0 px-1"
                  style={{ backgroundColor: "#98D9EE" }}
                  onClick={() => setScheduleCall(true)}
                >
                  Schedule a Call
                </button>{" "}
                <ScheduleCallModal
                  isOpen={scheduleCall}
                  closeModal={() => setScheduleCall(false)}
                  selectedConversation={selectedConversation}
                  // fetchData={fetchData}
                />
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-danger btn-sm text-nowrap m-0 px-1 mt-4"
                disabled
              >
                Cant Schedule
              </button>
            )}
          </>
        )}
      {/* <a
        onClick={() => {
          setCallDetails(true);
        }}
        className="text-center text-decoration-underline"
      >
        <small>View Details</small>
      </a> */}
      <CallDetailsModal
        isOpen={callDetails}
        closeModal={() => {
          setCallDetails(false);
          setReSchedule(false);
          setMissedCall(false);
        }}
        selectedConversation={selectedConversation}
        reSchedule={reSchedule}
        setReSchedule={setReSchedule}
        missedCall={missedCall}
        setMissedCall={setMissedCall}
      />
    </div>
  );
};

export default CallButton;
