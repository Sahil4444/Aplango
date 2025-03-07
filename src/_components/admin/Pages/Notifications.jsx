import React from "react";
import { BellRing } from "lucide-react";

function Notifications() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Your <span className="text-indigo-600">Notifications</span>
        </h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full flex flex-col justify-center gap-6">
        <div className="notifications flex flex-col items-start justify-start">
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> 
            New User Registered: sahil has registered using Card ID 75246892 on 10-02-2025 on 9:00PM.
          </div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> Card Activated: Card ID 75246892 has been activated by Admin.
          </div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> New Offer Created: Admin Sahil created a new offer: "30% off for Couple on 14feb by Imagica".
          </div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> New Brand - Wet n Joy added by Admin - Sahil
          </div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> New Admin - Yash added by Admin - Sahil
          </div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> New Message – You have
            received a new message from a patient in your inbox.
          </div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> Suspicious Activity Detected: Multiple failed login attempts detected.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
