import React from "react";
import { AiFillEye } from "react-icons/ai";
import { MdOutlineAccessTime } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Collapse, ListGroup, ListGroupItem } from "reactstrap";
import OfferStatus from "./VendorOffers/OfferStatus";
import { FaUserFriends } from "react-icons/fa";
import OfferDetails from "./VendorOffers/OfferDetails";
import {
  makeCall,
  sendMsgMail,
  virtualTourViewProvider,
} from "../../../components/Header/Data";
import { toast } from "react-toastify";
import { GetZoomLink } from "../../../components/Header/Data2";
import {
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { CustomToggleButton } from "../../../styles/StyledSwitch";

const AdminContact = ({ fetchMsgs }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();
  const { selectedConvo } = useSelector((state) => state.messages);
  const [collapse, setCollapse] = React.useState({
    messages: false,
    people: false,
    files: false,
    notepad: false,
  });
  function getTimeDifference(customerTimezone, providerTimezone) {
    const customerDate = new Date().toLocaleString("en-US", {
      timeZone: customerTimezone,
    });
    const customerTime = new Date(customerDate);
    const providerDate = new Date().toLocaleString("en-US", {
      timeZone: providerTimezone,
    });
    const providerTime = new Date(providerDate);
    const customerToProviderDiff =
      (providerTime - customerTime) / (1000 * 60 * 60);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedCustomerTime = new Intl.DateTimeFormat(
      "en-US",
      options
    ).format(customerTime);
    const formattedProviderTime = new Intl.DateTimeFormat(
      "en-US",
      options
    ).format(providerTime);
    const customerOffset = customerTime.getTimezoneOffset() / -60;
    const providerOffset = providerTime.getTimezoneOffset() / -60;
    const finalOutput = `
        ${formattedCustomerTime} GMT${
      customerOffset >= 0 ? "+" : ""
    }${customerOffset} (${Math.abs(customerToProviderDiff)} h ahead),
        ${formattedProviderTime} GMT${
      providerOffset >= 0 ? "+" : ""
    }${providerOffset} (${Math.abs(-customerToProviderDiff)} h behind)
    `;

    return finalOutput.trim();
  }
  const viewProfile = (msgId, msg) => {
    navigate(`/userDetails/${msgId}`, { state: msg.ownerId });
  };
  const toggle = (section) => {
    setCollapse((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };
  const [role, setRole] = React.useState("sender");

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };
  return (
    <>
      {/* message sender  */}
      <ToggleButtonGroup
        value={role}
        exclusive
        onChange={handleRoleChange}
        aria-label="role toggle"
        sx={{
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
        }}
        className="mb-3"
      >
        <CustomToggleButton value="sender">Sender</CustomToggleButton>
        <CustomToggleButton value="receiver">Receiver</CustomToggleButton>
      </ToggleButtonGroup>
      {/*Profile*/}
      {role == "sender" ? (
        <div className="text-center">
          <img
            src={
              selectedConvo?.senderPhoto && selectedConvo.senderPhoto.trim()
                ? selectedConvo.senderPhoto
                : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
            }
            alt="profile"
            className="rounded-circle mb-2"
            width={40}
          />
          <h5>{selectedConvo?.senderName}</h5>
          <div
            className="text-center my-3"
            onClick={() => viewProfile(selectedConvo.createdBy, selectedConvo)}
          >
            <button className="btn btn-outline-success">
              <AiFillEye className="me-1" />
              View Contact
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <img
            src={
              selectedConvo?.receiverProfilePhoto &&
              selectedConvo.receiverProfilePhoto.trim()
                ? selectedConvo.receiverProfilePhoto
                : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
            }
            alt="profile"
            className="rounded-circle mb-2"
            width={40}
          />
          <h5>{selectedConvo?.customerName}</h5>
          <div
            className="text-center my-3"
            onClick={() => viewProfile(selectedConvo.customerId, selectedConvo)}
          >
            <button className="btn btn-outline-success">
              <AiFillEye className="me-1" />
              View Contact
            </button>
          </div>
        </div>
      )}
      <ListGroup flush>
        {selectedConvo.postType == 3 && (
          <div className="mb-3">
            <h6 className="text-dark text-center">Offer Status:</h6>
            <OfferStatus msg={selectedConvo} />
          </div>
        )}
        {selectedConvo.postType == 3 && (
          <ListGroupItem tag="button" action onClick={() => toggle("people")}>
            <FaUserFriends className="me-2" /> Offer Details
          </ListGroupItem>
        )}
        <Collapse isOpen={collapse.people}>
          <div className="my-2 d-flex justify-content-center">
            <OfferDetails fetchMsgs={fetchMsgs} />
          </div>
        </Collapse>
      </ListGroup>
    </>
  );
};

export default AdminContact;
