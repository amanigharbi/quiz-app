import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Dashboard from "./components/pages/DashboardLayout/Dashboard";
import PrivateRoute from "./components/routes/PrivateRoute";
import AddQuestions from "./components/pages/Quizzes/AddQuestions";
import CreateQuizStepper from "./components/pages/Quizzes/CreateQuizStepper";
import QuizSummary from "./components/pages/Quizzes/QuizSummary";
import QuizStepView from "./components/pages/Quizzes/QuizStepView";
import EditQuestion from "./components/pages/Quizzes/EditQuestion";
import MesQuizzes from "./components/pages/Quizzes/MesQuizzes";
import StartQuizWithTimer from "./components/pages/Quizzes/StartQuizWithTimer";
import ResultQuiz from "./components/pages/Quizzes/ResultQuiz";
import HistoriqueQuiz from "./components/pages/Quizzes/HistoriqueQuiz";
import "./App.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-quiz"
            element={
              <PrivateRoute>
                <CreateQuizStepper />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizzes/:id/view"
            element={
              <PrivateRoute>
                <QuizStepView />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizzes/:id/add-questions"
            element={
              <PrivateRoute>
                <AddQuestions />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizzes/:id/summary"
            element={
              <PrivateRoute>
                <QuizSummary />
              </PrivateRoute>
            }
          />
          <Route path="/mes-quizzes" element={<MesQuizzes />} />

          <Route
            path="/quizzes/:id/questions/:questionId/edit"
            element={<EditQuestion />}
          />
          <Route path="/quizzes/:id/start" element={<StartQuizWithTimer />} />
          <Route path="/quizzes/:id/result" element={<ResultQuiz />} />
          <Route path="/historique" element={<HistoriqueQuiz />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}
