import Navbar from './Navbar';
import Footer from './Footer';
import DashboardHome from './DashboardHome';

export default function Dashboard({ username, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username} onLogout={onLogout} />
      <main className="flex-grow">
        <DashboardHome username={username} />
      </main>
      <Footer />
    </div>
  );
}
