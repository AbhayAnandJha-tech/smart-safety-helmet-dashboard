import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface NavButton {
  id: string;
  label: string;
  path: string;
}

function Miner({ position }: { position: Position }) {
  const { scene } = useGLTF("/models/miner.glb");
  return (
    <primitive object={scene} position={[position.x, position.y, position.z]} />
  );
}

const LandingPage: React.FC = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const navButtons: NavButton[] = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "monitoring", label: "Monitoring", path: "/monitoring" },
    { id: "alerts", label: "Alerts", path: "/alerts" },
  ];

  return (
    <div className="landing-page">
      <div className="hero-section">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Miner position={{ x: 0, y: 0, z: 0 }} />
        </Canvas>
        <div className="hero-content">
          <h1>Smart Safety Helmet Dashboard</h1>
          <p>Advanced monitoring and safety management system</p>
        </div>
      </div>

      <nav className="navigation">
        {navButtons.map((button) => (
          <Link
            key={button.id}
            to={button.path}
            className="nav-button"
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {button.label}
            {hoveredButton === button.id && (
              <motion.div
                className="hover-indicator"
                layoutId="indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default LandingPage;
