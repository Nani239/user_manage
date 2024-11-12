// Invoices.js
import React, { useState } from "react";
import { Button } from "reactstrap";
import { FaChevronDown } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";

const Invoices = () => {
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
          backgroundColor: "#b5e51d",
          color: "white",
          fontSize: "x-small",
        }}
        size="sm"
        onClick={handleClick}
      >
        <span className="drop-button-title">
          Invoice
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
        <MenuItem onClick={handleClose}>View Invoices</MenuItem>
        <MenuItem onClick={handleClose}>Create Invoices</MenuItem>
      </Menu>
    </div>
  );
};

export default Invoices;
