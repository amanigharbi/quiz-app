import { LogOut } from "lucide-react";

export default function Navbar({ username, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">Quiz App</div>
      <div className="flex items-center gap-6">
        <span className="hidden sm:inline">👤 {username}</span>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </nav>
  );
}
