import React, { useState } from "react";
import OfferMessages from "./VendorOffers/OfferMessages";
import ChatComponent from "./Chat";
import UnReadMsgs from "./UnReadMsgs";

const MessagePage = () => {
  const [showChat, setShowChat] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleOpenChat = (message) => {
    setSelectedMessage(message);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedMessage(null);
  };

  return (
    <div>
      <OfferMessages onMessageClick={handleOpenChat} />
      {showChat && selectedMessage && (
        <ChatComponent message={selectedMessage} onClose={handleCloseChat} />
      )}
      {!showChat && <UnReadMsgs onMessageClick={handleOpenChat} />}
    </div>
  );
};

export default MessagePage;
