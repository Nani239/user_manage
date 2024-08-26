import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../Auth/firebase";

export const sendMessage = async (contactId, senderId, reciverId, message) => {
  try {
    const chatsCollectionRef = collection(db, "chats");
    const chatQuery = query(
      chatsCollectionRef,
      where("participants", "array-contains", senderId)
    );
    const chatSnapshot = await getDocs(chatQuery);
    let chatId;
    chatSnapshot.forEach((doc) => {
      if (doc.data().participants.includes(contactId)) {
        chatId = doc.id;
      }
    });
    if (!chatId) {
      const chatDoc = await addDoc(chatsCollectionRef, {
        participants: [senderId, contactId],
        timestamp: serverTimestamp(),
      });
      chatId = chatDoc.id;
    }
    const messagesCollectionRef = collection(db, `chats/${chatId}/messages`);
    await addDoc(messagesCollectionRef, {
      senderId,
      message,
      reciverId,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const getMessages = (chatId, callback) => {
  const messagesCollectionRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesCollectionRef, orderBy("timestamp"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(messages, "messages");
    callback(messages);
  });
};

export const getChatId = async (contactId, currentUserId) => {
  const chatsCollectionRef = collection(db, "chats");
  const chatQuery = query(
    chatsCollectionRef,
    where("participants", "array-contains", currentUserId)
  );
  const chatSnapshot = await getDocs(chatQuery);

  let chatId = null;

  chatSnapshot.forEach((doc) => {
    if (doc.data().participants.includes(contactId)) {
      chatId = doc.id;
    }
  });

  return chatId;
};
