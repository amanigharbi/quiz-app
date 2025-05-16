import { motion } from 'framer-motion';

export default function DashboardHome({ username }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 text-center"
    >
      <h1 className="text-3xl font-bold mb-4">Bienvenue, {username} !</h1>
      <p className="mb-6">Choisissez une action pour commencer :</p>

      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow">
          🎮 Rejoindre Quiz
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow">
          ➕ Créer Quiz
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl shadow">
          📊 Voir Scores
        </button>
      </div>
    </motion.div>
  );
}
