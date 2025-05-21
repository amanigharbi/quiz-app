import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est requis.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, user_id: user?.id }),
      });

      const data = await res.json();
      console.log("Reçu:", data);

      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du quiz.");
        return;
      }

      // Rediriger vers page d’ajout de questions par exemple
      navigate(`/quizzes/${data.id}/add-questions`);
    } catch (err) {
      setError("Erreur de connexion.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Créer un nouveau quiz</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre du quiz"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        />
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>
    </div>
  );
}
