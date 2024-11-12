import { useSelector } from "react-redux";
import AcceptZoomModal from "../VendorOffers/AcceptZoomModal";
import CallDetailsModal from "../VendorOffers/CallDetailsModal";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import { Button } from "reactstrap";
import ScheduleCallModal from "../VendorOffers/ScheduleCallModal";

const CallDetails = ({ fetchData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(false);
  const msg = useSelector((state) => state.messages.selectedConvo);
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [acceptZoom, setAcceptZoom] = useState(false);
  const [scheduleCall, setScheduleCall] = useState(false);
  const [reSchedule, setReSchedule] = useState(false);
  const [missedCall, setMissedCall] = useState(false);
  const [callDetails, setCallDetails] = useState(false);
  //   const selectedMsg = msg; // Assuming you have msg from props or state

  const renderButton = () => {
    // if (msg.postType !== 3) return null;
    switch (msg.zoomStatus) {
      case 0:
        return user.RoleId === 1 ? (
          "Call Not Scheduled"
        ) : (
          <>{msg.messageStatus !== 2 ? "Schedule a Call" : "Can't Schedule"}</>
        );
      case 1:
        return user.RoleId !== 1 && msg.zoomRole !== user.UserID
          ? "Call Requested"
          : "Call Request Sent";
      case 2:
        return "Rejected";
      case 3:
        return "Call Scheduled";
      case 4:
        return msg.zoomRole !== user.UserID
          ? "View Reschedule"
          : "Call Rescheduled";
      case 5:
        return "Call Not Attended";
      case 6:
        return " Call Discussed";
      case 7:
        return "Call Cancelled";
      default:
        return null;
    }
  };
  const getButtonBackgroundColor = () => {
    switch (msg.zoomStatus) {
      case 0:
        return "#f5c6cb"; // Light red for "Call Not Scheduled"
      case 1:
        return "#ffdd57"; // Yellow for "Call Requested"
      case 2:
        return "#dc3545"; // Red for "Rejected"
      case 3:
        return "#28a745"; // Green for "Call Scheduled"
      case 4:
        return "#ffc107"; // Amber for "Call Rescheduled"
      case 5:
        return "#007bff"; // Blue for "Call Not Attended"
      case 6:
        return "#17a2b8"; // Teal for "Call Discussed"
      case 7:
        return "#6c757d"; // Gray for "Call Cancelled"
      default:
        return "#fdaec9"; // Default light pink if no status matches
    }
  };
  const handleAccept = (event, msg) => {
    event.stopPropagation();
    setAcceptZoom(true);
  };
  const closeZoomModal = (e) => {
    // e.stopPropagation();
    setAcceptZoom(false);
    setReSchedule(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentMenu(false);
  };
  const handleCallDetails = () => {
    setCallDetails(true);
    setAnchorEl(null);
    setCurrentMenu(false);
  };
  const handleSchedule = () => {
    setScheduleCall(true);
    setReSchedule(false);
    setAnchorEl(null);
    setCurrentMenu(false);
  };
  return (
    <div>
      <div className="wc-chat-drop">
        <Button
          className="drop-button"
          style={{
            backgroundColor: getButtonBackgroundColor(),
            color: "white",
            fontSize: "x-small",
          }}
          size="sm"
          onClick={handleClick}
        >
          <span className="drop-button-title">
            {renderButton()}
            <FaChevronDown />
          </span>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={currentMenu}
          onClose={handleClose}
          PaperProps={{
            style: {
              minWidth: "120px",
              maxWidth: "200px",
            },
          }}
        >
          {msg.zoomStatus === 0 ? (
            <MenuItem onClick={handleSchedule}>Schedule Call</MenuItem>
          ) : (
            <MenuItem onClick={handleCallDetails}>View Call Details</MenuItem>
          )}
        </Menu>
      </div>
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
        fetchData={fetchData}
      />
      <AcceptZoomModal
        isOpen={acceptZoom}
        closeModal={(e) => closeZoomModal(e)}
        reSchedule={reSchedule}
        setReSchedule={setReSchedule}
        msg={msg}
        fetchData={fetchData}
      />
      <AcceptZoomModal
        isOpen={acceptZoom}
        closeModal={(e) => closeZoomModal(e)}
        reSchedule={reSchedule}
        setReSchedule={setReSchedule}
        msg={msg}
        fetchData={fetchData}
      />
      <ScheduleCallModal
        isOpen={scheduleCall}
        closeModal={() => setScheduleCall(false)}
        msg={msg}
        fetchData={fetchData}
      />
    </div>
  );
};

export default CallDetails;
