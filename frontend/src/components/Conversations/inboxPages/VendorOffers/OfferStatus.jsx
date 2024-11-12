import React, { useState } from "react";
import ReasonModal from "./ReasonModal";
import { useSelector } from "react-redux";
const OfferStatus = ({ msg }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [makeOffer, setMakeOffer] = useState(false);
  const [openReasonModal, setOpenReasonModal] = useState(false);
  const closeReason = () => {
    setOpenReasonModal(false);
    setMakeOffer(false);
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-wrap">
      <div className="d-flex flex-column justify-content-center align-items-center text-wrap">
        {/* <p className="fw-bold text-black mx-auto mb-1">Status</p> */}
      </div>
      {(msg.messageStatus === 0 || msg.messageStatus === 1) && (
        <>
          {user.RoleId !== 1 ? (
            <div className="status-bubble">
              <p className="text-success">
                <small>Awaiting Admin Approval</small>
              </p>
            </div>
          ) : (
            <div className="status-bubble">
              <p className="text-warning">
                <small>Provider Make An New Offer</small>
              </p>
            </div>
          )}
        </>
      )}
      {msg.messageStatus === 2 && (
        <>
          <div className="status-bubble ">
            <p className="text-danger">
              <small>Admin Rejected The Offer</small>
            </p>
          </div>
          <a
            onClick={() => {
              setOpenReasonModal(true);
            }}
            style={{ textDecorationLine: "underline", cursor: "pointer" }}
            className="mt-2"
          >
            <small>View Details</small>
          </a>
          <ReasonModal
            isOpen={openReasonModal}
            closeModal={closeReason}
            msg={msg}
            makeOffer={makeOffer}
            setMakeOffer={setMakeOffer}
          />
        </>
      )}
      {msg.messageStatus === 3 && user.RoleId != 1 && (
        <>
          {msg.zoomStatus === 3 ? (
            <div className="status-bubble">
              <p className="text-primary">
                <small>Awaiting to speak on Call</small>
              </p>
            </div>
          ) : (
            <>
              {msg.ownerId === user.UserID ? (
                <div className="status-bubble">
                  <p className="text-success">
                    <small>Provider Make An New Offer &#129395;</small>
                  </p>
                </div>
              ) : (
                <div className="status-bubble">
                  <p className="text-success">
                    <small>Awaiting Customer Interaction</small>
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
      {msg.messageStatus === 4 && (
        <div className="status-bubble ">
          <p className="text-success">
            <small>Customer Accepted Offer &#129395;</small>{" "}
          </p>
        </div>
      )}
      {msg.messageStatus === 9 && (
        <div className="status-bubble ">
          <p className="text-success">
            <small>Provider Accepted The Deal &#129395;</small>{" "}
          </p>
        </div>
      )}
      {msg.messageStatus === 5 && (
        <>
          {" "}
          <div className="status-bubble mb-1">
            <p className="text-danger">
              <small>Customer Rejected Offer</small>
            </p>
          </div>{" "}
          <a
            onClick={() => {
              setOpenReasonModal(true);
            }}
            style={{ textDecorationLine: "underline", cursor: "pointer" }}
            className=""
          >
            <small>View Details</small>
          </a>
          <ReasonModal
            isOpen={openReasonModal}
            closeModal={closeReason}
            msg={msg}
            makeOffer={makeOffer}
            setMakeOffer={setMakeOffer}
          />
        </>
      )}
      {msg.messageStatus === 10 && (
        <>
          <div className="status-bubble">
            <p className="text-danger">
              <small>Provider Rejected Deal</small>
            </p>
          </div>
          <a
            onClick={() => {
              setOpenReasonModal(true);
            }}
            style={{ textDecorationLine: "underline", cursor: "pointer" }}
            className=""
          >
            <small>View Details</small>
          </a>
          <ReasonModal
            isOpen={openReasonModal}
            closeModal={closeReason}
            msg={msg}
            makeOffer={makeOffer}
            setMakeOffer={setMakeOffer}
          />
        </>
      )}
      {(msg.messageStatus === 6 || msg.messageStatus === 7) &&
        user.RoleId !== 1 && (
          <div className="status-bubble">
            <p className="text-dark">
              <small>Deal In Progress</small>
            </p>
          </div>
        )}
      {user.RoleId === 1 &&
        (msg.messageStatus === 3 ||
          msg.messageStatus === 6 ||
          msg.messageStatus === 7) && (
          <div className="status-bubble">
            <p className="text-dark">
              <small>Deal In Progress</small>
            </p>
          </div>
        )}
    </div>
  );
};

export default OfferStatus;
