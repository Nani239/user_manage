// src/components/DashboardPages/User/userService.js
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../Auth/firebase";

const auth = getAuth();

export const getUsers = async () => {
  try {
    // Get a reference to the 'users' collection
    const usersCollectionRef = collection(db, "users");

    // Fetch all documents in the 'users' collection
    const querySnapshot = await getDocs(usersCollectionRef);

    // Map the documents to an array of user objects
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    } else {
      throw new Error("No such user!");
    }
  } catch (error) {
    console.error("Error fetching user by ID: ", error);
    throw error;
  }
};
