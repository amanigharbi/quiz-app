// pages/HistoriqueQuiz.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import Footer from "../Footer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function HistoriqueQuiz() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_URL}/quizzes/user/${user.id}/history`)
      .then((res) => res.json())
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [user]);

  const handleDownloadPDF = async (quizId) => {
    const res = await fetch(`${API_URL}/quizzes/history/${quizId}/${user.id}`);
    const data = await res.json();

    const doc = new jsPDF();
    const { score, duration_seconds, completed_at, details } = data;
    const minutes = Math.floor(duration_seconds / 60);
    const seconds = duration_seconds % 60;

    doc.setFontSize(16);
    doc.text("Résultat du Quiz", 14, 20);
    doc.text(`Score : ${score}%`, 14, 30);
    doc.text(`Durée : ${minutes} min ${seconds} sec`, 14, 38);
    doc.text(`Fait le : ${new Date(completed_at).toLocaleString()}`, 14, 46);

    const rows = details.map((q, i) => [
      `Q${i + 1}: ${q.question}`,
      q.answers
        .map((a) => `${a.answer_text} ${a.is_correct ? "(correct)" : ""}`)
        .join("\n"),
    ]);

    autoTable(doc, {
      startY: 55,
      head: [["Question", "Réponses"]],
      body: rows,
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 120 } },
    });

    doc.save(`quiz-${quizId}.pdf`);
  };
  const fetchAndShowDetails = async (quizId) => {
    const res = await fetch(`${API_URL}/quizzes/history/${quizId}/${user.id}`);
    const data = await res.json();
    setSelectedResult({ ...data, quizId });
    setShowModal(true);
  };
  if (!user) {
    return <p className="text-center mt-5">Chargement de l'utilisateur...</p>;
  }

  return (
    <div
      className="min-h-screen d-flex flex-column"
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Navbar />
      <div className="container py-5" style={{ height: "80vh" }}>
        <h2 className="mb-4">📚 Historique de vos Quizzes</h2>
        {history.length === 0 ? (
          <MDBCol md="6" className="mx-auto mt-2">
            <MDBCard
              className="text-center p-4"
              style={{ backgroundColor: "#fff" }}
            >
              <MDBCardImage
                src="https://as2.ftcdn.net/jpg/02/71/16/45/1000_F_271164519_OiWrNX7qPPXcPLs8MxcJDe67tzZekDgz.jpg"
                position="top"
                alt="Pas de quiz disponible"
                style={{ maxWidth: "200px", margin: "0 auto" }}
              />
              <MDBCardBody>
                <MDBCardTitle>Aucun quiz complété.</MDBCardTitle>
                <MDBCardText>
                  Vous n'avez pas encore passer de quiz.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ) : (
          <MDBTable striped>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Titre du Quiz</th>
                <th>Score</th>
                <th>Durée</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.score} %</td>
                  <td>{item.duration_seconds} sec</td>
                  <td>{new Date(item.completed_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => fetchAndShowDetails(item.quiz_id)}
                    >
                      👁 Voir détail
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleDownloadPDF(item.quiz_id)}
                    >
                      📄 PDF
                    </button>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        )}
      </div>
      <Footer />
      {showModal && selectedResult && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📋 Détail du Quiz</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Score :</strong> {selectedResult.score}%
                </p>
                <p>
                  <strong>Durée :</strong>{" "}
                  {Math.floor(selectedResult.duration_seconds / 60)} min{" "}
                  {selectedResult.duration_seconds % 60} sec
                </p>
                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(selectedResult.completed_at).toLocaleString()}
                </p>
                <hr />
                {selectedResult.details.map((q, i) => (
                  <div key={i} className="mb-3">
                    <p>
                      <strong>Q{i + 1}:</strong> {q.question}
                    </p>
                    <ul>
                      {q.answers.map((a) => (
                        <li
                          key={a.id}
                          style={{ color: a.is_correct ? "green" : "black" }}
                        >
                          {a.answer_text} {a.is_correct && "✔"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Fermer
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                    handleDownloadPDF(selectedResult.quizId);
                  }}
                >
                  📄 Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
