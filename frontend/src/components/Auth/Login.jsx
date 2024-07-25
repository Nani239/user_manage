import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Slices/AuthSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Update this import based on your firebase configuration

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login
      console.log(response, "response");
      console.log(response.user, "UserImpl");
      console.log(response._tokenResponse, "UserImpl");
      setError("Success! You are now logged in.");
      localStorage.setItem("IS_LOGIN", true);
      localStorage.setItem("USER_DATA", JSON.stringify(response.user));
      localStorage.setItem(
        "TOKEN_DATA",
        JSON.stringify(response._tokenResponse)
      );

      dispatch(login());

      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in: ", error.message);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
