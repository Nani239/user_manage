import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MessageStatusUpdate } from "../../../../components/Header/Data";
import AdminResponseModal from "./AdminResponseModal";
import OfferDetailsModal from "./OfferDetailsModal";
import NegotiateModal from "./NegotiateModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OfferDetails = ({ fetchMsgs }) => {
  const msg = useSelector((state) => state.messages.selectedConvo);
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [negotiate, setNegotiate] = useState(false);
  const [accept, setAccept] = useState(false);
  const [offerDetailsModalOpen, setOfferDetailsModalOpen] = useState(false);
  const [viewNegoHistory, setViewNegoHistory] = useState(false);
  const [adminResponse, setAdminResponse] = useState(false);
  const [adminResponseType, setAdminResponseType] = useState("");
  const navigate = useNavigate();
  const handleApproveAdmin = async (event, msg) => {
    event.stopPropagation();
    const status = {
      messageStatus: 3,
      updatedBy: user.UserID,
      customerId: msg.ownerId,
      needName: msg.postName,
      Budget: msg.Budget,
      Message: msg.Message,
      Email: msg.customerEmail,
      createdBy: msg.createdBy,
    };
    await MessageStatusUpdate(status, msg.Id);
    fetchMsgs();
    toast.success("Offer Accepted");
  };

  const ViewOffer = (event, msg) => {
    event.stopPropagation();
    setOfferDetailsModalOpen(true);
  };
  const closeAdminModal = () => {
    setAdminResponse(false);
    setAdminResponseType("");
  };

  const closeAcceptModal = (e) => {
    setNegotiate(false);
    setOfferDetailsModalOpen(false);
  };
  const handleClick = (e) => {
    const offerAmount = msg.finalBudget !== null ? msg.finalBudget : 0;
    e.stopPropagation();
    if (islogin) {
      navigate("/order/summary", {
        state: {
          msg,
          offerAmount,
        },
      });
    } else {
      navigate("/login");
      toast.info("Please Login");
    }
  };
  return (
    <>
      {/* messageStatus === 0 or messageStatus === 1 message sent for approve */}
      {user.RoleId === 1 &&
        msg?.postType === 3 &&
        (msg?.messageStatus === 0 || msg?.messageStatus === 1) && (
          <div className="d-flex flex-row gap-1 justify-content-start">
            <div className="d-flex justify-content-start align-items-center">
              <button
                className="btn btn-success btn-sm text-nowrap m-0"
                onClick={(event) => {
                  handleApproveAdmin(event, msg);
                }}
              >
                Approve
              </button>{" "}
            </div>
            <div className="d-flex justify-content-start align-items-center ">
              <button
                className="btn btn-danger btn-sm text-nowrap m-0"
                onClick={() => {
                  setAdminResponse(true);
                  setAdminResponseType("reject");
                }}
              >
                Reject
              </button>{" "}
              <AdminResponseModal
                isOpen={adminResponse}
                closeModal={closeAdminModal}
                adminResponseType={adminResponseType}
                msg={msg}
                fetchData={fetchMsgs}
              />
            </div>
          </div>
        )}
      {/* messageStatus === 3 view offer */}
      {msg?.messageStatus === 3 &&
        (msg?.ownerId === user.UserID || user.RoleId == 1) &&
        //added above line for admin
        msg?.postType === 3 && (
          <div div className="d-flex justify-content-start align-items-center ">
            <button
              className="btn btn-primary btn-sm text-nowrap m-0"
              onClick={(event) => ViewOffer(event, msg)}
            >
              View Offer
            </button>{" "}
          </div>
        )}
      {/* messageStatus === 6 customer Negotiated  view Negotiation*/}
      {/* {msg?.messageStatus === 6 && user.RoleId !== 1 && msg?.postType === 3 && ( */}
      {msg?.messageStatus === 6 && msg?.postType === 3 && (
        <>
          {msg?.ownerId === user.UserID ? (
            <div className="d-flex justify-content-start align-items-center ">
              <button
                className="btn btn-warning btn-sm text-nowrap m-0"
                // onClick={() => setViewNegoHistory(true)}
                disabled
              >
                You Negotiated
              </button>
            </div>
          ) : (
            <div className="d-flex justify-content-start align-items-center ">
              <button
                className="btn btn-warning btn-sm text-nowrap m-0 "
                onClick={() => setViewNegoHistory(true)}
              >
                View Negotiation
              </button>{" "}
              <NegotiateModal
                isOpen={viewNegoHistory}
                closeModal={() => setViewNegoHistory(false)}
                msg={msg}
                fetchData={fetchMsgs}
              />
            </div>
          )}
        </>
      )}

      {/* messageStatus === 7 provider Negotiated  view Negotiation*/}
      {/* {msg?.messageStatus === 7 && user.RoleId !== 1 && msg?.postType === 3 && ( */}
      {msg?.messageStatus === 7 && msg?.postType === 3 && (
        <>
          {msg?.ownerId === user.UserID ? (
            <div className="d-flex justify-content-start align-items-center ">
              <button
                className="btn btn-warning btn-sm text-nowrap m-0 "
                onClick={() => setViewNegoHistory(true)}
              >
                View Negotiation
              </button>{" "}
              <NegotiateModal
                isOpen={viewNegoHistory}
                closeModal={() => setViewNegoHistory(false)}
                msg={msg}
                fetchData={fetchMsgs}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-start align-items-center ">
              <button
                className="btn btn-warning btn-sm text-nowrap m-0"
                // onClick={() => setViewNegoHistory(true)}
                disabled
              >
                You Negotiated
              </button>
            </div>
          )}
        </>
      )}
      {msg?.orderStatus === "COMPLETED" ? (
        "Payment Completed"
      ) : (
        <div>
          {(msg?.messageStatus === 4 || msg?.messageStatus === 9) &&
            msg?.ownerId === user.UserID && (
              // <button
              //   className="btn btn-success text-nowrap m-0 px-3"
              //   onClick={(e) => handleClick(e)}
              // >
              //   Pay
              // </button>
              <button
                className="btn btn-primary btn-sm text-nowrap m-0"
                onClick={(event) => ViewOffer(event, msg)}
              >
                View Offer
              </button>
            )}
        </div>
      )}
      <OfferDetailsModal
        isOpen={offerDetailsModalOpen}
        closeModal={(e) => closeAcceptModal(e)}
        negotiate={negotiate}
        setNegotiate={setNegotiate}
        accept={accept}
        setAccept={setAccept}
        msg={msg}
        fetchData={fetchMsgs}
      />
    </>
  );
};

export default OfferDetails;
