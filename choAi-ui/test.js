import { initializeApp } from "firebase/app";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDBmjUnVci0x9Pc-SAdPRVZE2ymFjJW85g",
  authDomain: "askch0.firebaseapp.com",
  projectId: "askch0",
  storageBucket: "askch0.firebasestorage.app",
  messagingSenderId: "912599335177",
  appId: "1:912599335177:web:87446aa6ede2c0171893d8",
  measurementId: "G-3XD5DB5WY7",
};

const app = initializeApp(firebaseConfig);

const functions = getFunctions(app);
// Connect to the local Functions emulator
connectFunctionsEmulator(functions, "localhost", 5001);

const createUserAndProfile = httpsCallable(functions, "createUserAndProfile");

async function testCreateUser() {
  try {
    const result = await createUserAndProfile({
      email: "testuser@example.com",
      password: "securePassword123",
      name: "Test User",
      gender: "non-binary",
      dob: "1990-01-01",
    });
    console.log(result.data); // { message: 'User and profile created successfully.' }
  } catch (error) {
    console.error("Error:", error.code, error.message);
  }
}

testCreateUser();
