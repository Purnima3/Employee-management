import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home_Page from './components/LandingPage/Home_Page';
import SignUp from './components/signup/SignUp';
import Login from './components/login/Login';
import Admin from './components/admin/Admin';
import Employee from './components/employee/Employee';
import ProtectedRoute from './routing/ProtectedRoute';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home_Page />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute requiredRole="employee">
                <Employee />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
