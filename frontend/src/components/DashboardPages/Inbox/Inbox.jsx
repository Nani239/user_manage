import React, { useState, useEffect } from "react";
import ContactList from "./ContactList";
import ChatContainer from "./ChatContainer";
import { getMessages, sendMessage, getChatId } from "./chatService"; // Adjust path if needed
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import { useSelector } from "react-redux";

const Inbox = () => {
  const user = useSelector((state) => state.auth);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState({});
  const auth = getAuth();
  console.log(user, "user");
  useEffect(() => {
    const fetchContacts = async () => {
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        userId: doc.data().userId,
        email: doc.data().email
      }));
      setContacts(users);
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      const fetchChatIdAndMessages = async () => {
        const chatId = await getChatId(selectedContact.id, user.userId);
        if (chatId) {
          const unsubscribe = getMessages(chatId, (messages) => {
            setConversations((prevConversations) => ({
              ...prevConversations,
              [selectedContact.id]: messages,
            }));
          });
          return () => unsubscribe();
        }
      };

      fetchChatIdAndMessages();
    }
  }, [selectedContact]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = async (contactId, message) => {
    const reciverId = contactId === user.userId ? selectedContact.userId : user.userId;
    await sendMessage(contactId, user.userId, reciverId, message);
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
