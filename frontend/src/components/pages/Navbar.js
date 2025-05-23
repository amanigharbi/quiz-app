import { MDBIcon } from "mdb-react-ui-kit";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
  };
  return (
    <nav
      className="navbar navbar-expand-lg bg-light navbar-light "
      style={{
        borderRadius: "5px",
      }}
    >
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <img
              src="/logo-100.png"
              height="40"
              width="80"
              alt="quiz Logo"
              loading="lazy"
            />
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/mes-quizzes"
                className={`nav-link ${
                  isActive("/mes-quizzes") ? "active" : ""
                }`}
              >
                📝 Mes Quizes
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/historique"
                className={`nav-link ${
                  isActive("/historique") ? "active" : ""
                }`}
              >
                📊 Historique des Quizzes
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center">
       
          <div className="dropdown">
            <div
              className="d-flex align-items-center gap-3 bg-primary text-white radius-10 p-2"
              style={{
                borderRadius: "10px",
              }}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.username || "User"
                )}&background=fff&color=3B71CA&size=150`}
                className="rounded-circle"
                height="25"
                alt="Black and White Portrait of a Man"
                loading="lazy"
              />
              {/* <Link to="/profil" className=="text-white text-decoration-none"> */}
              {user?.username || "user"}
              {/* </Link> */}

              <button
                className="btn btn-white btn-sm"
                onClick={handleLogout}
                title="Déconnexion"
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <MDBIcon icon="sign-out-alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
