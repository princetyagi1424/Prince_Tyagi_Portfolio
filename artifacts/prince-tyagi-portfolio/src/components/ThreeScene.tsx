import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Group, Points } from 'three';
import * as THREE from 'three';

const pointer = new THREE.Vector2();
const targetPointer = new THREE.Vector2();
let scrollTarget = 0;

function makeSpiral(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cool = new THREE.Color('#dceeff');
  const ice = new THREE.Color('#8bbdd2');
  const ember = new THREE.Color('#d6a77b');
  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const arm = i % 3;
    const angle = t * Math.PI * 12 + arm * Math.PI * 2 / 3;
    const radius = 0.16 + t * 2.42;
    const jitter = (Math.random() - 0.5) * (0.025 + t * 0.19);
    const index = i * 3;
    positions[index] = Math.cos(angle) * (radius + jitter);
    positions[index + 1] = Math.sin(angle) * (radius + jitter) * 0.63 + (Math.random() - 0.5) * 0.12;
    positions[index + 2] = Math.sin(angle * 0.48) * (0.18 + t * 0.62) + (Math.random() - 0.5) * 0.25;
    const color = i % 19 === 0 ? ember : (i % 4 === 0 ? ice : cool);
    const brightness = 0.45 + Math.random() * 0.55;
    colors[index] = color.r * brightness;
    colors[index + 1] = color.g * brightness;
    colors[index + 2] = color.b * brightness;
  }
  return { positions, colors };
}

function StarSpiral() {
  const stars = useRef<Points>(null);
  const orbitalPaths = useRef<Group>(null);
  const spiral = useMemo(() => makeSpiral(2400), []);
  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
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
    const dt = Math.min(delta, 0.04);
    const damp = 1 - Math.exp(-dt * 1.2);
    pointer.lerp(targetPointer, damp);
    if (stars.current) {
      stars.current.rotation.z = THREE.MathUtils.damp(stars.current.rotation.z, pointer.x * 0.035 + scrollTarget * 0.12, 0.65, dt);
      stars.current.rotation.x = THREE.MathUtils.damp(stars.current.rotation.x, pointer.y * 0.055, 0.65, dt);
      stars.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.045 - scrollTarget * 0.12;
    }
    if (orbitalPaths.current) {
      orbitalPaths.current.rotation.z += dt * 0.018;
      orbitalPaths.current.rotation.y = THREE.MathUtils.damp(orbitalPaths.current.rotation.y, pointer.x * 0.11, 0.7, dt);
      orbitalPaths.current.rotation.x = THREE.MathUtils.damp(orbitalPaths.current.rotation.x, pointer.y * 0.09, 0.7, dt);
    }
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pointer.x * 0.09, 0.7, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, pointer.y * 0.07 - scrollTarget * 0.08, 0.7, dt);
    state.camera.lookAt(0, -scrollTarget * 0.04, 0);
  });
  return (
    <>
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[spiral.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[spiral.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.026} transparent opacity={0.88} sizeAttenuation depthWrite={false} />
      </points>
      <group ref={orbitalPaths}>
        <mesh rotation={[1.12, 0.18, -0.32]}>
          <torusGeometry args={[1.67, 0.003, 4, 180, Math.PI * 1.55]} />
          <meshBasicMaterial color="#b9d5e4" transparent opacity={0.34} />
        </mesh>
        <mesh rotation={[0.52, 0.9, 0.24]}>
          <torusGeometry args={[2.18, 0.0025, 4, 180, Math.PI * 1.65]} />
          <meshBasicMaterial color="#c7a17f" transparent opacity={0.21} />
        </mesh>
        <mesh rotation={[1.46, 0.2, 0.7]}>
          <torusGeometry args={[0.5, 0.004, 4, 96]} />
          <meshBasicMaterial color="#eff6ff" transparent opacity={0.47} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.115, 1]} />
        <meshBasicMaterial color="#eaf5ff" />
      </mesh>
    </>
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
      <Canvas frameloop={pageVisible ? 'always' : 'never'} dpr={[1, 1.25]} camera={{ position: [0, 0, 6.25], fov: 43 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }} fallback={<span>3D scene unavailable</span>}>
        <ambientLight intensity={0.55} />
        <pointLight position={[1.4, 2.3, 3]} intensity={0.8} color="#d7eaff" />
        <pointLight position={[-2, -1, 1]} intensity={0.3} color="#dba77f" />
        <StarSpiral />
      </Canvas>
    </div>
  );
}
