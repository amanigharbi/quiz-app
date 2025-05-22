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
import { Link, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword) {
      return setError("Veuillez remplir tous les champs.");
    }

    if (!validateEmail(email)) {
      return setError("Adresse e-mail invalide.");
    }

    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log("aaaaaaaa",data);
      if (!res.ok) {
        setError(data.error || "Erreur lors de l’inscription.");
        return;
      }

      toast.success("Inscription réussie ! Redirection...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error("Erreur de connexion au serveur.");
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
      className="login-container d-flex justify-content-center body"
    >
      <MDBCard
        className="login-card rounded-5 shadow"
        style={{ maxWidth: "900px" }}
      >
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="register visual"
              className="rounded-start w-100"
              style={{ objectFit: "cover", height: "100%" }}
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column justify-content-center px-5">
              <div className="d-flex justify-content-center align-items-center mb-4">
                <img src="/logo.png" alt="Logo" style={{ height: "100px" }} />
              </div>

              <h5 className="fw-normal mb-4 pb-3">Créer un compte</h5>
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
                label="Nom d'utilisateur"
                type="text"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <MDBInput
                wrapperClass="mb-2"
                label="Adresse email"
                type="email"
                size="lg"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValid(validateEmail(e.target.value));
                }}
              />
              {email && !emailValid && (
                <small className="text-danger ms-1">
                  Format de l’email invalide
                </small>
              )}

              <MDBRow className="mb-4 mt-2">
                <MDBCol md="6">
                  <div className="position-relative">
                    <MDBInput
                      label="Mot de passe"
                      type={passwordVisible ? "text" : "password"}
                      size="lg"
                      value={password}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                        setPasswordStrength(evaluatePasswordStrength(val));
                      }}
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

                  {password && (
                    <div className="mt-2">
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className={`progress-bar ${
                            passwordStrength <= 1
                              ? "bg-danger"
                              : passwordStrength === 2
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          role="progressbar"
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          aria-valuenow={passwordStrength}
                          aria-valuemin="0"
                          aria-valuemax="4"
                        ></div>
                      </div>
                      <small className="text-muted">
                        {passwordStrength === 0 && "Trop faible"}
                        {passwordStrength === 1 && "Faible"}
                        {passwordStrength === 2 && "Moyen"}
                        {passwordStrength >= 3 && "Fort"}
                      </small>
                    </div>
                  )}
                </MDBCol>

                <MDBCol md="6">
                  <div className="position-relative">
                    <MDBInput
                      label="Confirmation"
                      type={confirmPasswordVisible ? "text" : "password"}
                      size="lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPasswordVisible ? (
                      <FaEyeSlash
                        style={iconStyle}
                        onClick={() => setConfirmPasswordVisible(false)}
                      />
                    ) : (
                      <FaEye
                        style={iconStyle}
                        onClick={() => setConfirmPasswordVisible(true)}
                      />
                    )}
                  </div>
                </MDBCol>
              </MDBRow>

              <MDBBtn
                className="mb-4 px-5"
                color="primary"
                size="lg"
                onClick={handleRegister}
              >
                S'inscrire
              </MDBBtn>

              <p className="mb-5 pb-lg-2">
                Vous avez déjà un compte ?{" "}
                <Link to="/login" style={{ color: "#393f81" }}>
                  Connectez-vous ici
                </Link>
              </p>

              <div className="d-flex flex-row justify-content-start">
                <a href="#" className="small text-muted me-1">
                  Conditions d'utilisation.
                </a>
                <a href="#" className="small text-muted">
                  Politique de confidentialité
                </a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
      <ToastContainer position="top-right" autoClose={1500} />
    </MDBContainer>
  );
};

export default Register;
