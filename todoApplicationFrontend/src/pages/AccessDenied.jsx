import { useNavigate } from "react-router-dom";
import "../styles/ErrorPage.css";

function AccessDenied() {

  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>403</h1>
      <h2>Access Denied</h2>
      <p>You need to login to access this page.</p>
      <button onClick={() => navigate("/auth")}>Back to Login</button>
    </div>
  );
}

export default AccessDenied;