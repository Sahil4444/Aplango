import React from 'react'
import { Link } from 'react-router-dom'

function Account() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Your <span className="text-indigo-600">Account</span>
        </h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-[300px] flex flex-col gap-6">
        <div className="field flex flex-col gap-1">
          <h1 className='text-indigo-500 text-md font-medium'>Name: </h1>
          <p className='ms-2 text-slate-600 font-medium'>Sahil Narale</p>
        </div>
        <div className="field flex flex-col gap-1">
          <h1 className='text-indigo-500 text-md font-medium'>Email id: </h1>
          <p className='ms-2 text-slate-600 font-medium'>sahilnarale@gmail.com</p>
        </div>
        <div className="field flex flex-col gap-1">
          <h1 className='text-indigo-500 text-md font-medium'>Phone no: </h1>
          <p className='ms-2 text-slate-600 font-medium'>8421674081</p>
        </div>
        <div className="field flex flex-col gap-1 mt-6 w-full">
          <button className='md:text-indigo-500 text-white md:bg-transparent bg-indigo-500 text-sm font-medium md:border md:border-indigo-500 py-2 px-3 rounded-md md:hover:bg-indigo-500 md:hover:text-white'>Change Password</button>
        </div>
      </div>
    </div>
  )
}

export default Account
