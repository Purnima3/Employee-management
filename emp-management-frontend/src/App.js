import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Review_Page from './components/Review_Page';
import Home_Page from './components/LandingPage/Home_Page';
import SignUp from './components/signup/SignUp';
import Login from './components/login/Login';

function App() {
  return (
    <div>
       <Router>
      <Routes>
        <Route path="/" element={< Home_Page/>} />
        <Route path="/review" element={<Review_Page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
      </Routes>
    </Router>
    </div>
  )
}

export default App

