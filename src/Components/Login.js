import React, { useState } from "react";
import { auth } from "../Config/Config";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword as signIn } from "firebase/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      await signIn(auth, email, password); // Modüler API kullanarak giriş
      setEmail("");
      setPassword("");
      setError("");
      navigate("/"); // Giriş başarılıysa ana sayfaya yönlendir
    } catch (err) {
      setError(err.message); // Hata varsa ekrana yazdır
    }
  };

  return (
    <div className="container">
      <br />
      <h2>Login</h2>
      <br />
      <form autoComplete="off" className="form-group" onSubmit={login}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="form-control"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="form-control"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <button type="submit" className="btn btn-success btn-md mybtn">
          LOGIN
        </button>
      </form>
      {error && <span className="error-msg">{error}</span>}
      <br />
      <span>
        Don't have an account? Register
        <Link to="/signup"> Here</Link>
      </span>
    </div>
  );
};
