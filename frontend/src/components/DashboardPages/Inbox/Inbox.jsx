import React, { useState, useEffect } from "react";
import ContactList from "./ContactList";
import ChatContainer from "./ChatContainer";
import { getMessages, sendMessage, getChatId } from "./chatService"; // Adjust path if needed
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../../../Redux/Slices/userSlice";

const Inbox = () => {
  const user = useSelector((state) => state.auth.user);
  const { AllUsers } = useSelector((state) => state.user);
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversations, setConversations] = useState({});
  const auth = getAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchContacts = async () => {
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uid: doc.data().uid,
        email: doc.data().email,
      }));
      // setContacts(users);
      dispatch(setAllUsers(users));
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      console.log(selectedContact, user, "selectedContact");
      const fetchChatIdAndMessages = async () => {
        const chatId = await getChatId(selectedContact.id, user.uid);
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
    const reciverId = contactId === user.uid ? selectedContact.uid : user.uid;
    await sendMessage(contactId, user.uid, reciverId, message,user);
    console.log("Message sent successfully!");
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <ContactList
            contacts={AllUsers}
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
