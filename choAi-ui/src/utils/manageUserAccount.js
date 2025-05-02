import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

export const deleteUserAccount = async () => {
  try {
    const deleteUserAccount = httpsCallable(functions, "deleteUserAccount");
    const result = await deleteUserAccount();
    return result.data;
  } catch (error) {
    throw new Error(`Failed to delete account: ${error.message}`);
  }
};

// Delete all user conversations
export const deleteAllConversations = async () => {
  try {
    const deleteAllConversations = httpsCallable(
      functions,
      "deleteAllConversations"
    );
    const result = await deleteAllConversations();
    return result.data;
  } catch (error) {
    throw new Error(`Failed to delete conversations: ${error.message}`);
  }
};
