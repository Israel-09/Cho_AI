import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

// Send contact form email
export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const sendContactEmail = httpsCallable(functions, "sendContactEmail");
    const result = await sendContactEmail({ name, email, subject, message });
    return result.data;
  } catch (error) {
    throw new Error(`Failed to send contact email: ${error.message}`);
  }
};
