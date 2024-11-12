import React from "react";
import { BsX } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfileSidebar.css"; // Custom CSS
import { useSelector } from "react-redux";
import UserContact from "./UserContact";
import AdminContact from "./AdminContact";
const ContactDetails = ({
  message,
  toggleDrawer,
  isDrawerOpen,
  isMobileView,
  fetchMsgs,
}) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const isAdmin = user && user.Role === "admin"; // Check if user is admin
  return (
    <div
      className={`chat-details ${
        isDrawerOpen ? "open" : "closed"
      } border-0 shadow-sm profile-sidebar border rounded p-3`}
      style={{ overflowY: "scroll" }}
    >
      {isMobileView && (
        <button onClick={toggleDrawer} className="close-details-button ">
          <BsX size={24} className="close-icon" />
        </button>
      )}
      {!isAdmin && <UserContact message={message} fetchMsgs={fetchMsgs} />}
      {isAdmin && <AdminContact message={message} fetchMsgs={fetchMsgs} />}
    </div>
  );
};

export default ContactDetails;
