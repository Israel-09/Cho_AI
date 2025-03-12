import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.eventNames.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = async (req, res) => {
  if (req.method != "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Misssing email" });
  }

  try {
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      throw error;
    }
    await transporter.sendMail({
      from: process.env.EAIL_ADDRESS,
      to: email,
      subject: "Thanks for Subscribing!",
      text: "You're in We'll keep you updated.",
    });
    return res.status(200).json({ messgae: "Subscribed successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
