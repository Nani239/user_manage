import { auth, firestore } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Function to generate a random user ID with 1 to 4 digits
const generateUserId = async () => {
  const maxAttempts = 10;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const userId = Math.floor(Math.random() * 10000).toString(); // Generate a number between 0 and 9999

    // Check if the generated userId already exists in Firestore
    const userQuery = query(
      collection(firestore, "users"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return userId; // Return the userId if it's unique
    }
  }
  throw new Error("Failed to generate a unique user ID. Please try again.");
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Generate a custom user ID with 1 to 4 digits
    const userId = await generateUserId();

    // Add user to Firestore with custom userId
    await addDoc(collection(firestore, "users"), {
      uid: user.uid,
      userId: userId,
      email: user.email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error registering new user: ", error.message);
    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error("The email address is already in use.");
      case "auth/invalid-email":
        throw new Error("The email address is not valid.");
      case "auth/weak-password":
        throw new Error("The password is too weak.");
      default:
        throw new Error("Failed to sign up. Please try again.");
    }
  }
};
