import React from "react";
import logo from "../../../assets/logo.png";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

function Footer() {
  const links = [
    {
      link_name: "Home",
      link_addr: "/",
    },
    {
      link_name: "Clients",
      link_addr: "/",
    },
    {
      link_name: "About Us",
      link_addr: "/",
    },
    {
      link_name: "Contact us",
      link_addr: "/",
    },
  ];

  const presence = [
    { country: "India", email: "ind@aplango.in" },
  ];

  const policies = [
    "Privacy Policy",
    "Terms & Conditions",
    "Cancellation And Refund",
    "Disclaimer Policy",
  ];

  return (
    <footer className="bg-[#D3D9D4] p-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info Section */}
          <div className="space-y-4">
            <img
              src={logo}
              alt="RewardPort Logo"
              width={200}
              height={60}
              className="mb-4"
            />
            <p className="text-gray-600 text-md text-justify">
              Aplango is your ultimate destination for exclusive coupons,
              discounts, and offers from top premium brands and stores. We help
              you save big on your favorite products by providing the best
              deals, special promotions, and limited-time offers. <br />
              Whether you're shopping for fashion, electronics, beauty, or more,
              Aplango ensures you get the best value with seamless access to
              unbeatable savings. Start exploring and enjoy premium shopping for
              less!
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg text-indigo-600 font-semibold mb-4">
              QUICK <span className="">LINKS</span>
            </h3>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.link_addr}
                    className="text-gray-600 hover:text-indigo-600 font-medium text-sm"
                  >
                    {link.link_name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Presence Section */}
          <div>
            <h3 className="text-lg text-indigo-600 font-semibold mb-4">
              OUR PRESENCE
            </h3>
            <div className="space-y-4">
              {presence.map((location, index) => (
                <div key={index}>
                  <h4 className="font-medium">{location.country}</h4>
                  <p className="text-gray-600 text-sm">{location.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registered Office Section */}
          <div>
            <h3 className="text-lg text-indigo-600 font-semibold mb-4">
              REGISTERED OFFICE
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-indigo-600 mt-0" />
                <p className="text-gray-600 text-sm">relationship@aplango.in</p>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                <p className="text-gray-600 text-sm">+919930030693</p>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-7 text-indigo-600 mt-1" />
                <p className="text-gray-600 text-sm">
                  316 Woodrow, Veera Desai Rd, Andheri(W), Mumbai - 53
                </p>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold text-indigo-600">
                  OUR POLICIES
                </h3>
                <ul className="space-y-2">
                  {policies.map((policy, index) => (
                    <li key={index}>
                      <a
                        href="/"
                        className="text-gray-600 hover:text-indigo-600 text-sm"
                      >
                        {policy}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg text-indigo-600 font-semibold">
                  FOLLOW US ON
                </h3>
                <div className="flex space-x-4">
                  <a href="/" className="text-gray-600 hover:text-indigo-600">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="/" className="text-gray-600 hover:text-indigo-600">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="/" className="text-gray-600 hover:text-indigo-600">
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            ©2025 Aplango Pvt. Ltd. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
