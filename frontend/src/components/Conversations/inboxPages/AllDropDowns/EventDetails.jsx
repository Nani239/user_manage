// EventDetailsDropdown.js
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";
import { FaChevronDown } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";
import { fetchLCAById } from "../../../../components/Header/Data";
import { useSelector } from "react-redux";

const EventDetails = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(false);
  const [need, setNeed] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const fetchEvents = async () => {
    const data = await fetchLCAById(selectedConversation?.postId);
    setNeed(data[0]);
  };
  useEffect(() => {
    fetchEvents();
  }, [anchorEl]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentMenu(false);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentMenu(false);
  };
  const handleOpenModal = () => {
    handleCloseMenu(); // Close the menu first
    setModalOpen(true); // Then open the modal
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const eventDetails = need?.eventDetails ? JSON.parse(need?.eventDetails) : [];
  const filteredEvents = eventDetails?.filter(
    (event) =>
      event?.eventDate ||
      event?.eventLocation ||
      event?.eventTime ||
      event?.eventType ||
      event?.totalGuestCount
  );
  function convertTo12HourFormat(time24) {
    if (!time24) {
      return "";
    }
    const [hour24, minute] = time24.split(":").map(Number);
    if (isNaN(hour24) || isNaN(minute)) {
      return "";
    }
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = (hour24 % 12 || 12).toString().padStart(2, "0");
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  }

  function formatDate(dateStr) {
    if (!dateStr || typeof dateStr !== "string") {
      return "";
    }
    const date = new Date(dateStr);
    const formattedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    const [year, month, day] = formattedDate.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthAbbrev = months[parseInt(month, 10) - 1];
    return `${monthAbbrev} ${day}, ${year}`;
  }
  return (
    <div className="wc-chat-drop">
      <Button
        className="drop-button"
        style={{
          backgroundColor: "#fe7d29",
          color: "white",
          fontSize: "x-small",
        }}
        size="sm"
        onClick={handleClick}
      >
        <span className="drop-button-title">
          Event Details
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
        <MenuItem onClick={handleOpenModal}>View Events</MenuItem>
      </Menu>
      <Modal isOpen={modalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Event Details</ModalHeader>
        <ModalBody>
          {filteredEvents?.length > 0 ? (
            <Table responsive className="table-light border">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Event Date</th>
                  <th>Event Time</th>
                  <th>Event Type</th>
                  <th>Event Location</th>
                  <th>Guest Count</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{formatDate(event.eventDate)}</td>
                    <td>{convertTo12HourFormat(event.eventTime)}</td>
                    <td>{event.eventType}</td>
                    <td>{event.eventLocation}</td>
                    <td>{event.totalGuestCount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center my-3">No Events</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EventDetails;
