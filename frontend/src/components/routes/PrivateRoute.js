import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Redirige vers /login si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
