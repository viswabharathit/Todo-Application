import { NavLink, useNavigate } from "react-router-dom"; 
import "../styles/Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "User";
  const firstLetter = email.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="sidebar">

      <div className="sidebar-user">
        <div className="user-avatar">{firstLetter}</div>
        <span className="username">{email}</span>
      </div>

      <div className="sidebar-menu">
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/today">Today</NavLink>
        <NavLink to="/upcoming">Upcoming</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/pending">Pending</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>

      <div className="sidebar-bottom">
        <button className="help-btn">Help & Resources</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

    </div>
  );
}

export default Sidebar;