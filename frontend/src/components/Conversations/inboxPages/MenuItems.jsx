import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import OfferDetailsModal from "./VendorOffers/OfferDetailsModal";
import { useSelector } from "react-redux";
import PayModal from "../../../components/Header/modals/PayModal";
import NegotiateModal from "./VendorOffers/NegotiateModal";
import { toast } from "react-toastify";

const MenuItems = ({ isMenuOpen, toggleMenu, anchorEl }) => {
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [negotiate, setNegotiate] = useState(false);
  const [accept, setAccept] = useState(false);
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const logUser = localStorage.getItem("USER_ROLE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewNegoHistory, setViewNegoHistory] = useState(false);
  // const [selectedMsg, setSelectedMsg] = useState(null);
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const ViewOffer = (event, msg) => {
    event.stopPropagation();
    // setSelectedMsg(msg);
    setOfferModalOpen(true);
    toggleMenu();
  };
  const closeOffertModal = (e) => {
    setNegotiate(false);
    setOfferModalOpen(false);
  };
  const handleClick = () => {
    setViewNegoHistory(true);
  };
  console.log(selectedConversation, "selecetedConvo");
  return (
    <div>
      <Menu
        anchorEl={anchorEl} // Use anchorEl for positioning
        keepMounted
        open={isMenuOpen}
        onClose={toggleMenu}
        PaperProps={{
          style: {
            minWidth: "200px", // Set a minimum width if necessary
          },
        }}
      >
        <MenuItem onClick={toggleMenu}>Block Other Party Messages</MenuItem>
        {user.RoleId !== 1 && (
          <MenuItem>
            {logUser === "customer" &&
              selectedConversation.providerPhone !== "0" && (
                <small>{selectedConversation.providerPhone}</small>
              )}
            {logUser === "provider" &&
              selectedConversation.customerPhone !== "0" && (
                <small>{selectedConversation.customerPhone}</small>
              )}
            {(logUser !== "customer" ||
              selectedConversation.providerPhone === "0") &&
              (logUser !== "provider" ||
                selectedConversation.customerPhone === "0") && (
                <div
                  className="text-nowrap"
                  onClick={() => {
                    setIsModalOpen(!isModalOpen); // Toggle modal visibility
                  }}
                  style={{
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  Request Phone Number
                </div>
              )}
          </MenuItem>
        )}
        <MenuItem
          onClick={handleClick}
          disabled={
            (selectedConversation?.messageStatus === 6 ||
              selectedConversation?.messageStatus === 7) &&
            selectedConversation.postType === 3
              ? false
              : true
          }
        >
          Negotioation History
        </MenuItem>
        <NegotiateModal
          isOpen={viewNegoHistory}
          closeModal={() => setViewNegoHistory(false)}
        />
        {/* {selectedConversation.messageStatus === 6 &&
          user.RoleId !== 1 &&
          selectedConversation.postType === 3 && (
            <>
              {selectedConversation.ownerId === user.UserID ? (
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
                </div>
              )}
            </>
          )}
        {selectedConversation.messageStatus === 7 &&
          user.RoleId !== 1 &&
          selectedConversation.postType === 3 && (
            <>
              {selectedConversation.ownerId === user.UserID ? (
                <div className="d-flex justify-content-start align-items-center ">
                  <button
                    className="btn btn-warning btn-sm text-nowrap m-0 "
                    onClick={() => setViewNegoHistory(true)}
                  >
                    View Negotiation
                  </button>
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
          )} */}
        {/* <MenuItem onClick={toggleMenu}>
          Offer Response (Accept,Reject,Negotiate)
        </MenuItem> */}
        {/* <MenuItem onClick={(event) => ViewOffer(event)}>
          View Offer & Pay
        </MenuItem> */}
        {/* <MenuItem onClick={toggleMenu}>Template Messages</MenuItem> */}
        <MenuItem onClick={toggleMenu}>More...</MenuItem>
      </Menu>
      <OfferDetailsModal
        isOpen={offerModalOpen}
        closeModal={(e) => closeOffertModal(e)}
        negotiate={negotiate}
        setNegotiate={setNegotiate}
        accept={accept}
        setAccept={setAccept}
        msg={selectedConversation}
        fetchData={() => console.log("reload")}
      />
      <PayModal
        isModalOpen={isModalOpen}
        handleToggleModal={() => {
          setIsModalOpen(!isModalOpen); // Toggle modal visibility
        }}
        selectedMsg={selectedConversation}
      />
    </div>
  );
};

export default MenuItems;
