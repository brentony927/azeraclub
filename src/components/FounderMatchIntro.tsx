import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

// Pre-computed "AZERA" letter positions on a grid
function generateAzeraPositions(count: number): Float32Array {
  const letters = [
    // A
    [0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[3,3],[3,2],[3,1],[3,0],[1,2],[2,2],
    // Z
    [5,4],[6,4],[7,4],[8,4],[8,3],[7,2],[6,1],[5,0],[6,0],[7,0],[8,0],
    // E
    [10,0],[10,1],[10,2],[10,3],[10,4],[11,4],[12,4],[13,4],[11,2],[12,2],[11,0],[12,0],[13,0],
    // R
    [15,0],[15,1],[15,2],[15,3],[15,4],[16,4],[17,4],[18,3],[17,2],[16,2],[17,1],[18,0],
    // A
    [20,0],[20,1],[20,2],[20,3],[20,4],[21,4],[22,4],[23,4],[23,3],[23,2],[23,1],[23,0],[21,2],[22,2],
  ];

  const positions = new Float32Array(count * 3);
  const scaleX = 0.35;
  const scaleY = 0.4;
  const offsetX = -4.2;
  const offsetY = -1;

  for (let i = 0; i < count; i++) {
    if (i < letters.length) {
      positions[i * 3] = letters[i][0] * scaleX + offsetX;
      positions[i * 3 + 1] = letters[i][1] * scaleY + offsetY;
      positions[i * 3 + 2] = 0;
    } else {
      // Extra particles scattered near center
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
  }
  return positions;
}

function Particles({ onComplete }: { onComplete: () => void }) {
  const count = 200;
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const { camera } = useThree();
  const phaseRef = useRef<"gather" | "hold" | "explode" | "done">("gather");
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const logoPositions = useMemo(() => generateAzeraPositions(count), []);

  const [randomPositions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  });

  const [explodeVelocities] = useState(() => {
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      vel[i * 3] = Math.cos(angle) * speed;
      vel[i * 3 + 1] = Math.sin(angle) * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }
    return vel;
  });

  const progressRef = useRef({ gather: 0, opacity: 1 });

  useEffect(() => {
    const tl = gsap.timeline();
    const prog = progressRef.current;

    // Phase 1: Gather (0 -> 1.8s)
    tl.to(prog, {
      gather: 1,
      duration: 1.8,
      ease: "power2.inOut",
      onStart: () => { phaseRef.current = "gather"; },
    });

    // Phase 2: Hold (1.8 -> 2.3s)
    tl.to({}, {
      duration: 0.5,
      onStart: () => { phaseRef.current = "hold"; },
    });

    // Phase 3: Explode (2.3 -> 3.5s)
    tl.to({}, {
      duration: 1.2,
      onStart: () => { phaseRef.current = "explode"; },
    });

    // Fade out overlay
    tl.to(prog, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        phaseRef.current = "done";
        onComplete();
      },
    }, "-=0.5");

    // Camera zoom
    gsap.to(camera.position, { z: 4.5, duration: 2, ease: "power2.inOut" });
    gsap.to(camera.position, { z: 6, duration: 1.5, delay: 2.3, ease: "power2.out" });

    timelineRef.current = tl;
    return () => { tl.kill(); };
  }, [camera, onComplete]);

  const explodeStartTime = useRef(0);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position;
    const arr = positions.array as Float32Array;
    const phase = phaseRef.current;
    const prog = progressRef.current;

    if (phase === "gather") {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3] = THREE.MathUtils.lerp(randomPositions[i3], logoPositions[i3], prog.gather);
        arr[i3 + 1] = THREE.MathUtils.lerp(randomPositions[i3 + 1], logoPositions[i3 + 1], prog.gather);
        arr[i3 + 2] = THREE.MathUtils.lerp(randomPositions[i3 + 2], logoPositions[i3 + 2], prog.gather);
      }
    } else if (phase === "hold") {
      // Subtle pulse
      const pulse = Math.sin(state.clock.elapsedTime * 10) * 0.02;
      if (materialRef.current) {
        materialRef.current.size = 0.12 + pulse;
      }
    } else if (phase === "explode") {
      if (explodeStartTime.current === 0) explodeStartTime.current = state.clock.elapsedTime;
      const dt = state.clock.elapsedTime - explodeStartTime.current;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3] = logoPositions[i3] + explodeVelocities[i3] * dt;
        arr[i3 + 1] = logoPositions[i3 + 1] + explodeVelocities[i3 + 1] * dt;
        arr[i3 + 2] = logoPositions[i3 + 2] + explodeVelocities[i3 + 2] * dt;
      }
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = prog.opacity;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(randomPositions)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.12}
        color="#8b5cf6"
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function GlowOrbs() {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) {
      ref1.current.position.x = Math.sin(t * 0.5) * 2;
      ref1.current.position.y = Math.cos(t * 0.3) * 1.5;
    }
    if (ref2.current) {
      ref2.current.position.x = Math.cos(t * 0.4) * 2.5;
      ref2.current.position.y = Math.sin(t * 0.6) * 1;
    }
  });

  return (
    <>
      <mesh ref={ref1}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} />
      </mesh>
      <mesh ref={ref2}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.1} />
      </mesh>
    </>
  );
}

export default function FounderMatchIntro({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleComplete = () => {
    setVisible(false);
    onComplete();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.2} />
        <GlowOrbs />
        <Particles onComplete={handleComplete} />
      </Canvas>
    </div>
  );
}
