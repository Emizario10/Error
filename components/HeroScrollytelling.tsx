"use client";

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlitchButton from './GlitchButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function TacticalParts() {
  const p1 = useRef<THREE.Mesh>(null);
  const p2 = useRef<THREE.Mesh>(null);
  const p3 = useRef<THREE.Mesh>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-wrap",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      }
    });

    // Animate parts assembling in center
    tl.to(p1.current?.position || {}, { x: 0, y: 0.2, z: 0 }, 0)
      .to(p2.current?.position || {}, { x: -1.3, y: 0, z: 0 }, 0)
      .to(p3.current?.position || {}, { x: 1.3, y: 0, z: 0 }, 0);
  }, []);

  return (
    <group>
      <mesh ref={p1} position={[0, 6, -5]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <MeshDistortMaterial color="#CCFF00" speed={4} distort={0.2} metalness={1} roughness={0} />
      </mesh>
      <mesh ref={p2} position={[-10, -4, 0]} rotation={[0.5, 0, 0.5]}>
        <boxGeometry args={[2, 0.3, 0.3]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0} />
      </mesh>
      <mesh ref={p3} position={[10, -4, 0]} rotation={[0.5, 0, -0.5]}>
        <boxGeometry args={[2, 0.3, 0.3]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}

export default function HeroScrollytelling() {
  return (
    <section id="hero-wrap" className="relative w-full h-[200vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* FULLSCREEN CANVAS: Absolute background layer */}
        <div className="absolute inset-0 z-0">
          <Canvas gl={{ antialias: true, alpha: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />
            <ambientLight intensity={0.1} />
            <pointLight position={[5, 5, 5]} color="#CCFF00" intensity={1.5} />
            <pointLight position={[-5, -5, -5]} color="#FF003C" intensity={0.5} />
            
            <Float speed={5} rotationIntensity={0.8} floatIntensity={0.8}>
              <TacticalParts />
            </Float>
          </Canvas>
        </div>

        {/* BRUTALIST OVERLAY: Central HTML layer */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[#CCFF00] font-mono text-[10px] mb-8 tracking-[1.5em] opacity-60 uppercase">
            [ Deployment.Established ]
          </span>
          
          <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
            HEAVY<br />HARDWARE
          </h1>
          
          <p className="max-w-md text-[11px] text-white/40 font-mono mb-12 uppercase tracking-widest leading-relaxed">
            Engineered for high-intensity industrial survival. <br />
            Modular optics and tactical deployment systems.
          </p>

          <div className="pointer-events-auto">
            <GlitchButton text="INITIATE_DEPLOYMENT" />
          </div>
        </div>

        {/* Depth Fog / Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.9)_100%)]" />
      </div>
    </section>
  );
}
