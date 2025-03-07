import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import News from "./pages/News";
import Footer from "./components/Footer";
import Room from "./pages/Room";
import RoomDetail from "./pages/RoomDetail";
import Dashboard from "./pages/admin/Dashboard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SingleRoom from "./pages/Room/RoomDisplay";
import RoomEditForm from "./pages/admin/RoomFormEdit";

const AppContent = () => {
  const location = useLocation();

  // Specify the routes where Footer should be excluded
  const noFooterRoutes = ["/sign-in", "/sign-up", "/profile", "/dashboard"];
  const noHeaderRoutes = [""];

  return (
    <>
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/news" element={<News />} />
        <Route path="/room" element={<Room />} />
        <Route path="/roomdetail" element={<RoomDetail />} />
        <Route path="/room/:roomId" element={<SingleRoom />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-room/:roomId" element={<RoomEditForm />} />
        </Route>
      </Routes>
      {/* Conditionally render Footer */}
      {!noFooterRoutes.includes(location.pathname) && <Footer />}

      {/* Conditionally render Header */}
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
