import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Auth/firebase";

export const fetchConversations = async (senderId, ReciverId) => {
  const conversationsCollectionRef = collection(db, "chats");
  const querySnapshot = await getDocs(conversationsCollectionRef);
  const conversations = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(conversations, "conversations");
  const filterMyChats = conversations.filter(
    (con) =>
      con.participants.includes(senderId) ||
      con.participants.includes(ReciverId)
  );
  return filterMyChats;
};
