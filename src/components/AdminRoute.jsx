import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);

  const isAdmin = currentUser && currentUser.role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;
}
