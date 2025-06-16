import React from 'react'

function Banner() {
  return (
    <div
      className={`lg:px-10 xl:px-10 md:px-10 px-6 py-16 w-full ${
        location.pathname !== "/ui" ? "mt-0" : "mt-0"
      } md:mt-0 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]`}
    >
      Banner
    </div>
  )
}

export default Banner
