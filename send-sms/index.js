import functions from 'firebase-functions';
import fetch from 'node-fetch'; // install this with: npm install node-fetch
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const sendSms = functions.https.onRequest(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "Missing phoneNumber or otp" });
  }

  const smsUrl = `https://bulk.nationalsms.in/sms-panel/api/http/index.php?username=aplango&apikey=15798-BD08A&apirequest=Text&sender=SenderID&mobile=${phoneNumber}&message=Dear Customer Your One-Time Password (OTP) for login is ${otp}. This code is valid for the next 5 minutes. Do not share it with anyone. Aplango Promo Services&route=RouteName&TemplateID=DLT-Template-ID&format=JSON`;

  try {
    const response = await fetch(smsUrl);
    const data = await response.json();

    res.status(200).json({ success: true, response: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "SMS sending failed", error: error.message });
  }
});
