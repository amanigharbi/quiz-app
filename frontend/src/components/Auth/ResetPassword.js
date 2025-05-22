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
import { useParams, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      return setError("Veuillez remplir tous les champs.");
    }

    if (password.length < 6) {
      return setError("Le mot de passe doit contenir au moins 6 caractères.");
    }

    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la réinitialisation.");
      } else {
        toast.success("Mot de passe mis à jour. Redirection...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch {
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
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
              alt="reset"
              className="rounded-start w-100"
              style={{ objectFit: "cover", height: "100%" }}
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column justify-content-center px-5">
              <div className="d-flex justify-content-center align-items-center">
                <img src="/logo.png" alt="Logo" style={{ height: "120px" }} />
              </div>
              <h5 className="fw-normal mb-4 pb-3 text-center">
                Réinitialiser votre mot de passe
              </h5>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <form onSubmit={handleReset}>
                <div className="position-relative mb-4">
                  <MDBInput
                    label="Nouveau mot de passe"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPassword(val);
                      setPasswordStrength(evaluatePasswordStrength(val));
                    }}
                    required
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
                <div className="position-relative mb-4">
                  <MDBInput
                    label="Confirmer le mot de passe"
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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

                <MDBBtn type="submit" disabled={loading} className="w-100 mb-4">
                  {loading ? "En cours..." : "Changer le mot de passe"}
                </MDBBtn>
              </form>

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
}
