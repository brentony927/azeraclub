import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export default function FounderParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="founder-particles"
      init={particlesInit}
      className="fixed inset-0 z-0 pointer-events-none"
      options={{
        fullScreen: false,
        background: { color: { value: "transparent" } },
        fpsLimit: 30,
        particles: {
          color: { value: ["#6366f1", "#8b5cf6", "#a78bfa"] },
          links: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 0.4,
            direction: "none",
            outModes: { default: "bounce" },
          },
          number: {
            density: { enable: true, area: 1200 },
            value: 30,
          },
          opacity: { value: 0.2 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
}
