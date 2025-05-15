import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return user ? (
    <div>
      <h2>Bienvenue {user.username} 👋</h2>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  ) : (
    <p>Non connecté</p>
  );
}
