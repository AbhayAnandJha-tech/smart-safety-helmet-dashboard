import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import {
  HardHat,
  Menu,
  Bell,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Home,
  Users,
  Cpu,
  Shield,
} from "lucide-react";
import Dashboard from "./components/Dashboard.tsx";
import WorkerProfiles from "./components/WorkerProfiles.tsx";
import EquipmentAnalytics from "./components/EquipmentAnalytics.tsx";
import AdminControls from "./components/AdminControls.tsx";
import "./App.css";

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: "/", name: "Dashboard", icon: <Home size={20} /> },
    { path: "/workers", name: "Workers", icon: <Users size={20} /> },
    { path: "/equipment", name: "Equipment", icon: <Cpu size={20} /> },
    { path: "/admin", name: "Admin", icon: <Shield size={20} /> },
  ];

  return (
    <Router>
      <div className="app">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <HardHat size={32} />
            <span>DeepRock</span>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="main-container">
          <header className="main-header">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="user-actions">
              <button className="icon-button">
                <Bell size={24} />
              </button>
              <button className="icon-button">
                <MessageCircle size={24} />
              </button>
              <div className="user-menu">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                  className="user-avatar"
                />
                <div className="user-dropdown">
                  <NavLink to="/profile">
                    <User size={16} /> Profile
                  </NavLink>
                  <NavLink to="/settings">
                    <Settings size={16} /> Settings
                  </NavLink>
                  <NavLink to="/logout">
                    <LogOut size={16} /> Logout
                  </NavLink>
                </div>
              </div>
            </div>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workers" element={<WorkerProfiles />} />
              <Route path="/equipment" element={<EquipmentAnalytics />} />
              <Route path="/admin" element={<AdminControls />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
