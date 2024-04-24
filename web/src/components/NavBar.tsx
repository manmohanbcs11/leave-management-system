import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaBalanceScale, FaCalendarAlt, FaFileAlt, FaClipboardCheck, FaBell, FaUserCircle, FaBook } from 'react-icons/fa';
import '../css/custom.css';

export const NavBar: React.FC<{}> = () => {
  const navStyle = {
    border: '1px solid grey',
    backgroundColor: '#094a8d',
    borderRadius: '20px',
    padding: '7px 15px',
    margin: '5px',
    color: 'white',
  };

  const activeStyle = {
    backgroundColor: '#f0f0f0',
    color: '#094a8d',
  };

  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom-class">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                style={location.pathname === '/' ? { ...navStyle, ...activeStyle } : navStyle}
                to="/"
              >
                <FaHome /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${location.pathname === '/leavebalance' ? 'active' : ''}`}
                style={location.pathname === '/leavebalance' ? { ...navStyle, ...activeStyle } : navStyle}
                to="/leavebalance"
              >
                <FaBalanceScale /> Leave Balance
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${location.pathname === '/appliedleave' ? 'active' : ''}`}
                style={location.pathname === '/appliedleave' ? { ...navStyle, ...activeStyle } : navStyle}
                to="/appliedleave"
              >
                <FaClipboardCheck /> Applied Leave
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${location.pathname === '/requestleave' ? 'active' : ''}`}
                style={location.pathname === '/requestleave' ? { ...navStyle, ...activeStyle } : navStyle}
                to="/requestleave"
              >
                <FaFileAlt /> Apply for Leave
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${location.pathname === '/leavepolicies' ? 'active' : ''}`}
                style={location.pathname === '/leavepolicies' ? { ...navStyle, ...activeStyle } : navStyle}
                to="/leavepolicies"
              >
                <FaBook /> Leave Policies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${location.pathname === '/leavecalendar' ? 'active' : ''}`}
                style={location.pathname === '/leavecalendar' ? { ...navStyle, ...activeStyle } : navStyle}
                to="/leavecalendar"
              >
                <FaCalendarAlt /> Calendar
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" to="#" id="userDropdown" role="button"
                data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white' }}>Account</NavLink>

              <ul className="dropdown-menu" aria-labelledby="userDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/profile">Profile</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/logout">Logout</NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
