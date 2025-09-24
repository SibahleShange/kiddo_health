import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from './components/paitientsPages/topHeader/Header';
import Profile from './components/paitientsPages/topHeader/Profile';
import PatientDashboard from './components/paitientsPages/PatientDashboard';
import DoctorDashboard from './components/doctorPages/DoctorDashboard';
import HealthTips from './components/paitientsPages/topHeader/HealthTips';
import Login from './components/signup_login/Login';  
import SignUp from './components/signup_login/SignUp';
import ForgotPassword from './components/signup_login/ForgotPassword';    

function App() {
  
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  
  const handleLogin = (userData) => {
    localStorage.setItem('loggedInUser', JSON.stringify(userData)); 
    setLoggedInUser(userData);
  };

  
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
   
  };


  const ProtectedRoute = ({ children }) => {
    if (!loggedInUser) {
      
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Router> 
      <div className="App">
        <Routes>
          <Route path="/" element={<Login userType="patient" onLogin={handleLogin} />} />
          <Route path="/login/patient" element={<Login userType="patient" onLogin={handleLogin} />} />
          <Route path="/login/doctor" element={<Login userType="doctor" onLogin={handleLogin} />} />
          <Route path="/signup/patient" element={<SignUp userType="patient" />} />
          <Route path="/signup/doctor" element={<SignUp userType="doctor" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

         
          <Route 
            path="/dashboard/patient" 
            element={
              <ProtectedRoute>
                <>
                  
                  <Header onLogout={handleLogout}>
                    <Profile />
                    <HealthTips />
                  </Header>
                  <PatientDashboard user={loggedInUser} /> 
                </>
              </ProtectedRoute>
            } 
          />

          {/* --- Doctor Dashboard Route --- */}
          <Route 
            path="/dashboard/doctor" 
            element={
              <ProtectedRoute>
                <>
                  {/* DoctorHeader or similar component here */}
                  <DoctorDashboard user={loggedInUser} onLogout={handleLogout} />
                </>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;