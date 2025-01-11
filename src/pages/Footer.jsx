import React from "react";

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
            {["About us", "Announcements", "News", "Contact", "Features"].map(
              (item, index) => (
                <li key={index} className="hover:text-green-500 cursor-pointer">
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Office Section */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">Our Office</h3>
          <address className="not-italic text-sm text-gray-400 leading-relaxed">
            1234 Harmony Lane, Suite 567
            <br />
            Eden Heights, Pune 411042
            <br />
            India
          </address>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 R. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-green-500 transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-green-500 transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-green-500 transition-colors cursor-pointer"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
