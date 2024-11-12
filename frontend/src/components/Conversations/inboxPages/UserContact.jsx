import React, { useEffect, useState } from "react";

import { AiFillEye } from "react-icons/ai";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsX } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfileSidebar.css"; // Custom CSS
import {
  FaSearch,
  FaUserFriends,
  FaFileAlt,
  FaStickyNote,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Collapse,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminResponseModal from "./VendorOffers/AdminResponseModal";
import {
  makeCall,
  MessageStatusUpdate,
  sendMsgMail,
  virtualTourViewProvider,
} from "../../../components/Header/Data";
import { toast } from "react-toastify";
import OfferDetailsModal from "./VendorOffers/OfferDetailsModal";
import OfferDetails from "./VendorOffers/OfferDetails";
import OfferStatus from "./VendorOffers/OfferStatus";
import { GetZoomLink } from "../../../components/Header/Data2";

const UserContact = ({ fetchMsgs }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();
  const { selectedConvo } = useSelector((state) => state.messages);
  const customerTimezone = selectedConvo?.customerTimezone?.split(",")[0];
  const providerTimezone = selectedConvo?.providerTimezone?.split(",")[0];
  const result = getTimeDifference(customerTimezone, providerTimezone);
  const [offerDetailsModalOpen, setOfferDetailsModalOpen] = useState(false);
  const [negotiate, setNegotiate] = useState(false);
  const [accept, setAccept] = useState(false);
  const [adminResponse, setAdminResponse] = useState(false);
  const [adminResponseType, setAdminResponseType] = useState("");
  const [tourData, setTourData] = useState({});
  const logUser = localStorage.getItem("USER_ROLE") === "provider";
  const [collapse, setCollapse] = React.useState({
    messages: false,
    people: false,
    files: false,
    notepad: false,
  });
  const viewProfile = (msg) => {
    if (msg.createdBy === user.UserID) {
      navigate(`/userDetails/${msg.customerId}`, { state: msg.ownerId });
    } else {
      navigate(`/userDetails/${msg.createdBy}`, { state: msg.ownerId });
    }
  };

  const fecthvirtualTourViewProvider = async () => {
    let formData = {
      needId: selectedConvo?.postId,
      userId: user?.UserID,
    };
    const tourData = await virtualTourViewProvider(formData);
    setTourData(tourData[0]);
  };
  React.useEffect(() => {
    if (selectedConvo?.postType === 3) {
      fecthvirtualTourViewProvider();
    }
  }, [selectedConvo]);
  function formatDate1(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  const now = new Date();
  const formattedDate = formatDate1(now);

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

  // Example usage with Pacific Time and London

  const handleClick = async () => {
    const tourDetails = [
      {
        email: user?.Email,
        phoneNumber: user?.Phone,
        countryCode: user?.CountryCode,
      },
      {
        email: "",
        phoneNumber:
          tourData?.alternativePhoneOne === null ||
          tourData?.alternativePhoneOne === ""
            ? ""
            : tourData?.alternativePhoneOne,
        countryCode:
          tourData?.alternativePhoneOne === null ||
          tourData?.alternativePhoneOne === ""
            ? ""
            : tourData?.needCountryCode,
      },
      {
        email: "",
        phoneNumber:
          tourData?.alternativePhoneTwo === null ||
          tourData?.alternativePhoneTwo === ""
            ? ""
            : tourData?.alternativePhoneTwo,
        countryCode:
          tourData?.alternativePhoneTwo === null ||
          tourData?.alternativePhoneTwo === ""
            ? ""
            : tourData?.needCountryCode,
      },
    ];
    // needPhone;
    // alternativePhoneOne;
    // alternativePhoneTwo;
    // needEmail;
    // needCountryCode;
    // needUserPhone;
    let newPerson2;
    let newPerson3;
    if (tourData?.needPhone === tourData?.needUserPhone) {
      newPerson2 = {
        email: tourData?.needEmail, // Assuming anotherUser is defined
        phoneNumber: tourData?.needUserPhone,
        countryCode: tourData?.needCountryCode,
      };
    } else {
      newPerson2 = {
        email: tourData?.needEmail, // Assuming anotherUser is defined
        phoneNumber: tourData?.needUserPhone,
        countryCode: tourData?.needCountryCode,
      };
      newPerson3 = {
        email: "", // Assuming anotherUser is defined
        phoneNumber: tourData?.needPhone,
        countryCode: tourData?.needCountryCode,
      };
    }
    tourDetails.push(newPerson2);
    if (newPerson3) {
      tourDetails.push(newPerson3);
    }
    const stringifiedPeople = JSON.stringify(tourDetails);
    let formData = {
      email: user?.Email,
      phoneNumber: user?.Phone,
      countryCode: user?.CountryCode,
      phoneDetails: stringifiedPeople,
    };
    const response = await makeCall(formData);
    toast.success("Call started and Zoom link sent");
    if (response === "initiating call") {
      const formData = {
        startTime: formattedDate,
        needName: selectedConvo?.postName,
      };
      const linkResponse = await GetZoomLink(formData, selectedConvo?.Id);
      let formData1 = {
        zoomlink: linkResponse.join_url,
        phoneDetails: stringifiedPeople,
        customerId: user?.UserID,
      };
      await sendMsgMail(formData1);
    } else {
      throw new Error("Response from makeCall was invalid");
    }
  };
  const toggle = (section) => {
    setCollapse((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <>
      {/* User Profile Section */}
      <div className="text-center">
        <img
          src={
            selectedConvo?.createdBy !== user?.UserID
              ? selectedConvo?.senderPhoto && selectedConvo.senderPhoto.trim()
                ? selectedConvo.senderPhoto
                : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
              : selectedConvo?.receiverProfilePhoto &&
                selectedConvo.receiverProfilePhoto.trim()
              ? selectedConvo.receiverProfilePhoto
              : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
          }
          alt="profile"
          className="rounded-circle mb-2"
          width={40}
        />
        <h5>
          {selectedConvo?.createdBy !== user?.UserID
            ? selectedConvo?.senderName
            : selectedConvo?.customerName}
        </h5>
        <div className="d-flex align-items-center justify-content-center text-muted">
          {selectedConvo?.customerTimezone !== null &&
            selectedConvo?.providerTimezone !== null && (
              <small>
                <MdOutlineAccessTime className="me-1" />
                {selectedConvo?.createdBy === user?.UserID
                  ? result.split(",")[0]
                  : result.split(",")[1]}
              </small>
            )}
        </div>
      </div>
      {/* View Contract Button */}
      <div
        className="text-center my-3"
        onClick={() => viewProfile(selectedConvo)}
      >
        <button className="btn btn-outline-success">
          <AiFillEye className="me-1" />
          View Contact
        </button>
      </div>
      <ListGroup flush>
        {selectedConvo.postType == 3 && (
          <div className="mb-3">
            <h6 className="text-dark text-center">Offer Status:</h6>
            <OfferStatus msg={selectedConvo} />
          </div>
        )}
        {tourData &&
          tourData?.statusvalue === 1 &&
          tourData?.venueToCustomer === 1 &&
          selectedConvo?.createdBy === user?.UserID &&
          selectedConvo?.postType === 3 && (
            <div className="mb-3 text-center">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleClick}
              >
                <span>Start Virtual Tour</span>
              </button>
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

export default UserContact;
