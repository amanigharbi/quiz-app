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
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      return setError("Veuillez saisir une adresse email.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la requête.");
      } else {
        setMessage(data.message || "Lien envoyé. Vérifiez votre boîte mail.");
        setEmail("");
      }
    } catch {
      setError("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
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
              alt="forgot"
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
                Mot de passe oublié
              </h5>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <MDBInput
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4"
                  required
                />

                <MDBBtn type="submit" disabled={loading} className="w-100 mb-4">
                  {loading
                    ? "Envoi en cours..."
                    : "Envoyer le lien de réinitialisation"}
                </MDBBtn>
              </form>
              <p className="mb-5 pb-lg-2">
                <Link to="/login" style={{ color: "#393f81" }}>
                  Retour à la page de connexion
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
    </MDBContainer>
  );
}
