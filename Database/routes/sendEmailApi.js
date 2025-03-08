import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, offerTitle, offerDescription } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,  // Set this in .env.local
      pass: process.env.EMAIL_PASS,  // Set this in .env.local
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `🎉 Offer Redeemed: ${offerTitle} 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Congratulations! 🎉</h2>
        <p>You have successfully redeemed the following offer:</p>
        <h3>${offerTitle}</h3>
        <p>${offerDescription}</p>
        <p>Enjoy your benefits!</p>
        <br>
        <p>Best Regards,<br>Your Offers Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
