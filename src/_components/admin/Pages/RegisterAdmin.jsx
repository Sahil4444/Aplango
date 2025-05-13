import React from "react";
import { AdminRegisterForm } from "../_components/Form/AdminRegisterForm"

function RegisterAdmin() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500 mb-8">
        <h1>
          Register <span className="text-indigo-600">Admin</span>
        </h1>
      </div>
      <AdminRegisterForm />
    </div>
  );
}

export default RegisterAdmin;
