import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh } from 'three';

function Geometry() {
  const root = useRef<Group>(null);
  const cube = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!root.current || !cube.current) return;
    const { x, y } = state.pointer;
    root.current.rotation.y += (x * 0.17 - root.current.rotation.y) * Math.min(delta * 1.5, 1);
    root.current.rotation.x += (-y * 0.13 - root.current.rotation.x) * Math.min(delta * 1.5, 1);
    cube.current.rotation.x += delta * 0.12;
    cube.current.rotation.y += delta * 0.16;
  });
  return (
    <group ref={root}>
      <mesh ref={cube} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.18, 1]} />
        <meshBasicMaterial color="#7adce8" wireframe transparent opacity={0.68} />
      </mesh>
      <mesh position={[0.08, 0.03, -0.16]}>
        <icosahedronGeometry args={[0.79, 0]} />
        <meshPhysicalMaterial color="#7567c8" roughness={0.18} metalness={0.36} transmission={0.42} thickness={0.6} transparent opacity={0.74} />
      </mesh>
      <mesh position={[-1.62, 0.74, -0.8]} rotation={[0.2, 0.2, 0]}>
        <octahedronGeometry args={[0.26, 0]} />
        <meshBasicMaterial color="#b09cf7" wireframe transparent opacity={0.65} />
      </mesh>
      <mesh position={[1.57, -0.85, -0.65]} rotation={[0.2, 0.2, 0]}>
        <octahedronGeometry args={[0.19, 0]} />
        <meshBasicMaterial color="#8ce3e8" wireframe transparent opacity={0.75} />
      </mesh>
      <mesh rotation={[Math.PI / 2.45, 0.1, -0.35]}>
        <torusGeometry args={[1.68, 0.004, 8, 120]} />
        <meshBasicMaterial color="#91dbe8" transparent opacity={0.33} />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, 0.45, 0.5]}>
        <torusGeometry args={[2.03, 0.003, 8, 120]} />
        <meshBasicMaterial color="#9c86e7" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2 }} aria-hidden="true">
      <Canvas dpr={[1, 1.4]} camera={{ position: [0, 0, 5.5], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={<span>3D scene unavailable</span>}>
        <ambientLight intensity={1.5} />
        <pointLight position={[3, 4, 3]} intensity={1.1} color="#78ddec" />
        <Geometry />
      </Canvas>
    </div>
  );
}
