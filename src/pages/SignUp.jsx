import React from "react";
import { Link } from "react-router-dom";
function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 class="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form class="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          class="border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          class="border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          class="border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          id="password"
        />

        <button
          class="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled
        >
          Sign Up
        </button>
      </form>
      <div class="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 hover:underline"> Sign In</span>
        </Link>
      </div>
      <p class="text-red-500 mt-5 hidden" id="error">
        Error message goes here.
      </p>
    </div>
  );
}

export default SignUp;
