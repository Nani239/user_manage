import React, { useState } from "react";
import {
  FaEnvelope,
  FaFileAlt,
  FaRegComment,
  FaRegEnvelope,
  FaRegStar,
  FaChevronRight,
  FaChevronDown,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import FilterIcon from "./sliders.svg";
import { Menu, MenuItem, Collapse } from "@mui/material";

const SearchFilter = ({ searchTerm, setSearchTerm, clearSearch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null); // Track expanded menu

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExpandedMenu(null); // Close any expanded submenus when the main menu closes
  };

  const toggleSubMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu); // Toggle the submenu
  };

  return (
    <div className="search-bar-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {searchTerm && <FaTimes className="clear-icon" onClick={clearSearch} />}
      <img
        src={FilterIcon}
        alt="Filter Icon"
        className="filter-icon ms-1"
        onClick={(event) => handleClick(event)}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            minWidth: "200px", // Adjust width as needed
            borderRadius: "10px",
          },
        }}
      >
        <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
          <FaChevronRight
            style={{ marginRight: "10px", visibility: "hidden" }}
          />
          <span style={{ flexGrow: 1 }}>Unread</span>
          <FaRegEnvelope />
        </MenuItem>
        <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
          <FaChevronRight
            style={{ marginRight: "10px", visibility: "hidden" }}
          />
          <span style={{ flexGrow: 1 }}>Favorites</span>
          <FaRegStar />
        </MenuItem>

        {/* Contracts Parent Menu */}
        <MenuItem
          onClick={() => toggleSubMenu("contracts")}
          className="wc-msg-filter-menu-item"
        >
          {/* Chevron on the left */}
          {expandedMenu === "contracts" ? (
            <FaChevronDown style={{ marginRight: "10px" }} />
          ) : (
            <FaChevronRight style={{ marginRight: "10px" }} />
          )}
          <span style={{ flexGrow: 1 }}>Contracts</span>
          <FaFileAlt />
        </MenuItem>
        <Collapse in={expandedMenu === "contracts"}>
          <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
            <span style={{ paddingLeft: "20px" }}>Contract 1</span>
          </MenuItem>
          <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
            <span style={{ paddingLeft: "20px" }}>Contract 2</span>
          </MenuItem>
        </Collapse>

        {/* Other Parent Menu */}
        <MenuItem
          onClick={() => toggleSubMenu("other")}
          className="wc-msg-filter-menu-item"
        >
          {/* Chevron on the left */}
          {expandedMenu === "other" ? (
            <FaChevronDown style={{ marginRight: "10px" }} />
          ) : (
            <FaChevronRight style={{ marginRight: "10px" }} />
          )}
          <span style={{ flexGrow: 1 }}>Other</span>
          <FaRegComment />
        </MenuItem>
        <Collapse in={expandedMenu === "other"}>
          <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
            <span style={{ paddingLeft: "20px" }}>Other 1</span>
          </MenuItem>
          <MenuItem onClick={handleClose} className="wc-msg-filter-menu-item">
            <span style={{ paddingLeft: "20px" }}>Other 2</span>
          </MenuItem>
        </Collapse>
      </Menu>
    </div>
  );
};

export default SearchFilter;
