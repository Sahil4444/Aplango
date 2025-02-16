import React from "react";
import "./process.css";
import voucher from "../../../assets/voucher.png"
import redeem from "../../../assets/redeem.png"

function Process() {
  return (
    <section id="processes" className="w-full px-10 py-16 bg-[#212121]">
      <div className="flex flex-col items-center gap-3 text-center mb-10 md:mb-20">
        <h2 className="text-3xl text-center md:text-5xl xl:text-5xl font-bold text-white mb-3">
          Key <span className="text-indigo-500">Process</span>
        </h2>
        <p className="text-sm md:text-lg md:font-semibold font-medium text-red-400">
          Follow instructions for more
        </p>
      </div>

      <div className="w-full px-3">
        {/* Card 1 */}
        <div className="flex w-full flex-col items-center justify-center lg:flex-row gap-6 md:gap-28 mb-24 md:hover:border-l-2 md:hover:border-indigo-500">
          {/* Image */}
          <div className="">
            <div className="card w-[300px] md:w-[400px]">
              <div className="card__border"></div>
              <div className="card_title__container">
                <span className="card_title">APLANGO</span>
                <p className="card_paragraph">
                  Explore all offers & discounts.
                </p>
              </div>
              <hr className="line" />
              <div className="flex text-white text-xl flex-col items-center justify-center py-4 md:py-7">
                <h2 className="flex items-center">
                  1912 4568 <span className="ml-2">****</span>
                </h2>
              </div>
              <p className="text-center text-white text-md font-medium">
                Valid till mm/yyyy
              </p>
            </div>
            
          </div>

          {/* Content */}
          <div className="w-72 flex flex-col items-center gap-4">
            <div className="space-y-5">
              <h3 className="text-4xl font-bold text-white">
                Buy Your <span className="text-red-400">New Card</span>
              </h3>
              <p className="text-slate-300">
                Get your card today and enjoy exclusive benefits, special
                discounts, and seamless transactions. Buy now and make the most
                of every purchase!
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex mb-24 flex-col items-center justify-center lg:flex-row gap-6 md:gap-28 md:hover:border-l-2 md:hover:border-indigo-500">
          {/* Content */}
          <div className="w-72 flex flex-col gap-8">
            <div className="space-y-5">
              <h3 className="text-4xl font-bold text-white">
              Explore <span className="text-red-400">Benefits</span>
              </h3>
              <p className="text-slate-300">
              Unlock a world of exclusive deals, unbeatable discounts, and special promotions designed just for you. Whether you're looking for limited-time offers or everyday savings, we’ve got you covered.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="w-80 md:w-96">
            <img src={voucher} alt="Voucher" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center justify-center lg:flex-row gap-6 md:gap-28 md:hover:border-l-2 md:hover:border-indigo-500">
          {/* Image */}
          <div className="">
           <img src={redeem} alt="Redeem" className="w-96" />
          </div>

          {/* Content */}
          <div className="w-72 flex flex-col gap-8">
            <div className="space-y-5">
              <h3 className="text-4xl font-bold text-white">
                Redeem & <span className="text-red-400">SAVE</span>
              </h3>
              <p className="text-slate-300">
              Redeem your coupon now and enjoy exclusive discounts on your favorite products. Don’t miss out—grab your deal today and start saving!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;

// <div
// className="w-full px-5 py-8 bg-[#e8e8e8]"
// //   style={{
// //     backgroundImage:
// //       "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)",
// //   }}
// >
// <h1 className="heading text-indigo-600 text-4xl font-bold mb-5">
//   Key Processes
// </h1>
// <div className="card-group flex flex-wrap justify-center items-center px-8 py-10 gap-7 w-full">
//   <div className="flex flex-col bg-white rounded-3xl">
//     <div className="px-6 py-8 sm:p-10 sm:pb-6">
//       <div className="grid items-center justify-center w-full grid-cols-1 text-left">
//         <div>
//           <h2 className="text-lg font-medium tracking-tighter text-gray-800 lg:text-3xl">
//             Buy a card
//           </h2>
//           <p className="mt-2 text-sm text-gray-500">
//             To grab your offers and discounts.
//           </p>
//         </div>
//         <div className="mt-6">
//           <p>
//             <span className="text-5xl font-light tracking-tight text-black">
//               $25
//             </span>
//             <span className="text-base font-medium text-gray-500"> /card </span>
//           </p>
//         </div>
//       </div>
//     </div>
//     <div className="flex px-6 pb-8 sm:px-8">
//       <a
//         aria-describedby="tier-company"
//         className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
//         href="/"
//       >
//         Buy Now
//       </a>
//     </div>
//   </div>
//   <div className="flex flex-col bg-white rounded-3xl">
//     <div className="px-6 py-8 sm:p-10 sm:pb-6">
//       <div className="grid items-center justify-center w-full grid-cols-1 text-left">
//         <div>
//           <h2 className="text-lg font-medium tracking-tighter text-gray-800 lg:text-3xl">
//             Buy a card
//           </h2>
//           <p className="mt-2 text-sm text-gray-500">
//             To grab your offers and discounts.
//           </p>
//         </div>
//         <div className="mt-6">
//           <p>
//             <span className="text-5xl font-light tracking-tight text-black">
//               $25
//             </span>
//             <span className="text-base font-medium text-gray-500"> /card </span>
//           </p>
//         </div>
//       </div>
//     </div>
//     <div className="flex px-6 pb-8 sm:px-8">
//       <a
//         aria-describedby="tier-company"
//         className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
//         href="/"
//       >
//         Buy Now
//       </a>
//     </div>
//   </div>
//   <div className="flex flex-col bg-white rounded-3xl">
//     <div className="px-6 py-8 sm:p-10 sm:pb-6">
//       <div className="grid items-center justify-center w-full grid-cols-1 text-left">
//         <div>
//           <h2 className="text-lg font-medium tracking-tighter text-gray-800 lg:text-3xl">
//             Buy a card
//           </h2>
//           <p className="mt-2 text-sm text-gray-500">
//             To grab your offers and discounts.
//           </p>
//         </div>
//         <div className="mt-6">
//           <p>
//             <span className="text-5xl font-light tracking-tight text-black">
//               $25
//             </span>
//             <span className="text-base font-medium text-gray-500"> /card </span>
//           </p>
//         </div>
//       </div>
//     </div>
//     <div className="flex px-6 pb-8 sm:px-8">
//       <a
//         aria-describedby="tier-company"
//         className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
//         href="/"
//       >
//         Buy Now
//       </a>
//     </div>
//   </div>
// </div>
// </div>
