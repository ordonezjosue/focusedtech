// api/send-text.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, address, service } = req.body;

  if (!name || !email || !phone || !service) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Vercel provides a built-in email system using their serverless environment
  // We will use SMTP via nodemailer + Vercel's serverless execution
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,  // Your Gmail
      pass: process.env.EMAIL_PASS   // App Password (not your Gmail password)
    },
  });

  const smsAddress = "6038330660@vtext.com"; // Verizon Email → SMS gateway

  const message = `
New Tech Coaching Lead:

Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address || "N/A"}
Service Requested: ${service}

(Reply to customers directly. This text was sent automatically.)
`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: smsAddress,
      subject: "New Tech Coaching Lead",
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("FAILED TO SEND SMS:", error);
    return res.status(500).json({ error: "Failed to send SMS" });
  }
}
