import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

import "../../styles/Pages.css";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!emailOrUsername || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la connexion.");
        return;
      }

      setSuccess("Connexion réussie ! Redirection...");
      localStorage.setItem("token", data.token);
      setTimeout(() => navigate("/profile"), 1500); // Redirige après succès
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
  };
  const iconStyle = {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 2,
  };
  return (
    <MDBContainer
      fluid
      className="login-container d-flex justify-content-center"
    >
      <MDBCard
        className="login-card rounded-5 shadow"
        style={{ maxWidth: "900px" }}
      >
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="login"
              className="w-100 h-100 rounded-start"
              style={{ objectFit: "cover" }}
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column justify-content-center px-5">
              <div className="d-flex justify-content-center align-items-center">
                <img src="/logo.png" alt="Logo" style={{ height: "120px" }} />
              </div>

              <h5 className="fw-normal mb-4 pb-3">
                Connectez-vous à votre compte
              </h5>

              {success && (
                <Alert variant="success" style={{ textAlign: "center" }}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert variant="danger" style={{ textAlign: "center" }}>
                  {error}
                </Alert>
              )}

              <MDBInput
                wrapperClass="mb-4"
                label="Email ou nom d'utilisateur"
                id="emailOrUsername"
                type="text"
                size="lg"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />

              <div className="position-relative mb-4">
                <MDBInput
                  label="Mot de passe"
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordVisible ? (
                  <FaEyeSlash
                    style={iconStyle}
                    onClick={() => setPasswordVisible(false)}
                  />
                ) : (
                  <FaEye
                    style={iconStyle}
                    onClick={() => setPasswordVisible(true)}
                  />
                )}
              </div>

              <MDBBtn
                className="mb-4 px-5"
                color="dark"
                size="lg"
                onClick={handleLogin}
              >
                Se connecter
              </MDBBtn>
              <Link to="/forgot-password" style={{ color: "#393f81" }}>
                Mot de passe oublié ?
              </Link>

              <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                Vous n'avez pas de compte ?{" "}
                <Link to="/register" style={{ color: "#393f81" }}>
                  Inscrivez-vous ici
                </Link>
              </p>

              <div className="d-flex flex-row justify-content-start">
                <a href="#!" className="small text-muted me-1">
                  Conditions d'utilisation
                </a>
                <a href="#!" className="small text-muted">
                  Politique de confidentialité
                </a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
