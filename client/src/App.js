import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login'
import Signup from './pages/Signup';
import Table from './pages/Table';
import { useEffect, useState } from 'react';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, [token]);



  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={token ? <Table /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div >
  )
}

export default App;
