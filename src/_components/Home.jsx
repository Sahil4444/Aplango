import React from 'react'
import Navbar from './customers/Navbar/Navbar'
import Hero from './customers/Hero/Hero'
import About from './customers/About/About'
import Process from './customers/Process/Process'
import Contact from './customers/Contact/Contact'
import Footer from './customers/Footer/Footer'
import Clients from './customers/Clients/Clients'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Process />
      <Clients />
      <About />
      <Contact />
      <Footer />
    </>
  )
}

export default Home
