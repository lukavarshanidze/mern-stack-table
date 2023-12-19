import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const url = "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const response = await axios.post(`${url}/api/login`, {
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        const remainingMilliseconds = 3600000; //60 * 60 * 1000; // 3,600,000
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
      }
      navigate("/");
    } catch (error) {
      console.log("err", error);
    }
  };

  const removeExpiredToken = () => {
    const expiryDate = localStorage.getItem("expiryDate");

    if (expiryDate && new Date(expiryDate) <= new Date()) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
        localStorage.removeItem("userId");
        const response = 0;
      } catch (error) {}
    }
  };

  removeExpiredToken();

  return (
    <>
      <form onSubmit={submitHandler}>
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
        <button type="submit">Login</button>
      </form>
      <Link to="/signup">don't have an account?</Link>
    </>
  );
};

export default Login;
