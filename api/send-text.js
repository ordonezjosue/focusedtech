// api/send-text.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, address, service, otherDetails, message } = req.body || {};

  if (!name || !email || !phone || !service) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const smsAddress = "6038330660@vtext.com"; // Verizon email-to-SMS

  const combinedService =
    service === "Other" && otherDetails
      ? `Other: ${otherDetails}`
      : service;

  const textBody = `
New Tech Coaching Lead

Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address || "N/A"}
Service: ${combinedService}
Message: ${message || "N/A"}
  `.trim();

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // your Gmail App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: smsAddress,
      subject: "New Tech Coaching Lead",
      text: textBody,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("FAILED TO SEND SMS:", err);
    return res.status(500).json({ error: "Failed to send SMS" });
  }
}
