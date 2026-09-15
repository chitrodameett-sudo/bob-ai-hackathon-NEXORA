// NEXORA — Live Fleet Health Check Modal
// 6-Phase full-screen diagnostic experience.
// SIMULATION MODE — All data is fictional for demo purposes.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float } from '@react-three/drei';
import {
  X, Activity, CheckCircle2, AlertTriangle, Search, ChevronLeft,
  Sparkles as SparklesIcon, RefreshCw, Shield, Zap, Plane, Anchor,
  Truck, Radar, Filter, ArrowUpDown, ChevronRight, Eye
} from 'lucide-react';
import { useFleetHealth } from '../../context/FleetHealthContext';

// ─────────────────────────────────────────────────────────────────────────────
// PHASE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PHASE_INTRO = 'INTRO';
const PHASE_SCAN_3D = 'SCAN_3D';
const PHASE_FLEET_PROGRESS = 'FLEET_PROGRESS';
const PHASE_SUMMARY = 'SUMMARY';
const PHASE_LIST = 'LIST';
const PHASE_DETAIL = 'DETAIL';

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = [
  { key: 'Aircraft', label: 'AIRCRAFT', icon: Plane, count: 320, duration: 2200 },
  { key: 'Armored Vehicles', label: 'ARMORED VEHICLES', icon: Shield, count: 285, duration: 1900 },
  { key: 'Ground Vehicles', label: 'GROUND VEHICLES', icon: Truck, count: 410, duration: 2600 },
  { key: 'Air Defense', label: 'AIR DEFENSE', icon: Radar, count: 96, duration: 900 },
  { key: 'Naval Systems', label: 'NAVAL SYSTEMS', icon: Anchor, count: 72, duration: 800 },
  { key: 'Support Systems', label: 'SUPPORT SYSTEMS', icon: Zap, count: 65, duration: 750 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3D MODELS (inline, recognizable geometry)
// ─────────────────────────────────────────────────────────────────────────────

function ScanBeamEffect({ active }) {
  const beamRef = useRef();
  useFrame((state) => {
    if (beamRef.current && active) {
      beamRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 2.2;
    }
  });
  if (!active) return null;
  return (
    <mesh ref={beamRef} position={[0, 0, 0.5]}>
      <boxGeometry args={[6, 0.04, 0.04]} />
      <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} transparent opacity={0.85} />
    </mesh>
  );
}

function ScanRing({ radius, speed, color = '#06b6d4' }) {
  const ringRef = useRef();
  useFrame((state) => {
    if (ringRef.current) {
      const t = (state.clock.elapsedTime * speed) % 1;
      ringRef.current.scale.setScalar(1 + t * 2);
      ringRef.current.material.opacity = 1 - t;
    }
  });
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 8, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
    </mesh>
  );
}

function JetScanModel({ problemComponent, scanning }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * (scanning ? 0.5 : 0.2);
  });
  const isCritical = problemComponent?.health < 60;
  return (
    <group ref={groupRef} scale={1.1}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.45, 3.5, 8]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.9} roughness={0.15} emissive="#0a1628" emissiveIntensity={0.3} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 1.95, 0]}>
        <coneGeometry args={[0.28, 0.8, 8]} />
        <meshStandardMaterial color="#0f2744" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Main wings */}
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.8, 0.06, 1.0]} />
        <meshStandardMaterial color="#0d2240" metalness={0.9} roughness={0.2} emissive="#06b6d4" emissiveIntensity={0.1} />
      </mesh>
      {/* Swept wing leading edge */}
      <mesh position={[1.3, -0.3, -0.3]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.04, 0.5]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-1.3, -0.3, -0.3]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[1.2, 0.04, 0.5]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Tail fins */}
      <mesh position={[0.5, -1.2, -0.1]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial color="#0d2240" metalness={0.9} />
      </mesh>
      <mesh position={[-0.5, -1.2, -0.1]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial color="#0d2240" metalness={0.9} />
      </mesh>
      {/* Vertical stabilizer */}
      <mesh position={[0, -0.8, -0.45]}>
        <boxGeometry args={[0.06, 0.9, 0.7]} />
        <meshStandardMaterial color="#0d2240" metalness={0.9} />
      </mesh>
      {/* Engine exhaust */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[0.35, 0.42, 0.6, 16]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={scanning ? 2.5 : 0.8} />
      </mesh>
      {/* Engine glow ring */}
      <mesh position={[0, -2.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.05, 8, 32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={scanning ? 4 : 1} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.8, 0.18]}>
        <sphereGeometry args={[0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={1.2} transparent opacity={0.7} />
      </mesh>
      {/* Problem component highlight */}
      {isCritical && (
        <mesh position={[0, 0.3, 0.15]}>
          <boxGeometry args={[0.5, 0.8, 0.3]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={2} wireframe />
        </mesh>
      )}
      {/* Scan rings around model */}
      {scanning && (
        <>
          <ScanRing radius={1.2} speed={0.5} />
          <ScanRing radius={1.6} speed={0.35} color="#7c3aed" />
          <ScanBeamEffect active={scanning} />
        </>
      )}
    </group>
  );
}

function TankScanModel({ scanning }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * (scanning ? 0.5 : 0.25);
  });
  return (
    <group ref={groupRef} scale={1.0} position={[0, -0.2, 0]}>
      {/* Hull lower */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.4, 0.5, 1.4]} />
        <meshStandardMaterial color="#1a2e1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Hull upper */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.9, 0.4, 1.1]} />
        <meshStandardMaterial color="#1e3a1e" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Turret */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.65, 0.72, 0.45, 12]} />
        <meshStandardMaterial color="#162e16" metalness={0.9} emissive="#06b6d4" emissiveIntensity={scanning ? 0.4 : 0.1} />
      </mesh>
      {/* Main gun */}
      <mesh position={[0.55, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.08, 1.8, 8]} />
        <meshStandardMaterial color="#0f1f0f" metalness={0.95} />
      </mesh>
      {/* Tracks */}
      {[-0.75, 0.75].map((z, i) => (
        <mesh key={i} position={[0, -0.1, z]}>
          <boxGeometry args={[2.6, 0.35, 0.25]} />
          <meshStandardMaterial color="#0a180a" />
        </mesh>
      ))}
      {/* Road wheels */}
      {[-0.9, -0.3, 0.3, 0.9].map((x, i) =>
        [-0.65, 0.65].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, -0.1, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))
      )}
      {scanning && (
        <>
          <ScanRing radius={1.5} speed={0.45} />
          <ScanRing radius={2.0} speed={0.3} color="#7c3aed" />
          <ScanBeamEffect active={scanning} />
        </>
      )}
    </group>
  );
}

function RadarScanModel({ scanning }) {
  const groupRef = useRef();
  const dishRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
    if (dishRef.current) dishRef.current.rotation.y += delta * 2.0;
  });
  return (
    <group ref={groupRef} scale={1.0}>
      {/* Base */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 0.4, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 2.0, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      {/* Radar dish */}
      <group ref={dishRef} position={[0, 0.8, 0]}>
        <mesh rotation={[0.3, 0, 0]}>
          <boxGeometry args={[2.2, 1.5, 0.08]} />
          <meshStandardMaterial color="#06b6d4" wireframe emissive="#06b6d4" emissiveIntensity={1.5} />
        </mesh>
        {/* Cross-frame */}
        <mesh rotation={[0.3, 0, Math.PI / 4]}>
          <boxGeometry args={[2.4, 0.06, 0.06]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
        </mesh>
      </group>
      {scanning && (
        <>
          <ScanRing radius={1.2} speed={0.6} />
          <ScanRing radius={1.8} speed={0.4} color="#7c3aed" />
        </>
      )}
    </group>
  );
}

function ShipScanModel({ scanning }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2;
  });
  return (
    <group ref={groupRef} scale={0.85} position={[0, -0.2, 0]}>
      {/* Hull */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.6, 0.55, 0.9]} />
        <meshStandardMaterial color="#0f2233" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Bow */}
      <mesh position={[1.85, 0.35, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.5, 0.45, 0.9]} />
        <meshStandardMaterial color="#0a1a28" metalness={0.9} />
      </mesh>
      {/* Superstructure */}
      <mesh position={[0.2, 0.75, 0]}>
        <boxGeometry args={[1.2, 0.55, 0.65]} />
        <meshStandardMaterial color="#132a40" metalness={0.8} emissive="#06b6d4" emissiveIntensity={scanning ? 0.3 : 0.1} />
      </mesh>
      {/* Bridge */}
      <mesh position={[0.3, 1.15, 0]}>
        <boxGeometry args={[0.7, 0.35, 0.55]} />
        <meshStandardMaterial color="#0a2030" metalness={0.85} />
      </mesh>
      {/* Mast */}
      <mesh position={[0.3, 1.55, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} />
      </mesh>
      {/* Funnel */}
      <mesh position={[-0.3, 0.85, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.5, 8]} />
        <meshStandardMaterial color="#0d1f2f" metalness={0.9} />
      </mesh>
      {scanning && (
        <>
          <ScanRing radius={1.8} speed={0.4} />
          <ScanRing radius={2.4} speed={0.28} color="#7c3aed" />
          <ScanBeamEffect active={scanning} />
        </>
      )}
    </group>
  );
}

function GenericSupportModel({ scanning }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
  });
  return (
    <group ref={groupRef} scale={1.0}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 1.4, 1.4]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} emissive="#06b6d4" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.8, 8]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} />
      </mesh>
      {scanning && <ScanRing radius={1.1} speed={0.55} />}
    </group>
  );
}

function GroundVehicleScanModel({ scanning }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });
  return (
    <group ref={groupRef} scale={1.0} position={[0, -0.1, 0]}>
      {/* Truck body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.6, 0.8, 1.2]} />
        <meshStandardMaterial color="#1a2e1a" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Cab */}
      <mesh position={[-0.75, 1.05, 0]}>
        <boxGeometry args={[1.0, 0.65, 1.1]} />
        <meshStandardMaterial color="#0d1f0d" metalness={0.8} emissive="#06b6d4" emissiveIntensity={scanning ? 0.3 : 0.1} />
      </mesh>
      {/* Windows */}
      <mesh position={[-0.76, 1.1, 0.35]}>
        <boxGeometry args={[0.6, 0.35, 0.05]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
      {/* Wheels */}
      {[-0.85, 0.55].map((x, i) =>
        [-0.68, 0.68].map((z, j) => (
          <mesh key={`${i}${j}`} position={[x, 0.1, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.2, 12]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        ))
      )}
      {scanning && (
        <>
          <ScanRing radius={1.4} speed={0.45} />
          <ScanBeamEffect active={scanning} />
        </>
      )}
    </group>
  );
}

function ScanCanvas({ category, scanning, problemComponent }) {
  const getModel = () => {
    switch (category) {
      case 'Armored Vehicles': return <TankScanModel scanning={scanning} />;
      case 'Ground Vehicles': return <GroundVehicleScanModel scanning={scanning} />;
      case 'Air Defense': return <RadarScanModel scanning={scanning} />;
      case 'Naval Systems': return <ShipScanModel scanning={scanning} />;
      case 'Support Systems': return <GenericSupportModel scanning={scanning} />;
      default: return <JetScanModel scanning={scanning} problemComponent={problemComponent} />;
    }
  };

  return (
    <Canvas camera={{ position: [0, 1.2, 5.5], fov: 48 }} gl={{ antialias: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 8, 5]} intensity={2.5} color="#06b6d4" />
      <pointLight position={[-5, -5, -5]} intensity={1.2} color="#7c3aed" />
      <pointLight position={[0, -3, 3]} intensity={1.0} color="#3b82f6" />
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        {getModel()}
      </Float>
      <Sparkles count={60} scale={7} size={1.5} speed={0.3} color="#06b6d4" />
      {scanning && <Sparkles count={30} scale={5} size={3} speed={1.2} color="#7c3aed" />}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function healthColor(h) {
  if (h >= 80) return 'text-emerald-400';
  if (h >= 60) return 'text-amber-400';
  return 'text-rose-400';
}
function healthBarColor(h) {
  if (h >= 80) return 'bg-emerald-400';
  if (h >= 60) return 'bg-amber-400';
  return 'bg-rose-500';
}
function statusBadge(status) {
  switch (status) {
    case 'READY': return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30';
    case 'LIMITED': return 'border-amber-500/50 text-amber-400 bg-amber-950/30';
    case 'MAINTENANCE': return 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30';
    case 'CRITICAL': return 'border-rose-500/60 text-rose-300 bg-rose-950/40 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse';
    default: return 'border-slate-700 text-slate-300';
  }
}
function riskBadge(risk) {
  switch (risk) {
    case 'LOW': return 'text-emerald-400';
    case 'MEDIUM': return 'text-amber-400';
    case 'HIGH': return 'text-orange-400';
    case 'CRITICAL': return 'text-rose-400 font-bold';
    default: return 'text-slate-400';
  }
}
function statusDot(status) {
  switch (status) {
    case 'READY': return '🟢';
    case 'LIMITED': return '🟡';
    case 'MAINTENANCE': return '🔵';
    case 'CRITICAL': return '🔴';
    default: return '⚪';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 — INTRO SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function PhaseIntro({ onStart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
      {/* HUD corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-cyan-400/60" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-cyan-400/60" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-cyan-400/60" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-cyan-400/60" />

      {/* Logo */}
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-widest text-white" style={{ letterSpacing: '0.3em' }}>
          NEXORA
        </h1>
        <div className="text-cyan-400 font-bold text-sm tracking-[0.2em] uppercase">
          LIVE FLEET HEALTH DIAGNOSTIC
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/40 px-4 py-2 rounded-lg text-xs font-bold text-emerald-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>LIVE DEMO TELEMETRY</span>
        </div>
        <div className="flex items-center space-x-2 bg-amber-950/40 border border-amber-500/40 px-4 py-2 rounded-lg text-xs font-bold text-amber-400">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
          <span>SIMULATION MODE</span>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-md space-y-2">
        <p className="text-slate-300 text-sm leading-relaxed">
          Initiates a comprehensive 3D fleet-wide health diagnostic across all{' '}
          <span className="text-cyan-400 font-bold">1,248 equipment units</span>.
        </p>
        <p className="text-slate-500 text-xs">
          Scans all 6 categories • 3D component analysis • Real-time telemetry simulation
        </p>
      </div>

      {/* Categories preview */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        {CATEGORY_CONFIG.map(cat => (
          <div key={cat.key} className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-3 py-2 rounded-lg">
            <cat.icon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">{cat.label}</span>
            <span className="text-cyan-400 font-bold ml-auto">{cat.count}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="group relative px-12 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-base tracking-widest transition-all duration-300 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] uppercase"
      >
        <span className="flex items-center space-x-3">
          <Activity className="w-5 h-5" />
          <span>BEGIN FLEET SCAN</span>
        </span>
        <div className="absolute inset-0 rounded-xl border-2 border-cyan-300/40 animate-ping" />
      </button>

      <p className="text-[10px] text-slate-600 uppercase tracking-wider">
        ⚠ Demo data only — No real operational information
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 — 3D SCANNING ANIMATION
// ─────────────────────────────────────────────────────────────────────────────
const COMPONENT_SCAN_SEQUENCE = [
  { id: 'engine', name: 'ENGINE TURBINE', duration: 600 },
  { id: 'cooling', name: 'COOLING SYSTEM', duration: 700 },
  { id: 'electrical', name: 'ELECTRICAL BUS', duration: 500 },
  { id: 'avionics', name: 'AVIONICS SUITE', duration: 600 },
  { id: 'hydraulics', name: 'HYDRAULIC ACTUATORS', duration: 550 },
  { id: 'fuel', name: 'FUEL SYSTEM', duration: 500 },
  { id: 'navigation', name: 'NAVIGATION', duration: 480 },
  { id: 'structure', name: 'STRUCTURAL FRAME', duration: 520 },
];

function Phase3DScan({ onComplete }) {
  const [checkedComponents, setCheckedComponents] = useState([]);
  const [currentComp, setCurrentComp] = useState(0);

  useEffect(() => {
    if (currentComp >= COMPONENT_SCAN_SEQUENCE.length) {
      setTimeout(onComplete, 600);
      return;
    }
    const comp = COMPONENT_SCAN_SEQUENCE[currentComp];
    const timer = setTimeout(() => {
      setCheckedComponents(prev => [...prev, comp.id]);
      setCurrentComp(prev => prev + 1);
    }, comp.duration);
    return () => clearTimeout(timer);
  }, [currentComp, onComplete]);

  const progress = Math.round((checkedComponents.length / COMPONENT_SCAN_SEQUENCE.length) * 100);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
      {/* Left: 3D Model */}
      <div className="relative flex flex-col">
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-md text-xs text-cyan-400 font-mono font-bold">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span>3D SCANNING AIRCRAFT · DEMO MODEL</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-slate-950/90 border border-purple-500/40 px-3 py-1.5 rounded-md text-xs text-purple-400 font-mono">
            SIMULATION MODE
          </div>
        </div>

        {/* Holographic grid overlay */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, rgba(3,7,18,0.95) 70%)',
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <ScanCanvas category="Aircraft" scanning={true} />

          {/* Telemetry data overlays */}
          <div className="absolute bottom-3 left-3 space-y-1 font-mono text-[9px] text-cyan-400/70">
            <div>SYS_FREQ: 2.4GHz</div>
            <div>TELEMETRY: {(Math.random() * 0.5 + 99).toFixed(2)}%</div>
            <div>SCAN_BEAM: ACTIVE</div>
            <div>PARTICLES: {checkedComponents.length * 1247 + 3821}</div>
          </div>
          <div className="absolute bottom-3 right-3 space-y-1 font-mono text-[9px] text-purple-400/70 text-right">
            <div>MODE: DIAGNOSTIC</div>
            <div>RESOLUTION: HIGH</div>
            <div>DATA_LINK: LIVE</div>
          </div>
        </div>
      </div>

      {/* Right: Component scan checklist */}
      <div className="flex flex-col p-5 border-l border-cyan-500/10 space-y-4 overflow-y-auto">
        <div>
          <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">SCANNING AIRCRAFT — AF-001</div>
          <div className="text-[10px] text-slate-500">Falcon-A Series · Tactical Interceptor · Demo Unit</div>
        </div>

        {/* Scan progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>COMPONENT SCAN PROGRESS</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Component list */}
        <div className="space-y-2 flex-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-slate-800 pb-1">
            COMPONENT HEALTH CHECK
          </div>
          {COMPONENT_SCAN_SEQUENCE.map((comp, i) => {
            const isChecked = checkedComponents.includes(comp.id);
            const isScanning = i === currentComp && !isChecked;
            return (
              <div
                key={comp.id}
                className={`flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 ${
                  isChecked ? 'bg-emerald-950/30 border border-emerald-500/30'
                  : isScanning ? 'bg-cyan-950/30 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/40 border border-slate-800/50 opacity-40'
                }`}
              >
                <div className="w-5 h-5 flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isScanning ? (
                    <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold ${isChecked ? 'text-emerald-300' : isScanning ? 'text-cyan-300' : 'text-slate-500'}`}>
                    {comp.name}
                  </div>
                  <div className={`text-[9px] ${isChecked ? 'text-emerald-500' : isScanning ? 'text-cyan-500 animate-pulse' : 'text-slate-600'}`}>
                    {isChecked ? '✓ CHECKED' : isScanning ? 'SCANNING...' : 'WAITING'}
                  </div>
                </div>
                {isChecked && (
                  <div className="text-[9px] text-emerald-400 font-bold">
                    {Math.round(70 + Math.random() * 29)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3 — FLEET CATEGORY PROGRESS
// ─────────────────────────────────────────────────────────────────────────────
function PhaseFleetProgress({ onComplete }) {
  const [catIndex, setCatIndex] = useState(0);
  const [catProgress, setCatProgress] = useState({});
  const [globalScanned, setGlobalScanned] = useState(0);
  const [componentsChecked, setComponentsChecked] = useState(8421);
  const [issuesFound, setIssuesFound] = useState(0);
  const [critical, setCritical] = useState(0);
  const [warning, setWarning] = useState(0);

  const totalCount = CATEGORY_CONFIG.reduce((s, c) => s + c.count, 0);

  useEffect(() => {
    if (catIndex >= CATEGORY_CONFIG.length) {
      setTimeout(onComplete, 800);
      return;
    }
    const cat = CATEGORY_CONFIG[catIndex];
    const steps = 20;
    const stepDuration = cat.duration / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const frac = step / steps;
      const scannedNow = Math.round(cat.count * frac);
      setCatProgress(prev => ({ ...prev, [cat.key]: scannedNow }));
      setGlobalScanned(prev => {
        const base = CATEGORY_CONFIG.slice(0, catIndex).reduce((s, c) => s + c.count, 0);
        return base + scannedNow;
      });
      setComponentsChecked(prev => prev + Math.round(cat.count * 8 / steps));
      if (Math.random() < 0.3) setIssuesFound(prev => prev + 1);
      if (Math.random() < 0.1) setCritical(prev => prev + 1);
      if (Math.random() < 0.2) setWarning(prev => prev + 1);
      if (step >= steps) {
        clearInterval(interval);
        setCatProgress(prev => ({ ...prev, [cat.key]: cat.count }));
        setCatIndex(prev => prev + 1);
      }
    }, stepDuration);
    return () => clearInterval(interval);
  }, [catIndex, onComplete]);

  const globalProgress = Math.round((globalScanned / totalCount) * 100);
  const currentCatKey = catIndex < CATEGORY_CONFIG.length ? CATEGORY_CONFIG[catIndex]?.key : null;

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
      {/* Left: 3D Model */}
      <div className="relative flex flex-col">
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center space-x-2 bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-md text-xs text-cyan-400 font-mono font-bold">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span>FLEET SCANNING IN PROGRESS</span>
          </div>
        </div>
        <div
          className="flex-1 relative overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.06) 0%, rgba(3,7,18,0.95) 70%)' }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          <ScanCanvas category={currentCatKey || 'Aircraft'} scanning={true} />
        </div>

        {/* Live counters */}
        <div className="grid grid-cols-2 gap-2 p-4 border-t border-slate-800">
          <div className="space-y-1">
            <div className="text-[9px] text-slate-500 uppercase font-bold">COMPONENTS CHECKED</div>
            <div className="text-lg font-black text-cyan-400">{componentsChecked.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] text-slate-500 uppercase font-bold">ISSUES FOUND</div>
            <div className="text-lg font-black text-amber-400">{issuesFound}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] text-slate-500 uppercase font-bold">CRITICAL</div>
            <div className="text-lg font-black text-rose-400">{critical}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] text-slate-500 uppercase font-bold">WARNING</div>
            <div className="text-lg font-black text-amber-300">{warning}</div>
          </div>
        </div>
      </div>

      {/* Right: Category progress */}
      <div className="flex flex-col p-5 border-l border-cyan-500/10 space-y-4 overflow-y-auto">
        <div>
          <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">SCANNING FLEET</div>
          <div className="text-[10px] text-slate-500">Processing all equipment categories</div>
        </div>

        {/* Global progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>EQUIPMENT SCANNED</span>
            <span className="text-cyan-400 font-bold">{globalScanned.toLocaleString()} / {totalCount.toLocaleString()}</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 relative"
              style={{ width: `${globalProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="text-center text-xl font-black text-cyan-400">{globalProgress}%</div>
        </div>

        {/* Category rows */}
        <div className="space-y-2 flex-1">
          {CATEGORY_CONFIG.map((cat, idx) => {
            const scanned = catProgress[cat.key] || 0;
            const done = idx < catIndex;
            const active = idx === catIndex;
            const waiting = idx > catIndex;
            const pct = Math.round((scanned / cat.count) * 100);

            return (
              <div
                key={cat.key}
                className={`p-3 rounded-xl border transition-all duration-500 ${
                  done ? 'border-emerald-500/30 bg-emerald-950/20'
                  : active ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_16px_rgba(6,182,212,0.15)]'
                  : 'border-slate-800 bg-slate-900/30 opacity-40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <cat.icon className={`w-4 h-4 flex-shrink-0 ${done ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-slate-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${done ? 'text-emerald-300' : active ? 'text-cyan-300' : 'text-slate-500'}`}>
                        {cat.label}
                      </span>
                      <span className={`text-[10px] font-bold ${done ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {done ? `✓ ${cat.count}/${cat.count}` : active ? `⟳ ${scanned}/${cat.count}` : '○ WAITING'}
                      </span>
                    </div>
                    {!waiting && (
                      <div className="mt-1 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                          style={{ width: `${done ? 100 : pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4 — SCAN COMPLETE SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function PhaseSummary({ stats, onViewResults }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const t = setTimeout(onViewResults, 3500);
    return () => clearTimeout(t);
  }, [onViewResults]);

  // Normalize stats — context uses 'maintenance' not 'limited'
  const maintenance = stats.maintenance ?? stats.limited ?? 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} space-y-6 w-full max-w-3xl`}>
        {/* Complete header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
            <h2 className="text-3xl font-black text-white tracking-widest">FLEET HEALTH SCAN COMPLETE</h2>
          </div>
          <p className="text-slate-400 text-sm">1,248 equipment units processed · All categories scanned</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL EQUIPMENT', value: (stats.total || 0).toLocaleString(), color: 'text-white', border: 'border-slate-700' },
            { label: 'READY', value: (stats.ready || 0).toLocaleString(), color: 'text-emerald-400', border: 'border-emerald-500/40' },
            { label: 'MAINTENANCE', value: maintenance.toLocaleString(), color: 'text-amber-400', border: 'border-amber-500/40' },
            { label: 'CRITICAL', value: (stats.critical || 0).toLocaleString(), color: 'text-rose-400', border: 'border-rose-500/40' },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-xl bg-slate-900/60 border ${s.border} text-center space-y-1`}>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-center space-y-1 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="text-[10px] text-slate-500 uppercase font-bold">OVERALL FLEET HEALTH</div>
            <div className="text-5xl font-black text-cyan-400">{stats.avgHealth}%</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-purple-500/30 text-center space-y-1 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
            <div className="text-[10px] text-slate-500 uppercase font-bold">OVERALL READINESS</div>
            <div className="text-5xl font-black text-purple-400">{stats.avgReadiness}%</div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onViewResults}
            className="px-10 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm tracking-widest transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] uppercase"
          >
            VIEW FULL EQUIPMENT HEALTH LIST →
          </button>
          <p className="text-slate-600 text-[10px] mt-2">Auto-opening in 3.5 seconds...</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5 — FULL EQUIPMENT LIST
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

function PhaseEquipmentList({ fleet, stats, onSelectEquipment, onRescan }) {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [healthFilter, setHealthFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('health');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = fleet;
    if (categoryFilter !== 'ALL') list = list.filter(e => e.category === categoryFilter);
    if (statusFilter !== 'ALL') list = list.filter(e => e.status === statusFilter);
    if (healthFilter === '90-100') list = list.filter(e => e.health >= 90);
    else if (healthFilter === '70-89') list = list.filter(e => e.health >= 70 && e.health < 90);
    else if (healthFilter === '50-69') list = list.filter(e => e.health >= 50 && e.health < 70);
    else if (healthFilter === '0-49') list = list.filter(e => e.health < 50);
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      list = list.filter(e => e.id.toLowerCase().includes(s) || e.name.toLowerCase().includes(s));
    }
    list = [...list].sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === 'risk') {
        const o = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        va = o[a.risk] || 0; vb = o[b.risk] || 0;
      }
      return sortAsc ? va - vb : vb - va;
    });
    return list;
  }, [fleet, categoryFilter, statusFilter, healthFilter, searchTerm, sortBy, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortBy === col) setSortAsc(a => !a);
    else { setSortBy(col); setSortAsc(false); }
  };

  // Normalize stats
  const maintenance = stats.maintenance ?? stats.limited ?? 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">FLEET HEALTH RESULTS</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {filtered.length.toLocaleString()} of {fleet.length.toLocaleString()} equipment · All categories scanned
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-emerald-400 font-bold">✓ {stats.ready || 0} READY</span>
              <span className="text-amber-400 font-bold">⚠ {maintenance} MAINTENANCE</span>
              <span className="text-rose-400 font-bold">🔴 {stats.critical || 0} CRITICAL</span>
            </div>
            <button
              onClick={onRescan}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 font-bold text-xs transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RUN HEALTH CHECK AGAIN</span>
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          {['ALL', 'Aircraft', 'Armored Vehicles', 'Ground Vehicles', 'Air Defense', 'Naval Systems', 'Support Systems'].map(cat => (
            <button
              key={cat}
              onClick={() => { setCategoryFilter(cat); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
                categoryFilter === cat
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Status + Health + Search row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search equipment ID or name..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none w-full"
            />
          </div>
          <div className="flex items-center space-x-1 text-[10px]">
            <span className="text-slate-500 font-bold">STATUS:</span>
            {['ALL', 'READY', 'LIMITED', 'MAINTENANCE', 'CRITICAL'].map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-2 py-1 rounded text-[9px] font-bold transition-colors ${statusFilter === s ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-1 text-[10px]">
            <span className="text-slate-500 font-bold">HEALTH:</span>
            {['ALL', '90-100', '70-89', '50-69', '0-49'].map(h => (
              <button
                key={h}
                onClick={() => { setHealthFilter(h); setPage(1); }}
                className={`px-2 py-1 rounded text-[9px] font-bold transition-colors ${healthFilter === h ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-white'}`}
              >
                {h === 'ALL' ? 'ALL' : `${h}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-[11px] border-collapse font-mono">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[9px]">
              <th className="p-2.5 pl-4">STATUS</th>
              <th className="p-2.5">
                <button onClick={() => handleSort('id')} className="flex items-center space-x-1 hover:text-white">
                  <span>ID</span><ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-2.5">NAME</th>
              <th className="p-2.5">CATEGORY</th>
              <th className="p-2.5">
                <button onClick={() => handleSort('health')} className="flex items-center space-x-1 hover:text-white">
                  <span>HEALTH</span><ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-2.5">
                <button onClick={() => handleSort('readiness')} className="flex items-center space-x-1 hover:text-white">
                  <span>READINESS</span><ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-2.5">
                <button onClick={() => handleSort('risk')} className="flex items-center space-x-1 hover:text-white">
                  <span>RISK</span><ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-2.5">MAIN PROBLEM</th>
              <th className="p-2.5">LAST CHECK</th>
              <th className="p-2.5 pr-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-slate-500">No equipment matches the current filters.</td>
              </tr>
            ) : paginated.map(item => (
              <tr
                key={item.id}
                className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                onClick={() => onSelectEquipment(item)}
              >
                <td className="p-2.5 pl-4">
                  <span className="text-base" title={item.status}>{statusDot(item.status)}</span>
                </td>
                <td className="p-2.5 font-black text-cyan-400">{item.id}</td>
                <td className="p-2.5 font-bold text-white max-w-[120px] truncate">{item.name}</td>
                <td className="p-2.5 text-slate-400">{item.category}</td>
                <td className="p-2.5 w-28">
                  <div className="space-y-0.5">
                    <span className={`font-black ${healthColor(item.health)}`}>{item.health}%</span>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full ${healthBarColor(item.health)} rounded-full`} style={{ width: `${item.health}%` }} />
                    </div>
                  </div>
                </td>
                <td className="p-2.5 font-bold text-white">{item.readiness}%</td>
                <td className={`p-2.5 font-bold text-[10px] ${riskBadge(item.risk)}`}>{item.risk}</td>
                <td className="p-2.5 text-[10px] max-w-[130px]">
                  {item.criticalComponent ? (
                    <span className="text-amber-300 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{item.criticalComponent}</span>
                    </span>
                  ) : (
                    <span className="text-slate-600">Nominal</span>
                  )}
                </td>
                <td className="p-2.5 text-slate-500">{item.lastCheck}</td>
                <td className="p-2.5 pr-4 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectEquipment(item); }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 hover:bg-cyan-950/60 hover:border-cyan-400 text-cyan-300 font-bold text-[9px] transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    <span>VIEW</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 flex-shrink-0">
        <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} equipment</span>
        <div className="flex items-center space-x-1">
          <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">‹</button>
          <span className="px-3 py-1 text-cyan-400 font-bold">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">»</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 6 — EQUIPMENT DETAIL
// ─────────────────────────────────────────────────────────────────────────────
function PhaseEquipmentDetail({ equipment, onBack, onRescan }) {
  const [selectedComp, setSelectedComp] = useState(null);
  const problemComp = equipment.components?.find(c => c.health < 70);
  const activeComp = selectedComp || problemComp;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-xs font-bold transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>BACK TO FLEET LIST</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-white">{equipment.id}</span>
              <span className="text-lg font-black text-cyan-400">— {equipment.name}</span>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusBadge(equipment.status)}`}>
                {equipment.status}
              </span>
              <span className="bg-amber-950/40 border border-amber-500/40 text-amber-400 text-[9px] px-2 py-0.5 rounded font-bold">
                SIMULATION MODE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{equipment.category} · Last scanned: {equipment.lastCheck}</p>
          </div>
        </div>
        <button
          onClick={onRescan}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 font-bold text-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RUN HEALTH CHECK AGAIN</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left: 3D Digital Twin */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden border-r border-slate-800">
          <div
            className="flex-1 relative overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.07) 0%, rgba(3,7,18,0.96) 70%)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />

            <div className="absolute top-3 left-3 z-10 space-y-1.5">
              <div className="flex items-center space-x-2 bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-md text-xs text-cyan-400 font-mono font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>3D DIGITAL TWIN · {equipment.category.toUpperCase()}</span>
              </div>
              {activeComp && activeComp.health < 70 && (
                <div className="flex items-center space-x-2 bg-rose-950/90 border border-rose-500/50 px-3 py-1.5 rounded-md text-xs text-rose-300 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                  <span>PROBLEM: {activeComp.name.toUpperCase()} · {activeComp.health}%</span>
                </div>
              )}
            </div>

            <ScanCanvas
              category={equipment.category}
              scanning={false}
              problemComponent={activeComp?.health < 70 ? activeComp : null}
            />

            {/* Overall health overlays */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
              <div className="bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-lg text-center">
                <div className={`text-3xl font-black ${healthColor(equipment.health)}`}>{equipment.health}%</div>
                <div className="text-[9px] text-slate-500 uppercase font-bold">OVERALL HEALTH</div>
              </div>
              <div className="bg-slate-950/90 border border-cyan-500/30 px-4 py-2 rounded-lg text-center">
                <div className="text-3xl font-black text-cyan-400">{equipment.readiness}%</div>
                <div className="text-[9px] text-slate-500 uppercase font-bold">READINESS</div>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/40">
            <div className="flex items-center space-x-2 text-purple-400 text-[10px] font-bold mb-1.5">
              <SparklesIcon className="w-3.5 h-3.5 animate-pulse" />
              <span>NEXORA AI READINESS DIAGNOSIS</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">"{equipment.aiExplanation}"</p>
          </div>
        </div>

        {/* Right: Component health */}
        <div className="lg:col-span-5 flex flex-col overflow-hidden">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-0 border-b border-slate-800 flex-shrink-0">
            {[
              { label: 'HEALTH', value: `${equipment.health}%`, color: healthColor(equipment.health) },
              { label: 'READINESS', value: `${equipment.readiness}%`, color: 'text-cyan-400' },
              { label: 'NEXT MAINT', value: equipment.nextMaintenance, color: 'text-amber-400' },
            ].map((m, i) => (
              <div key={i} className={`p-3 text-center ${i > 0 ? 'border-l border-slate-800' : ''}`}>
                <div className={`text-xl font-black ${m.color}`}>{m.value}</div>
                <div className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Component list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-slate-800 pb-1 mb-2">
              COMPONENT HEALTH — Click to highlight in 3D
            </div>
            {equipment.components?.map(comp => {
              const isActive = activeComp?.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
                    isActive
                      ? comp.health < 70
                        ? 'border-rose-500/60 bg-rose-950/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                        : 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{comp.name}</span>
                    <span className={`text-xs font-black ${healthColor(comp.health)}`}>{comp.health}%</span>
                  </div>
                  <div className="mt-1.5 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${healthBarColor(comp.health)} rounded-full transition-all`}
                      style={{ width: `${comp.health}%` }}
                    />
                  </div>
                  {comp.problem && (
                    <p className="text-[9px] text-rose-400 mt-1 flex items-center space-x-1">
                      <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{comp.problem}</span>
                    </p>
                  )}
                  {isActive && (
                    <div className="text-[9px] text-cyan-400 mt-1">← Highlighted in 3D model</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MODAL ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────
export default function LiveHealthCheckModal({ isOpen, onClose }) {
  const { fleet, sortedFleet, stats, runFleetScan } = useFleetHealth();
  const [phase, setPhase] = useState(PHASE_INTRO);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentFleet, setCurrentFleet] = useState([]);
  const [currentStats, setCurrentStats] = useState(stats);

  // Reset when modal opens — always use sortedFleet so list is never empty
  useEffect(() => {
    if (isOpen) {
      setPhase(PHASE_INTRO);
      setSelectedEquipment(null);
      const baseFleet = (sortedFleet && sortedFleet.length > 0)
        ? sortedFleet
        : (fleet && fleet.length > 0 ? fleet : runFleetScan());
      setCurrentFleet(baseFleet);
      setCurrentStats(stats);
    }
  }, [isOpen, fleet, sortedFleet, stats]);

  const handleRescan = useCallback(() => {
    const newFleet = runFleetScan();
    setCurrentFleet(newFleet);
    setPhase(PHASE_SCAN_3D);
    setSelectedEquipment(null);
  }, [runFleetScan]);

  const handleScanComplete3D = useCallback(() => {
    setPhase(PHASE_FLEET_PROGRESS);
  }, []);

  const handleFleetProgressComplete = useCallback(() => {
    setPhase(PHASE_SUMMARY);
  }, []);

  const handleViewResults = useCallback(() => {
    setPhase(PHASE_LIST);
  }, []);

  const handleSelectEquipment = useCallback((eq) => {
    setSelectedEquipment(eq);
    setPhase(PHASE_DETAIL);
  }, []);

  const handleBackToList = useCallback(() => {
    setPhase(PHASE_LIST);
    setSelectedEquipment(null);
  }, []);

  if (!isOpen) return null;

  const phaseLabel = {
    [PHASE_INTRO]: 'FLEET DIAGNOSTIC',
    [PHASE_SCAN_3D]: '3D COMPONENT SCAN',
    [PHASE_FLEET_PROGRESS]: 'FLEET SCAN PROGRESS',
    [PHASE_SUMMARY]: 'SCAN COMPLETE',
    [PHASE_LIST]: 'EQUIPMENT HEALTH RESULTS',
    [PHASE_DETAIL]: selectedEquipment ? `${selectedEquipment.id} — DIGITAL TWIN` : 'DETAIL',
  }[phase];

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-mono bg-black/95 backdrop-blur-xl">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Modal header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-cyan-500/20 bg-slate-950/80 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-black tracking-widest text-white">NEXORA</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-bold text-cyan-400 uppercase">{phaseLabel}</span>
          </div>

          {/* Phase breadcrumb dots */}
          <div className="hidden sm:flex items-center space-x-1.5 ml-4">
            {[PHASE_INTRO, PHASE_SCAN_3D, PHASE_FLEET_PROGRESS, PHASE_SUMMARY, PHASE_LIST].map((p, i) => (
              <div
                key={p}
                className={`rounded-full transition-all duration-300 ${
                  phase === p ? 'w-4 h-2 bg-cyan-400' :
                  [PHASE_INTRO, PHASE_SCAN_3D, PHASE_FLEET_PROGRESS, PHASE_SUMMARY, PHASE_LIST].indexOf(phase) > i
                    ? 'w-2 h-2 bg-emerald-400' : 'w-2 h-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[10px] text-amber-400 bg-amber-950/30 border border-amber-500/30 px-2.5 py-1 rounded-md font-bold">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
            <span>SIMULATION MODE — DEMO DATA ONLY</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:text-rose-400 text-slate-400 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phase content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {phase === PHASE_INTRO && (
          <PhaseIntro onStart={() => setPhase(PHASE_SCAN_3D)} />
        )}
        {phase === PHASE_SCAN_3D && (
          <Phase3DScan onComplete={handleScanComplete3D} />
        )}
        {phase === PHASE_FLEET_PROGRESS && (
          <PhaseFleetProgress onComplete={handleFleetProgressComplete} />
        )}
        {phase === PHASE_SUMMARY && (
          <PhaseSummary stats={currentStats} onViewResults={handleViewResults} />
        )}
        {phase === PHASE_LIST && (
          <PhaseEquipmentList
            fleet={currentFleet}
            stats={currentStats}
            onSelectEquipment={handleSelectEquipment}
            onRescan={handleRescan}
          />
        )}
        {phase === PHASE_DETAIL && selectedEquipment && (
          <PhaseEquipmentDetail
            equipment={selectedEquipment}
            onBack={handleBackToList}
            onRescan={handleRescan}
          />
        )}
      </div>
    </div>
  );
}
