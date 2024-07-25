import React, { useState, useEffect } from "react";
import ContactList from "./ContactList";
import ChatContainer from "./ChatContainer";
import { getMessages, sendMessage } from "../Inbox/chatService";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Auth/firebase";

const Inbox = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState({});
  const auth = getAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(users);
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      const unsubscribe = getMessages(selectedContact.id, (messages) => {
        setConversations((prevConversations) => ({
          ...prevConversations,
          [selectedContact.id]: messages,
        }));
      });

      return () => unsubscribe();
    }
  }, [selectedContact]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = async (contactId, message) => {
    const currentUserId = auth.currentUser.uid;
    await sendMessage(contactId, currentUserId, message);
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <ContactList
            contacts={contacts}
            onSelectContact={handleSelectContact}
          />
        </div>
        <div className="col-md-8 col-lg-9">
          {selectedContact ? (
            <ChatContainer
              contact={selectedContact}
              messages={conversations[selectedContact.id] || []}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="text-center mt-5">
              <h4>Select a contact to start chatting</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
