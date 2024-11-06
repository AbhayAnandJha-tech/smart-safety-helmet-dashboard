import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function MineSection({ position }: { position: THREE.Vector3 }) {
  const { scene } = useGLTF("/models/stylized_cave.glb");
  const clone = scene.clone();

  return <primitive object={clone} position={position} />;
}

function InfiniteTunnel() {
  const tunnelRef = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (tunnelRef.current) {
      // Move tunnel sections based on camera position
      const sections = tunnelRef.current.children;
      sections.forEach((section, i) => {
        if (section.position.z > camera.position.z + 100) {
          section.position.z -= 300;
        }
      });
    }
  });

  return (
    <group ref={tunnelRef}>
      {[0, -100, -200].map((z, i) => (
        <MineSection key={i} position={new THREE.Vector3(0, 0, z)} />
      ))}
    </group>
  );
}

const InfiniteMine: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <InfiniteTunnel />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default InfiniteMine;
