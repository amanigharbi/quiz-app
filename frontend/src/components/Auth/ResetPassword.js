import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import Alert from "react-bootstrap/Alert";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
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
        setMessage("Mot de passe mis à jour. Redirection...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="mt-5" style={{ maxWidth: "400px" }}>
      <h4>Réinitialiser le mot de passe</h4>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <form onSubmit={handleReset}>
        <MDBInput
          label="Nouveau mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
          required
          minLength={6}
        />

        <MDBBtn type="submit" disabled={loading} className="w-100">
          {loading ? "Chargement..." : "Changer le mot de passe"}
        </MDBBtn>
      </form>
    </MDBContainer>
  );
}
