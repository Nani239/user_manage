import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Row, Col, Input, Label, FormGroup, Form } from "reactstrap";
import { ScheduleCall } from "../../../../components/Header/Data2";
import CustomerAvaliableCalander from "../../../../components/Header/CustomerAvaliableCalander";

const ScheduleCallModal = ({ isOpen, closeModal, msg, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [reserveDate, setReserveDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const providerZone = msg?.providerTimezone;
  const custZone = msg?.customerTimezone;

  const ScheduleNewCall = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date();
    if (!reserveDate) {
      toast.error("Please enter date");
      return;
    }
    if (!startTime) {
      toast.error("Please enter time");
      return;
    }
    if (reserveDate < currentDate) {
      toast.error("Please do not enter a previous date");
      return;
    }

    const selectedDateTime = new Date(`${reserveDate}T${startTime}`);
    if (selectedDateTime < currentTime) {
      toast.error("Please do not enter a completed time");
      return;
    }
    const request = {
      reserveDate: reserveDate,
      startTime: startTime,
      customerTimezone: custZone,
      providerTimezone: providerZone,
      zoomStatus: 1,
      zoomRole: user.UserID,
    };
    let id = msg.Id;
    await ScheduleCall(id, request);
    toast.success("Schedule Call Success");
    closeModal();
    setReserveDate("");
    setStartTime("");
    if (fetchData) fetchData();
  };

  let parsedAvailability = [];
  if (msg && typeof msg.availableFrom === "string") {
    try {
      parsedAvailability = JSON.parse(msg.availableFrom);
    } catch (error) {
      console.error("Error parsing msg.availableFrom:", error);
      parsedAvailability = [];
    }
  }
  const convertTo12Hour = (time) => {
    if (typeof time !== "string") {
      return "";
    }
    const [hours, minutes] = time.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes} ${suffix}`;
  };
  console.log(msg?.ownerId, "msg?.ownerId");
  console.log(user.UserID, "msg?.ownerId");
  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      onRequestClose={() => {
        closeModal();
      }}
      className="hire-modal"
      style={{
        content: {
          width: "50%",
          margin: "auto",
          backgroundColor: "#fff",
          padding: "40px",
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "1px solid gray",
          borderRadius: "20px",
          maxHeight: "80%",
          overflowY: "scroll",
        },
      }}
      size="lg"
    >
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close"
          onClick={closeModal}
        ></button>
      </div>
      <div className="modal-body">
        <Form>
          {/* {parsedAvailability.length > 0 && (
            <p>
              <small>
                {selectedCard?.userName} is available for a call from{" "}
                {convertTo12Hour(parsedAvailability[0].from)} to{" "}
                {convertTo12Hour(parsedAvailability[0].to)} on{" "}
                {parsedAvailability[0].days.join(", ")}
              </small>
            </p>
          )} */}
          <span>
            <small>
              <b>
                {" "}
                Please schedule the call using the tool below within the Other
                Party mentioned availability schedule.
              </b>
            </small>
          </span>
          <p className="py-2">
            <b className="text-black">Note: </b>All the scheduled calls are set
            to the default PST timezone. If necessary, please go to the Profile
            section to change the timezone
          </p>
          {msg?.ownerId === user.UserID ? (
            <Row>
              <Col>
                <FormGroup>
                  <Label>
                    Date <b className="text-danger">*</b>
                  </Label>
                  <Input
                    type="date"
                    name="date"
                    onChange={(e) => setReserveDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </FormGroup>
              </Col>
              <Col>
                {" "}
                <FormGroup>
                  <Label>
                    From<b className="text-danger">*</b>
                  </Label>
                  <Input
                    type="time"
                    name="StartTime"
                    // min={minTime}
                    // max={maxTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          ) : (
            <>
              <CustomerAvaliableCalander
                reserveDate={reserveDate}
                startTime={startTime}
                setReserveDate={setReserveDate}
                setStartTime={setStartTime}
                availableDays={parsedAvailability}
                ownerId={msg?.customerId}
              />
            </>
          )}

          {startTime && (
            <p>
              <small>
                The Calls will be scheduled for 30 min starting from{" "}
                {convertTo12Hour(startTime)}
              </small>
            </p>
          )}
        </Form>
        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={ScheduleNewCall}
          >
            Schedule
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleCallModal;
