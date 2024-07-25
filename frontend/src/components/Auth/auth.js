import { auth, firestore } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Optionally add user to Firestore
    await addDoc(collection(firestore, "users"), {
      uid: user.uid,
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
