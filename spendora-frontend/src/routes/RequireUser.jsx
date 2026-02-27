import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

export default function RequireUser({ children }) {
  const { userId } = useUserContext();
  const location = useLocation();

  if (!userId) {
    return <Navigate to="/users" state={{ from: location.pathname }} replace />;
  }

  return children;
}
