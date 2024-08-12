import React, { useState } from "react";
import { auth, db } from "../Config/Config";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


export const Signup = () => {
  // Defining state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // useNavigate hook'u kullanarak yönlendirme işlemi yapıyoruz

  // Signup function
  const signup = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "SignedUpUsersData", cred.user.uid), {
        Name: name,
        Email: email,
        Password: password,
      });
      setName("");
      setEmail("");
      setPassword("");
      setError("");
      navigate("/login"); // Yönlendirme işlemi için navigate kullanıyoruz
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <br />
      <h2>Sign up</h2>
      <br />
      <form autoComplete="off" className="form-group" onSubmit={signup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <br />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <button type="submit" className="btn btn-success btn-md mybtn">
          SUBMIT
        </button>
      </form>
      {error && <span className="error-msg">{error}</span>}
      <br />
      <span>
        Already have an account? Login
        <Link to="/login"> Here</Link>
      </span>
    </div>
  );
};
