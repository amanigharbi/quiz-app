import { motion } from "framer-motion";
import image from "../../../assets/quiz-illustration.svg";
import { Gamepad2, PlusCircle, BarChart2 } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 text-center "
      style={{ height: "79.8vh" }}
    >
      <img src={image} alt="Logo" className="w-60 mx-auto mb-2" />
      <h1 className="text-3xl font-bold mb-2">
        Bienvenue, {user?.username || "Utilisateur"} !
      </h1>
      <p className="mb-3">Choisissez une action pour commencer :</p>

      <div className="flex justify-center gap-x-6 gap-y-4 flex-wrap mt-4">
        <button className="btn btn-primary flex items-center gap-2">
          <Gamepad2 size={18} /> Rejoindre Quiz
        </button>{" "}
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => navigate("/create-quiz")}
        >
          <PlusCircle size={18} /> Créer Quiz
        </button>{" "}
        <button className="btn btn-primary flex items-center gap-2">
          <BarChart2 size={18} /> Voir Scores
        </button>
      </div>
    </motion.div>
  );
}
