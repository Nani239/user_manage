// InteractionNotes.js
import React, { useState } from "react";
import { Button } from "reactstrap";
import { FaChevronDown } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";

const InteractionNotes = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentMenu(false);
  };

  return (
    <div className="wc-chat-drop">
      <Button
        className="drop-button"
        style={{
          backgroundColor: "#fdaec9",
          color: "white",
          fontSize: "x-small",
        }}
        size="sm"
        onClick={handleClick}
      >
        <span className="drop-button-title">
          Interaction Notes
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
        <MenuItem onClick={handleClose}>View Interaction Notes</MenuItem>
        <MenuItem onClick={handleClose}>Add Interaction Notes</MenuItem>
      </Menu>
    </div>
  );
};

export default InteractionNotes;
