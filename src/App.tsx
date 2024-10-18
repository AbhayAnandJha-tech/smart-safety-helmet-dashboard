import React, { useState } from "react";
import { HardHat, Pickaxe, Truck, ChevronRight, Menu } from "lucide-react";
import MiningDashboard from "./components/Dashboard.tsx";
import "./App.css";

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <div className="app">
      <header className="main-nav">
        <div className="nav-content">
          <div className="logo">
            <HardHat size={32} />
            <span>DeepRock Mining</span>
          </div>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} />
          </button>
          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <a
              href="#home"
              onClick={() => handleNavClick("home")}
              className={activeSection === "home" ? "active" : ""}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => handleNavClick("about")}
              className={activeSection === "about" ? "active" : ""}
            >
              About
            </a>
            <a
              href="#services"
              onClick={() => handleNavClick("services")}
              className={activeSection === "services" ? "active" : ""}
            >
              Services
            </a>
            <a
              href="#dashboard"
              onClick={() => handleNavClick("dashboard")}
              className={activeSection === "dashboard" ? "active" : ""}
            >
              Dashboard
            </a>
            <a
              href="#contact"
              onClick={() => handleNavClick("contact")}
              className={activeSection === "contact" ? "active" : ""}
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section id="home" className="hero">
          <div className="hero-content">
            <h1>Unearthing Potential, Powering Progress</h1>
            <p>Innovative mining solutions for a sustainable future</p>
            <a
              href="#services"
              className="cta-button"
              onClick={() => handleNavClick("services")}
            >
              Explore Our Services <ChevronRight size={20} />
            </a>
          </div>
        </section>

        <section id="about" className="about">
          <h2>About DeepRock Mining</h2>
          <p>
            DeepRock Mining is a leading innovator in the mining industry,
            committed to sustainable practices and cutting-edge technology. Our
            expertise spans across various mining operations, ensuring efficient
            and responsible resource extraction.
          </p>
        </section>

        <section id="services" className="features">
          <div className="feature">
            <Pickaxe size={48} />
            <h2>Advanced Extraction</h2>
            <p>
              Utilizing cutting-edge technology for efficient and safe mineral
              extraction.
            </p>
          </div>
          <div className="feature">
            <Truck size={48} />
            <h2>Sustainable Operations</h2>
            <p>
              Committed to environmentally responsible mining practices and
              community development.
            </p>
          </div>
          <div className="feature">
            <HardHat size={48} />
            <h2>Safety First</h2>
            <p>
              Prioritizing the well-being of our team with industry-leading
              safety protocols.
            </p>
          </div>
        </section>

        <section id="dashboard" className="dashboard-section">
          <h2>Real-Time Mining Insights</h2>
          <MiningDashboard />
        </section>

        <section id="contact" className="contact">
          <h2>Contact Us</h2>
          <p>
            Get in touch with our team for inquiries, partnerships, or more
            information about our services.
          </p>
          <a href="mailto:info@deeprockmining.com" className="contact-button">
            Email Us
          </a>
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <HardHat size={20} />
            <span>DeepRock Mining</span>
          </div>
          <nav className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#careers">Careers</a>
          </nav>
          <div className="footer-bottom">
            <p>&copy; 2024 DeepRock Mining. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
