// backend/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const message = `Dear Customer Your One-Time Password (OTP) for login is ${otp}. This code is valid for the next 5 minutes. Do not share it with anyone. Aplango Promo Services`;

  const params = new URLSearchParams({
    username: process.env.SMS_USERNAME,
    apikey: process.env.SMS_APIKEY,
    apirequest: "Text",
    sender: process.env.SMS_SENDER_ID,
    mobile: phoneNumber.replace(/\D/g, ""),
    message,
    route: process.env.SMS_ROUTE,
    TemplateID: process.env.DLT_TEMPLATE_ID,
    format: "JSON",
  });
  console.log(message)
  console.log(params.mobile)

  const apiUrl = `http://bulk.nationalsms.in/sms-panel/api/http/index.php?${params.toString()}`;

  try {
    const response = await axios.get(apiUrl);
    const result = response.data;

    if (result.status?.toLowerCase() === "success") {
      return res.json({ success: true, otp });
    } else {
      return res
        .status(500)
        .json({
          success: false,
          message: result.message || "SMS sending failed",
        });
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
