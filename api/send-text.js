import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, phone, address, service } = req.body;

  if (!name || !email || !phone || !service) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  // ** USE MMS INSTEAD OF SMS — allows full length, no 160-char limit **
  const smsAddress = "6038330660@vzwpix.com";

  // Create transporter using Gmail App Password (stored in Vercel env)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // CLEAN + CONSISTENT MESSAGE
  const message = `
📬 NEW TECH COACHING REQUEST

👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
🏠 Address: ${address || "Not provided"}

🛠 Service Requested:
${service}

Reply directly to this message to contact the customer.
  `.trim();

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: smsAddress,     // Verizon MMS gateway
      subject: "New Tech Coaching Lead",
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending text:", error);
    return res.status(500).json({ success: false, error: "Failed to send message" });
  }
}
