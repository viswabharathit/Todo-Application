import Sidebar from "../components/Sidebar";
import "../styles/DashboardLayout.css";

function DashboardLayout({ children }) {

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">
        {children}
      </div>

    </div>
  );

}

export default DashboardLayout;