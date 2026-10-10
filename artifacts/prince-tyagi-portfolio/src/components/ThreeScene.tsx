import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group, Mesh, Points } from 'three';
import * as THREE from 'three';

const pointer = new THREE.Vector2();
const targetPointer = new THREE.Vector2();
let scrollTarget = 0;

function Field() {
  const points = useRef<Points>(null);
  const positions = useRef<Float32Array | null>(null);
  if (!positions.current) {
    const data = new Float32Array(330 * 3);
    for (let i = 0; i < 330; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 9;
      data[i * 3 + 1] = (Math.random() - 0.5) * 6;
      data[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    positions.current = data;
  }
  useFrame((state, delta) => {
    if (!points.current) return;
    const frameDelta = Math.min(delta, 0.05);
    points.current.rotation.y += frameDelta * 0.012;
    points.current.rotation.x += frameDelta * 0.004;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.13) * 0.04;
  });
  return <points ref={points}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions.current!, 3]} /></bufferGeometry>
    <pointsMaterial color="#9fdbe8" size={0.018} transparent opacity={0.62} sizeAttenuation depthWrite={false} />
  </points>;
}

function OrbitingForms() {
  const orbitOne = useRef<Group>(null);
  const orbitTwo = useRef<Group>(null);
  const orbitThree = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const root = useRef<Group>(null);
  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      targetPointer.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * -2);
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTarget = Math.min(1, window.scrollY / max);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  useFrame((state, delta) => {
    const frameDelta = Math.min(delta, 0.05);
    const damp = 1 - Math.exp(-frameDelta * 1.35);
    pointer.lerp(targetPointer, damp);
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x * 0.14 + scrollTarget * 0.12, 1.4, frameDelta);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, pointer.y * 0.1, 1.4, frameDelta);
      root.current.position.y = THREE.MathUtils.damp(root.current.position.y, -scrollTarget * 0.22, 1.1, frameDelta);
    }
    if (core.current) {
      core.current.rotation.x += frameDelta * 0.16;
      core.current.rotation.y += frameDelta * 0.21;
    }
    if (orbitOne.current) orbitOne.current.rotation.z += frameDelta * 0.16;
    if (orbitTwo.current) orbitTwo.current.rotation.z -= frameDelta * 0.11;
    if (orbitThree.current) orbitThree.current.rotation.y += frameDelta * 0.19;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pointer.x * 0.16, 1.3, frameDelta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, pointer.y * 0.11 - scrollTarget * 0.08, 1.3, frameDelta);
    state.camera.lookAt(0, -scrollTarget * 0.06, 0);
  });
  return (
    <group ref={root}>
      <Field />
      <mesh ref={core} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.82, 2]} />
        <meshPhysicalMaterial color="#568fbd" emissive="#153955" emissiveIntensity={0.5} roughness={0.22} metalness={0.64} clearcoat={1} clearcoatRoughness={0.14} />
      </mesh>
      <mesh position={[0, 0, 0]} scale={1.03}>
        <icosahedronGeometry args={[0.86, 1]} />
        <meshBasicMaterial color="#8ce3ee" wireframe transparent opacity={0.23} />
      </mesh>
      <group ref={orbitOne}>
        <mesh position={[1.55, 0, 0.1]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshPhysicalMaterial color="#a6a4ed" roughness={0.2} metalness={0.42} clearcoat={0.8} />
        </mesh>
        <mesh position={[-1.55, 0, 0.1]}>
          <sphereGeometry args={[0.12, 20, 16]} />
          <meshStandardMaterial color="#83e1e8" emissive="#267b93" emissiveIntensity={0.8} metalness={0.5} roughness={0.24} />
        </mesh>
      </group>
      <group ref={orbitTwo} rotation={[0.9, 0.2, 0.4]}>
        <mesh position={[0, 1.72, 0]}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshPhysicalMaterial color="#8ed8e7" roughness={0.15} metalness={0.4} transmission={0.35} thickness={0.8} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, -1.72, 0]}>
          <dodecahedronGeometry args={[0.17, 0]} />
          <meshBasicMaterial color="#ba9bff" wireframe />
        </mesh>
      </group>
      <group ref={orbitThree} rotation={[0.35, 0.5, 0]}>
        <mesh position={[0.8, 0.45, 1.1]}>
          <torusKnotGeometry args={[0.14, 0.045, 64, 8, 2, 3]} />
          <meshStandardMaterial color="#9fdbeb" emissive="#28617c" emissiveIntensity={0.5} metalness={0.5} roughness={0.25} />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2.45, 0.1, -0.35]}>
        <torusGeometry args={[1.24, 0.006, 8, 128]} />
        <meshBasicMaterial color="#91dbe8" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, 0.45, 0.5]}>
        <torusGeometry args={[1.92, 0.004, 8, 128]} />
        <meshBasicMaterial color="#9c86e7" transparent opacity={0.29} />
      </mesh>
      <mesh rotation={[0.35, 0.25, 0.1]}>
        <torusGeometry args={[2.2, 0.0025, 6, 144]} />
        <meshBasicMaterial color="#74bfd3" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function ThreeScene() {
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const syncVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => document.removeEventListener('visibilitychange', syncVisibility);
  }, []);
  return (
    <div className="three-canvas" aria-hidden="true">
      <Canvas frameloop={pageVisible ? 'always' : 'never'} dpr={[1, 1.35]} camera={{ position: [0, 0, 5.6], fov: 42 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }} fallback={<span>3D scene unavailable</span>}>
        <ambientLight intensity={0.72} />
        <pointLight position={[3, 3.5, 3]} intensity={2.2} color="#76dff1" />
        <pointLight position={[-3, -2, 1]} intensity={1.25} color="#8c78e5" />
        <spotLight position={[0, 4, 4]} intensity={1.15} angle={0.56} penumbra={0.8} color="#d9f8ff" />
        <OrbitingForms />
      </Canvas>
    </div>
  );
}
