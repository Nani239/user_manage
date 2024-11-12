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
import { useSelector } from "react-redux";

export const sendMessage = async (
  contactId,
  senderId,
  reciverId,
  message,
  user
) => {
  console.log("test send message");
  try {
    const chatsCollectionRef = collection(db, "chats");
    const chatQuery = query(
      chatsCollectionRef,
      where(
        "participants",
        "array-contains",
        senderId,
        "array-contains",
        reciverId
      )
    );
    const chatSnapshot = await getDocs(chatQuery);
    let chatId;
    chatSnapshot.forEach((doc) => {
      if (doc.data().participants.includes(contactId)) {
        chatId = doc.id;
      }
    });
    console.log("chatDoc");
    if (chatId) {
      console.log("chatDoc-1");
      const messagesCollectionRef = collection(db, `chats/${chatId}/messages`);
      const chatDoc = await addDoc(messagesCollectionRef, {
        participants: [senderId, contactId],
        timestamp: serverTimestamp(),
        senderName: user.email,
        reciverName: "reciverName",
        message: message,
        senderEmail: user.email,
        reciverEmail: "reciverEmail",
        senderId: user.uid,
        receiverId: reciverId,
        conversationId: chatId,
        seen: false,
        senderImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        receiverImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      });
      console.log(chatDoc, "chatDoc");
    } else {
      console.log("chatDoc-2");
      const chatDoc = await addDoc(chatsCollectionRef, {
        participants: [senderId, contactId],
        timestamp: serverTimestamp(),
        senderName: user.email,
        reciverName: "reciverName",
        message: message,
        senderEmail: user.email,
        reciverEmail: "reciverEmail",
        senderId: user.uid,
        receiverId: reciverId,
        seen: false,
        senderImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        receiverImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      });
      chatId = chatDoc.id;
      console.log(chatId, "chatDoc");
    }
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
    where(
      "participants",
      "array-contains",
      currentUserId,
      "array-contains",
      contactId
    )
  );
  console.log(chatsCollectionRef, "chatsCollectionRef");
  const chatSnapshot = await getDocs(chatQuery);
  console.log(chatSnapshot, "chatSnapshot");
  let chatId = null;
  console.log(chatId, "chatId");
  chatSnapshot.forEach((doc) => {
    if (doc.data().participants.includes(contactId)) {
      chatId = doc.id;
    }
  });

  return chatId;
};
