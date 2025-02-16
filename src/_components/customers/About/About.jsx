import React from "react";
import about from "../../../assets/team.jpg";

function About() {
  return (
    <div className="bg-[#fff] lg:px-10 xl:px-10 md:px-10 px-6 py-16 w-full h-full">
      <div className="heading flex flex-col items-center mb-10 md:mb-20">
        <h2 className="text-3xl text-center md:text-5xl xl:text-5xl font-bold text-gray-700 mb-3">
          Who <span className="text-indigo-500">We Are ?</span>
        </h2>
        <p className="text-sm md:text-lg md:font-semibold font-medium text-gray-400">
          Learn about our mission, values, and the passion that drives us
          forward
        </p>
      </div>

      {/* Content */}
      <div className="content mt-10 py-4 px-0 md:p-10 w-full flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="desc w-[100%] md:w-[50%] text-start text-gray-700 text-lg font-medium border-l-4 border-indigo-600 p-6 py-0">
          <p className="font-semibold text-xl">At <span className="text-indigo-600">Aplango</span>,</p>
          <ul>
            <li className='mt-6 pl-4 hover:text-indigo-600'>
              <p>
                We are passionate about connecting businesses and customers
                through the power of savings and value.
              </p>
            </li>
            <li className='mt-6 pl-4 hover:text-indigo-600'>
              <p>
                As a dynamic company, we specialize in offering exclusive
                coupons, discounts, and carefully curated products that create
                win-win opportunities for businesses and consumers alike.
              </p>
            </li>
            <li className='mt-6 pl-4 hover:text-indigo-600'>
              <p>
                Our mission is simple: To help our clients grow their customer
                base and foster loyalty by providing enticing discounts that
                make shopping an exciting and rewarding experience.
              </p>
            </li>
            <li className='mt-6 pl-4 hover:text-indigo-600'>
              <p>
                Whether you’re a business looking to attract new customers or a
                shopper searching for the best deals, Aplango is your trusted
                partner in delivering value that benefits everyone.
              </p>
            </li>
            <li className='mt-6 pl-4 hover:text-indigo-600'>
              <p>
                Join us as we redefine the way businesses and customers
                connect—through innovation, affordability, and unbeatable
                offers.
              </p>
            </li>
          </ul>
        </div>
        <div className="image w-full md:w-[40%] p-0 rounded-lg">
          <img src={about} className="rounded-lg w-full h-[550px] object-cover" alt="" />
        </div>
      </div>
    </div>
  );
}

export default About;
