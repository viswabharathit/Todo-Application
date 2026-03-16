import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Loader.css";
import logo from "../assets/logo.png";

function Loader() {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard"); 
      } else {
        navigate("/auth");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <div className="loader-container">

      <img src={logo} alt="logo" className="loader-logo" />

      <h2>Loading...</h2>

      <div className="spinner"></div>

    </div>
  );
}

export default Loader;