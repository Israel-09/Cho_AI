import express from "express";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Set up Nodemailer transporter with corrected environment variable
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS, // Fixed typo from process.eventNames.EMAIL_ADDRESS
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Create Express app
const app = express();

app.use(express.json());
app.use(cors());

// Define POST route for subscription
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: "Missing email" }); // Fixed typo "Misssing" to "Missing"
  }

  try {
    // Insert email into Supabase "subscribers" table
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      throw error;
    }

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS, // Fixed typo from process.env.EAIL_ADDRESS
      to: email,
      subject: "Thanks for Subscribing!",
      text: "You're in! We'll keep you updated.", // Added punctuation for clarity
    });

    // Return success response
    return res.status(200).json({ message: "Subscribed successfully" }); // Fixed typo "messgae" to "message"
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
