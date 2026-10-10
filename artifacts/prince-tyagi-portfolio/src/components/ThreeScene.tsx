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
  const cyan = new THREE.Color('#38bdf8');
  const violet = new THREE.Color('#818cf8');
  const purple = new THREE.Color('#c084fc');
  const white = new THREE.Color('#f0f9ff');

  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const arm = i % 3;
    const angle = t * Math.PI * 12 + (arm * Math.PI * 2) / 3;
    const radius = 0.18 + t * 2.5;
    const jitter = (Math.random() - 0.5) * (0.03 + t * 0.22);
    const index = i * 3;

    positions[index] = Math.cos(angle) * (radius + jitter);
    positions[index + 1] = Math.sin(angle) * (radius + jitter) * 0.65 + (Math.random() - 0.5) * 0.14;
    positions[index + 2] = Math.sin(angle * 0.5) * (0.2 + t * 0.65) + (Math.random() - 0.5) * 0.28;

    let color = cyan;
    if (i % 17 === 0) color = white;
    else if (i % 5 === 0) color = purple;
    else if (i % 3 === 0) color = violet;

    const brightness = 0.5 + Math.random() * 0.5;
    colors[index] = color.r * brightness;
    colors[index + 1] = color.g * brightness;
    colors[index + 2] = color.b * brightness;
  }
  return { positions, colors };
}

function StarSpiral() {
  const stars = useRef<Points>(null);
  const orbitalPaths = useRef<Group>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  const spiral = useMemo(() => makeSpiral(2800), []);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      targetPointer.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        (event.clientY / window.innerHeight - 0.5) * -2
      );
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
      stars.current.rotation.z = THREE.MathUtils.damp(
        stars.current.rotation.z,
        pointer.x * 0.04 + scrollTarget * 0.15,
        0.65,
        dt
      );
      stars.current.rotation.x = THREE.MathUtils.damp(
        stars.current.rotation.x,
        pointer.y * 0.06,
        0.65,
        dt
      );
      stars.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.05 - scrollTarget * 0.14;
    }

    if (orbitalPaths.current) {
      orbitalPaths.current.rotation.z += dt * 0.022;
      orbitalPaths.current.rotation.y = THREE.MathUtils.damp(
        orbitalPaths.current.rotation.y,
        pointer.x * 0.12,
        0.7,
        dt
      );
      orbitalPaths.current.rotation.x = THREE.MathUtils.damp(
        orbitalPaths.current.rotation.x,
        pointer.y * 0.1,
        0.7,
        dt
      );
    }

    if (coreMesh.current) {
      coreMesh.current.rotation.x += dt * 0.4;
      coreMesh.current.rotation.y += dt * 0.6;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
      coreMesh.current.scale.set(scale, scale, scale);
    }

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pointer.x * 0.1, 0.7, dt);
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      pointer.y * 0.08 - scrollTarget * 0.09,
      0.7,
      dt
    );
    state.camera.lookAt(0, -scrollTarget * 0.04, 0);
  });

  return (
    <>
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[spiral.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[spiral.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.028}
          transparent
          opacity={0.92}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={orbitalPaths}>
        <mesh rotation={[1.12, 0.18, -0.32]}>
          <torusGeometry args={[1.72, 0.0035, 4, 180, Math.PI * 1.6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[0.52, 0.9, 0.24]}>
          <torusGeometry args={[2.22, 0.003, 4, 180, Math.PI * 1.7]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[1.46, 0.2, 0.7]}>
          <torusGeometry args={[0.55, 0.0045, 4, 96]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.55} />
        </mesh>
      </group>

      <mesh ref={coreMesh} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#60a5fa"
          emissiveIntensity={0.8}
          roughness={0.2}
          wireframe={true}
        />
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
      <Canvas
        frameloop={pageVisible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 44 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        fallback={<span>3D scene unavailable</span>}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[1.5, 2.5, 3]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[-2, -1.2, 1.5]} intensity={0.6} color="#c084fc" />
        <StarSpiral />
      </Canvas>
    </div>
  );
}
