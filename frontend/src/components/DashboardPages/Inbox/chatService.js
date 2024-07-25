import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Auth/firebase";

export const sendMessage = async (contactId, senderId, message) => {
  try {
    const messagesCollectionRef = collection(db, "messages");
    await addDoc(messagesCollectionRef, {
      contactId,
      senderId,
      message,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const getMessages = (contactId, callback) => {
  const messagesCollectionRef = collection(db, "messages");
  const q = query(
    messagesCollectionRef,
    where("contactId", "==", contactId),
    orderBy("timestamp")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};
