import "../styles/AuthPage.css";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AuthPage() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [country,setCountry] = useState("");
    const [gender,setGender] = useState("");
    const [error,setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loginEmail,setLoginEmail] = useState("");
    const [loginPassword,setLoginPassword] = useState("");

    const handleRegister = async(e) => {

        e.preventDefault();
        setError("");

        const nameRegex = /^[A-Za-z\s]{3,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if(!name.trim()){
            setError("Name is required");
            return;
        }

        if(!nameRegex.test(name)){
            setError("Name should contain only letters and minimum 3 characters");
            return;
        }

        if(!email.trim()){
            setError("Email is required");
            return;
        }

        if(!emailRegex.test(email)){
            setError("Invalid email format");
            return;
        }


        if(!country){
            setError("Please select a country");
            return;
        }

        if(!gender){
            setError("Please select gender");
            return;
        }

        if(!password.trim()){
            setError("Password is required");
            return;
        }

        if(!passwordRegex.test(password)){
            setError("Password must contain 8 characters, one uppercase, one lowercase, one number and one special character");
            return;
        }

        if(!confirmPassword.trim()){
            setError("Confirm password is required");
            return;
        }

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        const user = {
            userName:name,
            email:email,
            password:password,
            confirmPassword:confirmPassword,
            country:country,
            gender:gender
        };

        try{

            const res = await API.post("/users/register",user);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("email", email);
            navigate("/dashboard");

        }
        catch(err){

            console.log("Backend error:", err);

            if(err.response && err.response.data){
                setError(err.response.data.message);
            }else{
                setError("Server connection error");
            }

        }

    };

    const handleLogin = async(e) => {
    e.preventDefault();
    setError("");

    
    if(!loginEmail.trim()){
        setError("Email is required");
        return;
    }

    if(!loginPassword.trim()){
        setError("Password is required");
        return;
    }

        try{
            const res = await API.post("/users/login", {
                email: loginEmail,
                password: loginPassword
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("email", loginEmail);
            navigate("/dashboard");

        }catch(err){
            if(err.response && err.response.data){
                setError(err.response.data.message); 
            }else{
                setError("Server error");
            }
        }
    };

    return (
    <div className="auth-container">

     <div className="auth-left">

        <img src={logo} alt="logo" className="auth-logo"/>

        <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>

        {!isLogin && (

            <form className="register-form" onSubmit={handleRegister}>

                <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e)=>{
                    const value = e.target.value;
                    if(/^[A-Za-z\s]*$/.test(value)){
                        setName(value);
                    }
                }}
                required
                />

                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />

                <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                required
                />

                <select
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
                required
                >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="Italy">Italy</option>
                </select>

                <select
                value={gender}
                onChange={(e)=>setGender(e.target.value)}
                required
                >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                </select>

                <button type="submit">
                    Register
                </button>

                {error && <p className="error">{error}</p>}

            </form>

        )}

        {isLogin && (

            <form className="login-form" onSubmit={handleLogin}>

                <input
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if(e.target.value) setError(""); 
                }}
                className={!loginEmail && error ? "input-error" : ""}
                />

                <input
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if(e.target.value) setError(""); 
                }}
                className={!loginPassword && error ? "input-error" : ""}
                />
                
                <button className="auth-button">
                Login
                </button>
                {error && <p className="error">{error}</p>} 

            </form>

        )}

        <div className="toggle-text">

        {isLogin ? (
        <p>
        New user?
        <span onClick={() => setIsLogin(false)}> Register</span>
        </p>
        ) : (
        <p>
        Already registered?
        <span onClick={() => setIsLogin(true)}> Login</span>
        </p>
        )}

        </div>

     </div>

     <div className="auth-right">

        <div className="quote-box">
        <h1>"It always seems impossible until it's done"</h1>
        </div>

        <div className="task-card">
        Finish Q3 budget
        </div>

        <div className="task-card">
        Schedule team sync
        </div>

        <div className="task-card">
        Create the UI design
        </div>

     </div>

    </div>
  );
}

export default AuthPage;