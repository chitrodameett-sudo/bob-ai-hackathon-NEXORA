import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

/**
 * 3D Model: Aircraft (Tactical Jet Fighter)
 */
function JetModel({ problemComponent, onSelectSubsystem }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const isCoolingProblem = problemComponent?.id === 'cooling' || problemComponent?.name?.toLowerCase().includes('cool');

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={1.2}>
      {/* Jet Fuselage */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.8, 3.2, 5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Wings */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3.6, 1.2, 0.1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* PROBLEM LOCATION: Thermal Cooling Subsystem */}
      <mesh 
        position={[0, 0.5, 0.3]} 
        onClick={(e) => { e.stopPropagation(); if (onSelectSubsystem) onSelectSubsystem('cooling'); }}
      >
        <boxGeometry args={[0.7, 1.0, 0.45]} />
        <meshStandardMaterial 
          color={isCoolingProblem ? "#f43f5e" : "#10b981"} 
          wireframe={isCoolingProblem} 
          emissive={isCoolingProblem ? "#f43f5e" : "#10b981"}
          emissiveIntensity={isCoolingProblem ? 1.5 : 0.4}
        />
        {isCoolingProblem && (
          <Html distanceFactor={8} position={[0.9, 0.3, 0]}>
            <div className="bg-slate-950/95 border-2 border-rose-500 p-2.5 rounded-xl font-mono text-[10px] text-rose-300 w-52 shadow-glow-rose backdrop-blur-md">
              <div className="flex items-center space-x-1 text-rose-400 font-extrabold uppercase mb-1">
                <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                <span>⚠ PROBLEM DETECTED</span>
              </div>
              <p className="font-bold text-white uppercase text-[11px]">{problemComponent?.name || 'COOLING SYSTEM'}</p>
              <p className="text-rose-400 font-extrabold">{problemComponent?.health || 41}% HEALTH</p>
              <p className="text-[9px] text-slate-300 mt-1 leading-tight">{problemComponent?.problem || 'Temperature above normal threshold.'}</p>
            </div>
          </Html>
        )}
      </mesh>

      {/* Engine Exhaust */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.8, 16]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * 3D Model: Armored Vehicle (Battle Tank)
 */
function TankModel({ problemComponent }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const isProblem = problemComponent?.health < 70;

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={1.2}>
      {/* Hull */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.2, 0.8, 1.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* Turret Assembly (Highlight location if problem) */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.45, 16]} />
        <meshStandardMaterial 
          color={isProblem ? "#f59e0b" : "#10b981"} 
          wireframe={isProblem} 
          emissive={isProblem ? "#f59e0b" : "#10b981"} 
          emissiveIntensity={1.2}
        />
        {isProblem && (
          <Html distanceFactor={8} position={[1.1, 0.4, 0]}>
            <div className="bg-slate-950/95 border-2 border-amber-500 p-2.5 rounded-xl font-mono text-[10px] text-amber-300 w-52 shadow-glow-amber backdrop-blur-md">
              <div className="flex items-center space-x-1 text-amber-400 font-extrabold uppercase mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>⚠ PROBLEM DETECTED</span>
              </div>
              <p className="font-bold text-white uppercase text-[11px]">{problemComponent?.name || 'TURRET HYDRAULICS'}</p>
              <p className="text-amber-400 font-extrabold">{problemComponent?.health || 54}% HEALTH</p>
              <p className="text-[9px] text-slate-300 mt-1 leading-tight">{problemComponent?.problem || 'Pressure variance detected.'}</p>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

/**
 * 3D Model: Ground Vehicle (Transport Truck)
 */
function TransportVehicleModel() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={1.2}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.4, 0.9, 1.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 1.1, -0.2]}>
        <boxGeometry args={[1.0, 0.7, 1.1]} />
        <meshStandardMaterial color="#06b6d4" wireframe emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/**
 * 3D Model: Air Defense Radar
 */
function AirDefenseModel() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.2}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 0.4, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 1.0, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[2.0, 1.4, 0.15]} />
        <meshStandardMaterial color="#06b6d4" wireframe emissive="#06b6d4" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

/**
 * 3D Model: Naval Patrol Vessel
 */
function NavalVesselModel() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={1.2}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.2, 0.6, 0.9]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.8, 0]}>
        <boxGeometry args={[1.0, 0.6, 0.6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

/**
 * 3D Model: Support Generator Rig
 */
function SupportRigModel() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.2}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1.4, 1.4]} />
        <meshStandardMaterial color="#06b6d4" wireframe emissive="#06b6d4" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export default function Asset3DViewer({ 
  category = 'Aircraft', 
  equipmentHealth = 92, 
  problemComponent, 
  onSelectSubsystem 
}) {
  const renderCategoryModel = () => {
    switch (category) {
      case 'Armored Vehicles':
        return <TankModel problemComponent={problemComponent} />;
      case 'Ground Vehicles':
        return <TransportVehicleModel />;
      case 'Air Defense':
        return <AirDefenseModel />;
      case 'Naval Systems':
        return <NavalVesselModel />;
      case 'Support Systems':
        return <SupportRigModel />;
      default:
        return <JetModel problemComponent={problemComponent} onSelectSubsystem={onSelectSubsystem} />;
    }
  };

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/30 hud-grid">
      {/* Header Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 bg-slate-950/90 px-3 py-1 rounded-md border border-cyan-500/40 text-xs text-cyan-400 font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>3D DIGITAL TWIN • PROBLEM LOCATION SCANNER</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 1.5, 4.5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#3b82f6" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          {renderCategoryModel()}
        </Float>

        <Sparkles count={40} scale={6} size={2} speed={0.4} color="#06b6d4" />
        <OrbitControls enableZoom={true} maxDistance={8} minDistance={2} />
      </Canvas>
    </div>
  );
}
