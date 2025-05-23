import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import News from "./pages/News";
import Footer from "./components/Footer";
import Dashboard from "./pages/admin/Dashboard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SingleRoom from "./pages/Room/RoomDisplay";
import RoomEditForm from "./pages/admin/RoomFormEdit";
import VirtualRoom from "./pages/Room/VirtualRoom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Success from "./components/Success";
import Failure from "./components/Failure";
import Search from "./pages/Room/Search";
import AddRoom from "./pages/Room/AddRoom";
import Contact from "./pages/Contact";
import PasswordReset from "./pages/PasswordReset";
import ScrollToTop from "./components/ScrollToTop";

const AppContent = () => {
  const location = useLocation();

  // Check if current path starts with any of these routes
  const shouldHideHeader =
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/admin/login") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/vr-room");

  const shouldHideFooter =
    location.pathname.startsWith("/sign-in") ||
    location.pathname.startsWith("/sign-up") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/admin/login") ||
    location.pathname.startsWith("/vr-room");

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/news" element={<News />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="/vr-room/:roomId" element={<VirtualRoom />} />
        <Route path="/room/:roomId" element={<SingleRoom />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-room/:roomId" element={<RoomEditForm />} />
          <Route path="/create-room" element={<AddRoom />} />
        </Route>
        <Route path="/success/:roomId" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
        <Route path="/search" element={<Search />} />
        <Route path="/reset-password" element={<PasswordReset />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
