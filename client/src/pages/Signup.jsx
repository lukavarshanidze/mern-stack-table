import React, { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const url = "http://localhost:8000";

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const response = await axios.post(`${url}/api/signup`, { email, password });
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        {error ? <h4>{error}</h4> : ""}
        <div>
          <label htmlFor="email">Email</label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            placeholder="E-Mail"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            ref={passwordRef}
            type="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      <Link to="/login">already have an account?</Link>
    </>
  );
};

export default Signup;
