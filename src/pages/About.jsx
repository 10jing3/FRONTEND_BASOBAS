import React from "react";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <header
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://t3.ftcdn.net/jpg/01/79/49/56/360_F_179495677_LMiOo97wzUMwkOcVaow1sgf39iYyMTTX.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="relative text-white text-4xl md:text-5xl font-bold">
          About Us
        </h1>
      </header>

      {/* Who I Am Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Who I Am
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center">
          Hi there! I’m the creator of{" "}
          <span className="text-green-500 font-semibold">BasoBas</span>, a
          platform designed to make finding and renting a home simple and
          stress-free. With a passion for solving real-world problems, I built
          this platform to connect tenants and landlords in a way that’s
          transparent, efficient, and hassle-free.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Why Choose BasoBas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-10 w-10 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mt-4">Easy to Use</h3>
              <p className="text-gray-600 mt-2">
                A simple and intuitive interface to make finding homes easier.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-10 w-10 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11V7m0 0L9 10m3-3l3 3m0 10H6m12 0h2a2 2 0 002-2v-8a2 2 0 00-2-2h-2m0 0L9 3M15 9V3m0 10v6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mt-4">Affordable Options</h3>
              <p className="text-gray-600 mt-2">
                Compare prices and find homes that fit your budget.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-10 w-10 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16l4-4 4 4m0 0l-4-4-4 4m0 0V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mt-4">Secure Payments</h3>
              <p className="text-gray-600 mt-2">
                Safe and reliable payment options to ensure trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-600 leading-relaxed">
          <li>Roommate Matching to help you find the ideal companion.</li>
          <li>Interactive maps to locate properties near your area.</li>
          <li>Virtual tours to view homes without leaving yours.</li>
          <li>Real-time communication between tenants and landlords.</li>
          <li>Customizable filters for price, location, and amenities.</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">What is BasoBas?</h3>
              <p className="text-gray-600">
                BasoBas is a platform designed to simplify the process of
                finding, renting, and managing properties for tenants and
                landlords.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                How do I search for a room?
              </h3>
              <p className="text-gray-600">
                Use the search bar on the homepage to filter by location, price,
                and other preferences to find your ideal home.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Absolutely! We use industry-standard encryption to ensure your
                payment information is safe and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
