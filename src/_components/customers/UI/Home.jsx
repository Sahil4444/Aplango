import { Outlet } from "react-router-dom"
import Navbar from "./Navbar/Navbar"
import Footer from "../Footer/Footer"

function UiHome() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {" "}
        {/* Add top padding to account for fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default UiHome
