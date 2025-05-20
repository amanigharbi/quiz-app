import { LogOut } from "lucide-react";
import { MDBIcon } from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ username, onLogout }) {
  return (
    <nav
      class="navbar navbar-expand-lg bg-light navbar-light "
      style={{
        borderRadius: "5px",
      }}
    >
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <a class="navbar-brand mt-2 mt-lg-0" href="#">
            <img
              src="/logo-100.png"
              height="40"
              width="80"
              alt="quiz Logo"
              loading="lazy"
            />
          </a>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#">
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Mes Quizes
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Mon Profil
              </a>
            </li>
          </ul>
        </div>

        <div class="d-flex align-items-center">
          <div class="dropdown">
            <a
              data-mdb-dropdown-init
              class="text-reset me-3 dropdown-toggle hidden-arrow"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              aria-expanded="false"
            >
              <i class="fas fa-bell"></i>
              <span class="badge rounded-pill badge-notification bg-danger">
                1
              </span>
            </a>
          </div>
          <div class="dropdown">
            {/* <a
              data-mdb-dropdown-init
              class="dropdown-toggle d-flex align-items-center hidden-arrow"
              href="#"
              id="navbarDropdownMenuAvatar"
              role="button"
              aria-expanded="false"
            > */}
            <div
              className="d-flex align-items-center gap-3 bg-primary text-white radius-10 p-2"
              style={{
                borderRadius: "10px",
              }}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  username || "User"
                )}&background=fff&color=3B71CA&size=150`}
                class="rounded-circle"
                height="25"
                alt="Black and White Portrait of a Man"
                loading="lazy"
              />
              {/* <Link to="/profil" className="text-white text-decoration-none"> */}
              {username || "user"}
              {/* </Link> */}

              <button
                className="btn btn-white btn-sm"
                onClick={onLogout}
                title="logout"
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <MDBIcon icon="sign-out-alt" />
              </button>
            </div>

            {/* <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  username || "User"
                )}&background=3B71CA&color=fff&size=150`}
                class="rounded-circle"
                height="25"
                alt="Black and White Portrait of a Man"
                loading="lazy"
              />
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuAvatar"
            >
              <li>
                <a class="dropdown-item" href="#">
                  My profile
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Logout
                </a>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
