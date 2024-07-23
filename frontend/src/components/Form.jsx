import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, CURRENT_USER } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const name = method === "login" ? "Login" : "Register";

  const showSuccessPopup = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem(CURRENT_USER, username);
        navigate("/dashboard");
      } else {
        showSuccessPopup();
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Incorrect username or password");
      } else if (error.response && error.response.status == 400) {
          setError(`Sorry, the username '${username}' is already taken.`);
      } else {
        setError("An error occurred. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>{name}</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          required
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete={method === "login" ? "current-password" : "new-password"}
          required
        />
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? "Processing..." : name}
        </button>
      </form>
      <p className="form-link">
        {method === "login" ? (
          <>
            Don't have an account? <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            Already have an account? <Link to="/login">Login</Link>
          </>
        )}
      </p>
      {showPopup && <Popup message="Registration successful! Redirecting to login..." />}
    </div>
  );
}

function Popup({ message }) {
    return (
      <div className="popup">
        <p>{message}</p>
      </div>
    );
  }

export default Form;
