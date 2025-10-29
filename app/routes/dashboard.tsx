import { Navigation } from "../components/Navigation";
import { Dashboard } from "../components/Dashboard";
// import { useApp } from "../state/useApp.js"; // custom context hook

export default function DashboardPage() {
  // const { userName, onViewReceipt, onLogout } = useApp();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userName="Mei" />
      <Dashboard userName="Mei" />
      <div>11111</div>
    </div>
  );
}
