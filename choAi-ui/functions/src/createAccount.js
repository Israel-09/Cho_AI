// src/userFunctions.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Creates a user account and sets up their profile in Firestore.
 */
exports.createUserAndProfile = functions.https.onCall(async (data, context) => {
  // Validate input data
  const { email, password, name, gender, dob } = data.data || {};

  if (!email || typeof email !== "string" || email.trim() === "") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email is required and must be a non-empty string."
    );
  }
  if (!password || typeof password !== "string" || password.trim() === "") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Password is required and must be a non-empty string."
    );
  }
  if (!name || typeof name !== "string" || name.trim() === "") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Name is required and must be a non-empty string."
    );
  }
  if (!gender || typeof gender !== "string" || gender.trim() === "") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Gender is required and must be a non-empty string."
    );
  }
  if (!dob || typeof dob !== "string" || dob.trim() === "") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Date of birth is required and must be a non-empty string."
    );
  }

  // Create user in Firebase Authentication
  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email: email.trim(),
      password: password.trim(),
      displayName: name.trim(),
    });
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      throw new functions.https.HttpsError(
        "already-exists",
        "The email address is already in use."
      );
    }
    throw new functions.https.HttpsError("internal", `Error creating user`);
  }

  // Set up user profile in Firestore
  const uid = userRecord.uid;
  const profileData = {
    name: name.trim(),
    gender: gender.trim(),
    email: userRecord.email,
    dob: dob.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await admin.firestore().collection("users").doc(uid).set(profileData);
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      `Error creating profile: ${error.message}`
    );
  }

  return { message: "User and profile created successfully." };
});
