"use client";

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshDistortMaterial, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlitchButton from './GlitchButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // TACTICAL_DEPRECATION_BYPASS
  // SILENCE THREE.Clock warnings from internal libraries
  const THREE_ANY = THREE as any;
  if (!THREE_ANY.Clock || THREE_ANY.Clock.isDeprecated) {
    try {
      Object.defineProperty(THREE_ANY, 'Clock', {
        get: () => THREE_ANY.Timer || function(this: any) {
          return Object.assign(this, {
            start: () => {},
            stop: () => {},
            getDelta: () => 0,
            getElapsedTime: () => 0
          });
        },
        configurable: true
      });
    } catch (e) {}
  }
}

function TacticalCore() {
  const p1 = useRef<THREE.Mesh>(null);
  const p2 = useRef<THREE.Mesh>(null);
  const p3 = useRef<THREE.Mesh>(null);

  useGSAP(() => {
    // Animación sincronizada con el scroll del padre
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-main-container", // El contenedor que se queda fijo
        start: "top top",
        end: "+=200%", // Duración de la animación en scroll
        scrub: 1,
      }
    });

    // Ensamblaje de piezas
    tl.fromTo(p1.current!.position, { y: 8, z: -5 }, { y: 0.2, z: 0 }, 0);
    tl.fromTo(p2.current!.position, { x: -12, y: -4 }, { x: -1.3, y: 0 }, 0);
    tl.fromTo(p3.current!.position, { x: 12, y: -4 }, { x: 1.3, y: 0 }, 0);
    
    // Rotación final del conjunto
    tl.to([p1.current!.rotation, p2.current!.rotation, p3.current!.rotation], {
      y: Math.PI * 2,
      ease: "none"
    }, 0.5);

  }, []);

  return (
    <group>
      <mesh ref={p1}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <MeshDistortMaterial color="#CCFF00" speed={2} distort={0.2} metalness={1} roughness={0.1} />
      </mesh>
      <mesh ref={p2}>
        <boxGeometry args={[2, 0.3, 0.3]} />
        <meshStandardMaterial color="#1A1A1A" metalness={1} roughness={0.2} />
      </mesh>
      <mesh ref={p3}>
        <boxGeometry args={[2, 0.3, 0.3]} />
        <meshStandardMaterial color="#1A1A1A" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function HeroScrollytelling() {
  const mainRef = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(() => {
    // ESTA ES LA CLAVE: Pinning del contenedor
    ScrollTrigger.create({
      trigger: "#hero-main-container",
      start: "top top",
      end: "+=200%", // Debe coincidir con el final de la animación
      pin: true,     // Bloquea el elemento en pantalla
      pinSpacing: true, // Deja el espacio para que el resto del contenido no se solape
    });

    // Animación de salida del texto (opcional, para que no estorbe al bajar)
    gsap.to(overlayRef.current, {
      scrollTrigger: {
        trigger: "#hero-main-container",
        start: "70% center",
        end: "bottom top",
        scrub: true,
      },
      opacity: 0,
      y: -50,
    });
  }, []);

  return (
    <section id="hero-main-container" className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      
      {/* 3D CANVAS */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} color="#CCFF00" intensity={150} />
          <Environment preset="city" />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <TacticalCore />
          </Float>
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Canvas>
      </div>

      {/* TEXT INTERFACE */}
      <div ref={overlayRef} className="relative z-10 flex flex-col items-center text-center pointer-events-none px-4">
        <span className="text-[#CCFF00] font-mono text-[10px] tracking-[1.5em] opacity-40 uppercase mb-8 block animate-pulse">
          [ KROM.SYS // Deployment.Active ]
        </span>
        <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
          HEAVY<br />HARDWARE
        </h1>
        <div className="pointer-events-auto">
          <GlitchButton text="INITIATE_DEPLOYMENT" />
        </div>
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,#000_100%)]" />
    </section>
  );
}