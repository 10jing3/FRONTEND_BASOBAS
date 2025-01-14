import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-10 border-t border-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo Section */}
        <div className="col-span-1">
          <div className="flex items-center space-x-2">
            <div className="text-green-500 text-4xl font-bold">BasoBas</div>
          </div>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            "We are committed to ensuring detailed accessibility for all."
          </p>
        </div>

        {/* Support Section */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Help videos",
              "Accessories",
              "Support",
              "View Booking",
              "Features",
            ].map((item, index) => (
              <li key={index} className="hover:text-green-500 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Service Section */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">Service</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Payment & Taxes",
              "Accessories",
              "Support",
              "Terms of Service",
              "Features",
            ].map((item, index) => (
              <li key={index} className="hover:text-green-500 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* About Us Section */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">About Us</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "About us", path: "/about" },
              { name: "Announcements", path: "/about" },
              { name: "News", path: "/news" },
              { name: "Contact", path: "/about" },
              { name: "Features", path: "/about" },
            ].map((item, index) => (
              <li key={index} className="hover:text-green-500 cursor-pointer">
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Office Section */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">Our Office</h3>

          <address className="not-italic text-sm text-gray-400 leading-relaxed mt-4">
            789 Budhanilkantha Road, Block A
            <br />
            Kathmandu 44600
            <br />
            Nepal
          </address>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
