import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx"; // Ensure correct path for Dashboard component
import "./App.css"; // Ensure correct styles are applied

function App() {
  return (
    <Router>
      <div className="App">
        {/* Parallax Header */}
        <header className="parallax">
          <h1>Explore the Depths of Mining</h1>
          <p>Discover, manage, and thrive in the world of mining operations.</p>
        </header>

        {/* Main Content */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
