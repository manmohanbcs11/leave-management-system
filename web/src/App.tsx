import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { AppliedLeave } from './components/AppliedLeave';
import { Home } from './components/Home';
import { LeaveBalance } from './components/LeaveBalance';
import { LeaveCalendar } from './components/LeaveCalendar';
import { LeavePolicy } from './components/LeavePolicy';
import { LeaveRequest } from './components/LeaveRequest';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { NavBar } from './components/NavBar';
import { Profile } from './components/Profile';
import { Signup } from './components/Signup';
import { LeaveDetail } from './components/LeaveDetail';

function App() {
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: '', message: '' });

  const showAlert = (type: string, message: string) => {
    setAlert({
      message: message,
      type: type
    });

    setTimeout(() => {
      setAlert({
        message: '',
        type: ''
      });
    }, 2000);
  };

  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(169 196 223)';
  }, []);

  return (
    <>
      <Router>
        <NavBar />
        <div className='container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leavebalance" element={<LeaveBalance />} />
            <Route path="/appliedleave" element={<AppliedLeave />} />
            <Route path="/leave/:id" element={<LeaveDetail />} /> 
            <Route path="/requestleave" element={<LeaveRequest />} />
            <Route path="/leavepolicies" element={<LeavePolicy />} />
            <Route path="/leavecalendar" element={<LeaveCalendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/signup" element={<Signup showAlert={showAlert} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
