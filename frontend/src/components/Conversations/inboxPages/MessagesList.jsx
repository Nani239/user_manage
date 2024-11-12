import React, { useState } from "react";
import MessageItem from "./MessageItem";
import "./messages.css"; // Import updated styles
import { useSelector } from "react-redux";
import SearchFilter from "./SearchFilter";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import "./Styles/MessagesList.css";
import { toast } from "react-toastify";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
function MessageList({ onSelectConversation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { convos, msgSearchTerm, loadingNotif, myConnections, myJobOffers } =
    useSelector((state) => state.messages);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const handleClose = () => {
    setAnchorEl(null);
  };
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-dot": {
      backgroundColor: theme.palette.primary.main,
    },
  }));
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const filteredConversations = convos.filter(
    (convo) =>
      convo.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convo.Message?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const clearSearch = () => setSearchTerm("");

  let pendingJobs = Array.isArray(myJobOffers)
    ? myJobOffers.filter(
        (job) => job.created_by !== user.UserID && job.job_status == 0
      )
    : [];
  let pendingConnections = Array.isArray(myConnections)
    ? myConnections.filter(
        (connect) =>
          connect.created_by !== user.UserID && connect.connection_status == 0
      )
    : [];
  return (
    <div className="message-list">
      <div
        className="d-flex p-1"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div>
          <p
            onClick={() => {
              navigate(-1);
            }}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "12px",
              left: "17px",
              fontSize: "18px",
              color: "#000",
              zIndex: 999,
            }}
          >
            <FaArrowLeft
              style={{
                marginRight: "6px",
                fontSize: "18px",
                marginTop: "-3px",
              }}
            />
          </p>
        </div>
        <h2>Messages</h2>
        <div className="plus-icon">
          <i
            className="fas fa-ellipsis-h"
            style={{ cursor: "pointer" }}
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={(event) => handleClick(event)}
          >
            <FaPlus />
          </i>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                minWidth: "100px", // Adjust width as needed
                borderRadius: "10px",
              },
            }}
          >
            <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
              <span
                style={{ flexGrow: 1 }}
                onClick={() => navigate("/weddingvendors")}
              >
                Browse Vendors
              </span>
            </MenuItem>
            <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
              <span
                style={{ flexGrow: 1 }}
                onClick={() => navigate("/Localcommunityads")}
              >
                Browse Ads
              </span>
            </MenuItem>
            <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
              <span
                style={{ flexGrow: 1 }}
                onClick={() => navigate("/notifications/Job-Offers")}
              >
                Job Requests
                <StyledBadge
                  badgeContent={pendingJobs?.length}
                  color="primary"
                  style={{ marginLeft: "12px" }}
                />
              </span>
            </MenuItem>
            <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
              <span
                style={{ flexGrow: 1 }}
                onClick={() => navigate("/notifications/Connection-requests")}
              >
                Connection Requests
                <StyledBadge
                  badgeContent={pendingConnections.length}
                  color="primary"
                  style={{ marginLeft: "12px" }} // Add some spacing
                />
              </span>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        clearSearch={clearSearch}
      />
      <div className="all-messages">
        {filteredConversations.map((conv) => (
          <MessageItem
            key={conv.Id}
            conversation={conv}
            onSelectConversation={onSelectConversation}
          />
        ))}
      </div>
    </div>
  );
}

export default MessageList;
