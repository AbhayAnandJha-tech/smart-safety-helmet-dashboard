import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navigation.css";

export const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <Link to="/" className="nav-logo">
        Safety Dashboard
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-item">
          Dashboard
        </Link>
        <Link to="/workers" className="nav-item">
          Workers
        </Link>
        <Link to="/devices" className="nav-item">
          Devices
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
