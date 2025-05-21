import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Chargement...</div>; // ou un spinner
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
