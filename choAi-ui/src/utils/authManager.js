import { auth } from "../config/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

export const signInWithFacebook = async () => {
  const facebookProvider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    // The signed-in user info.
    const user = result.user;
    console.log("User signed in with Facebook:", user);
    return user;
  } catch (error) {
    console.log("Error signing in with Facebook:", error);
    console.log("Error signing in with Facebook:", error.code);
    // console.error("Error signing in with Facebook:", error);

    // Handle the account-exists-with-different-credential error
    if (error.code === "auth/account-exists-with-different-credential") {
      console.log("Account exists with different credential:", error.email);
      const email = error.email;
      const pendingCred = error.credential;

      // Fetch the sign-in methods for the email address
      const methods = await fetchSignInMethodsForEmail(auth, email);

      console.log("Existing sign-in methods for email:", methods);

      // Assuming there's at least one method, prompt the user to sign in
      // with the first method found. You might want to provide a more
      // user-friendly way to handle multiple methods.
      if (methods && methods.length > 0) {
        const firstMethod = methods[0];
        console.log(
          `Account with email ${email} already exists with ${firstMethod}.`
        );
        alert(
          `An account with this email already exists using ${firstMethod}. Please sign in with ${firstMethod} first.`
        );

        // Here you would typically guide the user to sign in using the
        // original method (e.g., redirect to a login page or trigger
        // the sign-in flow for that provider).
        // For demonstration, we'll re-throw with more context.
        throw new Error(
          `Please sign in with ${firstMethod} to link your Facebook account.`
        );
      } else {
        // This case is unlikely if the error indicates an existing account,
        // but it's good practice to handle it.
        console.error("Could not find existing sign-in methods for the email.");
        throw error; // Re-throw the original error
      }
    } else {
      // Handle other errors
      throw error; // Re-throw the original error
    }
  }
};
