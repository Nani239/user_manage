import React, { useState, useRef } from "react";
import AllDropdowns from "./AllDropDowns/DropDowns";
import { useSelector } from "react-redux";
import { FaChevronRight, FaEllipsisH, FaVideo } from "react-icons/fa";
import "./ChatHeader.css";
import MenuItems from "./MenuItems";
import { sendMessage } from "../../../components/Header/Data";
import { GetZoomLink } from "../../../components/Header/Data2";
import { toast } from "react-toastify";

const ChatHeader = ({
  isMobileView,
  onBack,
  toggleDrawer,
  fetchMsgs,
  fetchData,
  isChatModal,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the anchor element
  const [zoomLink, setZoomLink] = useState("");
  const [loading, setLoading] = useState(false);
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const { lcaLoading, selectedAd } = useSelector((state) => state.lcAds);
  const messages = useSelector((state) => state.messages.messages);
  const iconRef = useRef(null); // Ref for FaEllipsisH icon

  const toggleMenu = (event) => {
    setIsMenuOpen(!isMenuOpen);
    setAnchorEl(event.currentTarget); // Set the anchor element to the icon
  };
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
  const handleSend = async (zoomLink) => {
    if (zoomLink.trim()) {
      const messageForm = {
        customerId:
          selectedConversation.customerId === user.UserID
            ? selectedConversation.createdBy
            : selectedConversation.customerId,
        postId: selectedConversation.postType,
        postType: 1, // message 1 or requestQuote 2 or offer my service 3
        parentId:
          selectedConversation.parentId === 0
            ? selectedConversation.Id
            : selectedConversation.parentId,
        Description: `Click below link to join meeting <br/>  <a href="${zoomLink}" target="_blank"  style="
              padding: 5px 15px;
              border-radius: 6px;
              border: 1px solid;
              background-color: #0D6EFD;
              color: white;
            "> Join </a>`,
        messageStatus: 8,
        createdBy: user.UserID,
        roleId: user.RoleId,
        ownerId: selectedConversation.ownerId,
        userName: user.UserName,
        Email: user.Email,
        serviceNeed: "need",
        needName: selectedConversation.postName,
      };
      console.log(messageForm, "messageForm");
      console.log(selectedConversation, "messageForm");
      await sendMessage(messageForm);
      toast.success("Zoom link sent");
    }
    setZoomLink("");
    fetchMsgs();
  };
  const handleVideoClick = async () => {
    setLoading(true);
    const formData = {
      startTime: formattedDate,
      needName: selectedConversation?.postName,
    };
    try {
      const linkResponse = await GetZoomLink(
        formData,
        selectedConversation?.Id
      );
      setZoomLink(linkResponse.join_url); // Set the Zoom link

      // Now call handleSend after setting the Zoom link
      setLoading(false);
      await handleSend(linkResponse.join_url); // Pass the zoomLink to handleSend if needed
    } catch (error) {
      console.error("Error fetching Zoom link:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success or error
    }
    // let formData1 = {
    //   zoomlink: linkResponse.join_url,
    //   phoneDetails: phoneDetails,
    // };
    // await sendMsgMail(formData1);
    // } else {
    //   throw new Error("Response from makeCall was invalid");
    // }
    // await handleSend();
  };

  return (
    <div className="chat-header-container">
      <div className="chat-header">
        {isMobileView && (
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
        )}
        <div className="chat-title d-flex align-items-center">
          <h2 className="user-name">
            {selectedConversation
              ? selectedConversation?.createdBy !== user?.UserID
                ? selectedConversation?.senderName?.trim() || "UnknownUser "
                : selectedConversation?.customerName?.trim() || "UnknownUser "
              : selectedAd && selectedAd?.firstName
              ? `${selectedAd.firstName} ${selectedAd.lastName}`
              : selectedAd?.userName}
          </h2>
        </div>
        <div className="action-icons">
          <i className="fas fa-video">
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <FaVideo onClick={handleVideoClick} />
            )}
          </i>
          {!isChatModal && (
            <i
              className="fas fa-ellipsis-h"
              style={{
                cursor: "pointer",
                position: "relative",
                backgroundColor: isMenuOpen ? "#f0f0f0" : "white",
              }}
              onClick={toggleMenu}
              ref={iconRef} // Assign the ref to FaEllipsisH icon
            >
              <FaEllipsisH />
              <MenuItems
                isMenuOpen={isMenuOpen}
                toggleMenu={() => setIsMenuOpen(false)}
                anchorEl={anchorEl}
              />
            </i>
          )}
          {!isChatModal && isMobileView && (
            <i
              className="toggle-drawer-button fas fa-ellipsis-h btn"
              style={{ cursor: "pointer" }}
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
              onClick={toggleDrawer}
            >
              <FaChevronRight />
            </i>
          )}
        </div>
      </div>
      {!isChatModal && <AllDropdowns fetchData={fetchData} />}
    </div>
  );
};

export default ChatHeader;
