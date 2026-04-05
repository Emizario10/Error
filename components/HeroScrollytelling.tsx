"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlitchButton from './GlitchButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function TacticalParts() {
  const groupRef = useRef<THREE.Group>(null);
  const part1 = useRef<THREE.Mesh>(null);
  const part2 = useRef<THREE.Mesh>(null);
  const part3 = useRef<THREE.Mesh>(null);

  useGSAP(() => {
    if (!part1.current || !part2.current || !part3.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-trigger",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      }
    });

    // Animate meshes from scattered "Exploded" state to unified center
    tl.to(part1.current.position, { x: 0, y: 0.3, z: 0 }, 0)
      .to(part1.current.rotation, { x: 0, y: 0, z: 0 }, 0)
      
      .to(part2.current.position, { x: -1.2, y: 0, z: 0 }, 0)
      .to(part2.current.rotation, { x: 0, y: 0, z: 0.5 }, 0)
      
      .to(part3.current.position, { x: 1.2, y: 0, z: 0 }, 0)
      .to(part3.current.rotation, { x: 0, y: 0, z: -0.5 }, 0);
  }, []);

  return (
    <group ref={groupRef}>
      {/* PART 1: The Core Visor */}
      <mesh ref={part1} position={[0, 4, -2]} rotation={[Math.PI, 0.5, 0.2]}>
        <boxGeometry args={[2.5, 0.8, 0.1]} />
        <MeshDistortMaterial color="#CCFF00" speed={2} distort={0.2} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* PART 2: Left Tactical Arm */}
      <mesh ref={part2} position={[-5, -2, 2]} rotation={[0.2, -1, 1]}>
        <boxGeometry args={[1.5, 0.2, 0.2]} />
        <meshStandardMaterial color="#333" metalness={1} roughness={0} />
      </mesh>

      {/* PART 3: Right Tactical Arm */}
      <mesh ref={part3} position={[5, -2, 2]} rotation={[0.2, 1, -1]}>
        <boxGeometry args={[1.5, 0.2, 0.2]} />
        <meshStandardMaterial color="#333" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}

export default function HeroScrollytelling() {
  return (
    <section id="hero-trigger" className="relative w-full h-[200vh] bg-[#000000]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} color="#CCFF00" intensity={1.5} />
          <pointLight position={[-10, -10, -10]} color="#FF003C" intensity={0.5} />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <TacticalParts />
          </Float>

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>

        {/* HUD OVERLAY */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-[#CCFF00] font-mono text-[10px] mb-8 tracking-[1em] opacity-50 uppercase">
            System.Link // Established
          </div>
          
          <div className="pointer-events-auto">
            <GlitchButton text="INITIATE_DEPLOYMENT" />
          </div>

          <div className="absolute bottom-12 left-12 font-mono text-[10px] text-[#F3F4F6]/30 leading-loose">
            [ COORDINATES ] : 52.5200° N, 13.4050° E <br />
            [ STATUS ] : HARDWARE_READY <br />
            [ PROTOCOL ] : CYBER_NOIR_v2
          </div>
        </div>

        {/* Vignette Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>
    </section>
  );
}
