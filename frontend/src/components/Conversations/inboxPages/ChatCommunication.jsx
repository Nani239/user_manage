import React from "react";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import MsgInputBox from "./MsgInputBox";

const ChatCommunication = ({
  isMobileView,
  onBack,
  toggleDrawer,
  fetchMsgs,
  fetchData,
  isChatModal,
}) => {
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const { loadingConvo, messages, selectedFile } = useSelector(
    (state) => state.messages
  );
  if (loadingConvo) {
    return (
      <div className="text-center" style={{ fontSize: "smaller" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="chat-communication">
      <ChatHeader
        isMobileView={isMobileView}
        onBack={onBack}
        toggleDrawer={toggleDrawer}
        fetchMsgs={fetchMsgs}
        fetchData={fetchData}
        isChatModal={isChatModal}
      />
      <div>
        <div
          className={`${
            selectedConversation && selectedConversation.postType === 3
              ? "visible"
              : "invisible"
          }`}
        >
          {/* {selectedConversation.postType === 3 && ( */}
          <div
            className="text-center d-flex flex-column align-items-center"
            style={{ fontSize: "smaller" }}
          >
            <span className="text-white px-2 py-1 mb-1 rounded bg-secondary">
              Starting Offer $ {selectedConversation?.Budget}
            </span>{" "}
            <span className="rounded px-2 py-1 bg-success text-white">
              Negotiated $ {selectedConversation?.finalBudget}
            </span>
          </div>
          {/* )} */}
        </div>
        <div className="upwork_message">
          {!loadingConvo &&
            messages &&
            messages.length > 0 &&
            messages.map((msg, index) => (
              <div
                className={`${
                  messages.length === 1
                    ? "single-message"
                    : messages.length === 2 && "two-messages"
                }`}
                key={msg.Id}
              >
                <Conversation key={msg.Id} message={msg} />
              </div>
            ))}

          {selectedFile && (
            <div className="text-center" style={{ fontSize: "smaller" }}>
              Sending Attachment...
            </div>
          )}
        </div>
        <MsgInputBox fetchMsgs={fetchMsgs} isChatModal={isChatModal} />
      </div>
    </div>
  );
};

export default ChatCommunication;
