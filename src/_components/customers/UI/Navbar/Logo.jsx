import React from "react"
import logo from "../../../../assets/logo.png"
import { Link } from "react-router-dom"

const Logo = () => {
  return (
    <div className="flex-shrink-0">
      <img className="h-14 w-auto" src={logo} alt="Your Company" />
    </div>
  )
}

export default Logo

