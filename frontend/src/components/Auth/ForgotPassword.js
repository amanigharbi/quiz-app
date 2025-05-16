import { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import Alert from "react-bootstrap/Alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setMessage("");
    setError("");
    if (!email) {
      setError("Veuillez saisir un email.");
      return;
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
        setMessage(data.message || "Vérifiez votre boîte mail.");
        setEmail(""); // Reset email input
      }
    } catch (err) {
      setError("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="mt-5" style={{ maxWidth: "400px" }}>
      <h4>Mot de passe oublié</h4>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <MDBInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3"
          required
        />

        <MDBBtn type="submit" disabled={loading} className="w-100">
          {loading ? "Envoi en cours..." : "Envoyer un lien"}
        </MDBBtn>
      </form>
    </MDBContainer>
  );
}
