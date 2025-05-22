// components/pages/Quizzes/ResultQuiz.jsx
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function ResultQuiz() {
  const { state } = useLocation();
  const [ranking, setRanking] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/quizzes/${quizId}/scores`)
      .then((res) => res.json())
      .then(setRanking)
      .catch(() => setRanking([]));
    console.log("quiz_id reçu:", quizId);
  }, [quizId]);

const handleExportPDF = () => {
  const doc = new jsPDF();

  const score = state.score;
  const duration = state.duration || 0;
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  doc.setFontSize(16);
  doc.text("Resultat du Quiz", 14, 20);
  doc.text(`Score : ${score}%`, 14, 30);
  doc.text(`Duree : ${minutes} min ${seconds} sec`, 14, 38);

  if (score >= 80) {
    doc.setTextColor(0, 128, 0);
    doc.setFontSize(14);
    doc.text("CERTIFICAT DE REUSSITE", 14, 50);
    doc.setFontSize(12);
    doc.text(
      "Felicitations ! Vous avez reussi ce quiz avec succes.",
      14,
      58
    );
  }

  const rows = state.details.map((q, i) => [
    `Q${i + 1}: ${q.question}`,
    q.answers
      .map((a) => {
        const mark = a.is_correct ? "(correct)" : q.selected === a.id ? "(votre choix)" : "";
        return `${a.answer_text} ${mark}`;
      })
      .join("\n"),
  ]);

  autoTable(doc, {
    startY: score >= 80 ? 70 : 50,
    head: [["Question", "Reponses"]],
    body: rows,
    styles: { cellWidth: "wrap", fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  doc.save("resultat-quiz.pdf");
};



  return (
    <div
      className="min-h-screen flex flex-col "
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Navbar />
      <MDBContainer className="py-3">
        <MDBCard
          className="mx-auto"
          style={{ maxWidth: "800px", height: "fit-content" }}
        >
          <MDBCardBody>
            <h3 className="text-center">🎉 Résultat du Quiz</h3>
            <p className="text-center">
              Score : <strong>{state.score}%</strong>
            </p>
            {state.details.map((q, i) => (
              <div key={i} className="mb-3">
                <p>
                  <strong>Q{i + 1}:</strong> {q.question}
                </p>
                <ul>
                  {q.answers.map((a) => (
                    <li
                      key={a.id}
                      style={{
                        color: a.is_correct
                          ? "green"
                          : q.selected === a.id
                          ? "red"
                          : "black",
                      }}
                    >
                      {a.answer_text}
                      {a.is_correct ? " ✔" : ""}
                      {q.selected === a.id && !a.is_correct ? " ❌" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="text-center mt-4 d-flex gap-3 justify-content-center">
              <MDBBtn onClick={handleExportPDF}>📄 Exporter en PDF</MDBBtn>
              <MDBBtn
                color="secondary"
                onClick={() => navigate(`/quizzes/${quizId}/start`)}
              >
                🔄 Rejouer le Quiz
              </MDBBtn>
            </div>

            <h4 className="mt-5">🏆 Classement</h4>
            {ranking.length === 0 ? (
              <p className="text-muted text-center">
                Aucun score enregistré pour ce quiz.
              </p>
            ) : (
              <MDBTable striped>
                <MDBTableHead>
                  <tr>
                    <th>#</th>
                    <th>Utilisateur</th>
                    <th>Score</th>
                    <th>Durée (sec)</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {ranking.map((r, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{r.username}</td>
                      <td>{r.score} %</td>
                        <td>{r.duration_seconds} sec</td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer />
    </div>
  );
}
