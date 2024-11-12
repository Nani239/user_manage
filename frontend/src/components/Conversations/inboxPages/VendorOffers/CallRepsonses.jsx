import React, { useState } from "react";
import AcceptZoomModal from "./AcceptZoomModal";
import ScheduleCallModal from "./ScheduleCallModal";
import { useSelector } from "react-redux";
import CallDetailsModal from "./CallDetailsModal";

const CallResponses = ({ msg, fetchData, selectedMsg, setSelectedMsg }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [acceptZoom, setAcceptZoom] = useState(false);
  const [reSchedule, setReSchedule] = useState(false);
  const [missedCall, setMissedCall] = useState(false);
  const [scheduleCall, setScheduleCall] = useState(false);
  const [callDetails, setCallDetails] = useState(false);

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

  return (
    <div>
      {/* ZoomStatus === 1 view call*/}
      {user.RoleId !== 1 && msg.postType === 3 && msg.zoomStatus === 0 && (
        <>
          {msg.messageStatus !== 2 ? (
            <div className="d-flex justify-content-start align-items-center border">
              <button
                type="button"
                className="btn btn-sm text-nowrap m-0 px-1 "
                style={{ backgroundColor: "#98D9EE" }}
                onClick={() => setScheduleCall(true)}
              >
                Schedule a Call
              </button>{" "}
              <ScheduleCallModal
                isOpen={scheduleCall}
                closeModal={() => setScheduleCall(false)}
                msg={msg}
                fetchData={fetchData}
              />
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-danger btn-sm text-nowrap m-0 px-1 "
              disabled
            >
              Cant Schedule
            </button>
          )}
        </>
      )}
      {msg?.postType === 3 && msg?.zoomStatus === 0 && user.RoleId === 1 && (
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="btn btn-sm text-nowrap m-0 px-1 "
            style={{ backgroundColor: "#98D9EE" }}
            disabled
          >
            Call Not Scheduled
          </button>{" "}
        </div>
      )}
      {user.RoleId !== 1 && msg.postType === 3 && msg.zoomStatus === 1 && (
        <div>
          {user.UserID !== msg.zoomRole ? (
            <div className="d-flex justify-content-start align-items-center">
              <button
                className="btn btn-sm text-nowrap m-0 px-1"
                style={{ backgroundColor: "#FBAFC9" }}
                onClick={(event) => handleAccept(event, msg)}
              >
                Call Requested
              </button>{" "}
              <AcceptZoomModal
                isOpen={acceptZoom}
                closeModal={(e) => closeZoomModal(e)}
                reSchedule={reSchedule}
                setReSchedule={setReSchedule}
                msg={selectedMsg}
                fetchData={fetchData}
              />
            </div>
          ) : (
            <div>
              {" "}
              <div className="d-flex justify-content-start align-items-center">
                <button
                  className="btn btn-sm text-nowrap  m-0 px-1"
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
      {user.RoleId === 1 && msg.postType === 3 && msg.zoomStatus === 1 && (
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="btn btn-sm text-nowrap  m-0 px-1"
            style={{ backgroundColor: "#FBAFC9" }}
            disabled
          >
            Call Requested
          </button>{" "}
        </div>
      )}
      {msg?.postType === 3 && msg?.zoomStatus === 2 && (
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="btn btn-danger btn-sm text-nowrap  m-0 px-3"
            disabled
          >
            Rejected
          </button>{" "}
        </div>
      )}
      {msg?.postType === 3 && msg?.zoomStatus === 3 && (
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="btn btn-dark btn-sm text-nowrap  m-0 px-1"
            disabled
          >
            Call Scheduled
          </button>{" "}
        </div>
      )}
      {msg?.postType === 3 && msg?.zoomStatus === 4 && (
        <div>
          {msg.zoomRole !== user.UserID ? (
            <div className="d-flex justify-content-start align-items-center ">
              <button
                className="btn btn-warning btn-sm text-nowrap m-0 px-1 "
                onClick={(event) => handleAccept(event, msg)}
              >
                View Reschedule
              </button>{" "}
              <AcceptZoomModal
                isOpen={acceptZoom}
                closeModal={(e) => closeZoomModal(e)}
                reSchedule={reSchedule}
                setReSchedule={setReSchedule}
                msg={selectedMsg}
                fetchData={fetchData}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-start align-items-center">
              <button
                className="btn btn-sm text-nowrap  m-0 px-1"
                style={{ backgroundColor: "#FBAFC9" }}
                disabled
              >
                Call Rescheduled
              </button>{" "}
            </div>
          )}
        </div>
      )}
      {msg?.postType === 3 && msg?.zoomStatus === 5 && (
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="btn btn-danger btn-sm text-nowrap  m-0 px-1"
            // style={{ backgroundColor: "#FBAFC9" }}
            disabled
          >
            Call Not Attended
          </button>{" "}
        </div>
      )}
      {msg?.postType === 3 && msg?.zoomStatus === 6 && (
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="btn btn-success border btn-sm text-nowrap  m-0 px-1"
            // style={{ backgroundColor: "#FBAFC9" }}
            disabled
          >
            Call Discussed
          </button>{" "}
        </div>
      )}
      {msg?.postType === 3 && msg?.zoomStatus === 7 && (
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="btn btn-danger btn-sm text-nowrap  m-0 px-1"
            // style={{ backgroundColor: "#FBAFC9" }}
            disabled
          >
            Call Cancelled
          </button>{" "}
        </div>
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
        msg={msg}
        reSchedule={reSchedule}
        setReSchedule={setReSchedule}
        missedCall={missedCall}
        setMissedCall={setMissedCall}
      />
    </div>
  );
};

export default CallResponses;
