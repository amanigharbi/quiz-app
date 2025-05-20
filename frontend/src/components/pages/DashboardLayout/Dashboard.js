import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardHome from "./DashboardHome";

export default function Dashboard({ username, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col p-2 "  
        style={{ backgroundColor: "#eeeeee" }}
>
      <Navbar username={username} onLogout={onLogout} />
      <main className="flex-grow flex items-center justify-center">
        <DashboardHome username={username} />
      </main>
      <Footer />
    </div>
  );
}
