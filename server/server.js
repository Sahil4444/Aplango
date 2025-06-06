const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = import.meta.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://aplango.com"], // Add your production domain
    credentials: true,
  }),
)
app.use(express.json())

// SMS API endpoint
app.post("/api/send-sms", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        error: "Phone number and OTP are required",
      })
    }

    // Format phone number - remove any spaces, dashes, or special characters
    const formattedPhone = phoneNumber.replace(/\D/g, "")

    // Prepare the SMS message
    const message = `Dear Customer Your One-Time Password (OTP) for login is ${otp}. This code is valid for the next 5 minutes. Do not share it with anyone. Aplango Promo Services`

    // Prepare API parameters
    const apiParams = new URLSearchParams({
      username: import.meta.env.SMS_USERNAME || "aplango",
      apikey: import.meta.env.SMS_API_KEY || "15798-BD08A",
      apirequest: "Text",
      sender: import.meta.env.SMS_SENDER_ID || "APLNGO",
      mobile: formattedPhone,
      message: message,
      route: import.meta.env.SMS_ROUTE || "TRANS",
      TemplateID: import.meta.env.DLT_TEMPLATE_ID || "1707174841347143077",
      format: "JSON",
    })

    const apiUrl = import.meta.env.SMS_API_URL || "https://bulk.nationalsms.in/sms-panel/api/http/index.php"
    const fullUrl = `${apiUrl}?${apiParams.toString()}`

    console.log("Sending SMS to:", formattedPhone)

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.text()
    console.log("SMS API Response:", result)

    // Parse the response
    let parsedResult
    try {
      parsedResult = JSON.parse(result)
    } catch (e) {
      parsedResult = { response: result }
    }

    // Check if SMS was sent successfully
    if (response.ok && (parsedResult.status === "success" || result.includes("success") || parsedResult.response)) {
      console.log("SMS sent successfully")
      return res.json({ success: true, data: parsedResult })
    } else {
      console.error("SMS sending failed:", parsedResult)
      return res.status(500).json({
        success: false,
        error: parsedResult.message || "SMS sending failed",
      })
    }
  } catch (error) {
    console.error("SMS API Error:", error)
    return res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    })
  }
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
