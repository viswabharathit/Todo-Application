import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  const email = localStorage.getItem("email") || "User";

  return (
    <DashboardLayout>
      <div>
        <h1>Welcome, {email}</h1>
        <p style={{ color: "#888", marginTop: "8px" }}>
          Use the sidebar to navigate to your Tasks, Projects, and more.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;