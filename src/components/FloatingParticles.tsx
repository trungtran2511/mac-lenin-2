import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  baseX: number;
  size: number;
  alpha: number;
  drift: number;
  speed: number;
  phase: number;
};

type SpawnMode = "screen" | "bottom" | "initial";

const DENSITY_MULTIPLIER = 0.24;
const FLOAT_SPEED_MULTIPLIER = 1.7;
const REPEL_RADIUS = 130;
const REPEL_STRENGTH = 58;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let lastTime = performance.now();

    const createParticle = (mode: SpawnMode = "bottom"): Particle => {
      const x = randomBetween(0, width);
      const y = mode === "screen"
        ? randomBetween(0, height)
        : mode === "initial"
          ? height + randomBetween(10, Math.min(height * 0.35, 260))
          : height + randomBetween(8, 90);

      return {
        x,
        y,
        baseX: x,
        size: randomBetween(1, 3.6),
        alpha: randomBetween(0.28, 0.92),
        drift: randomBetween(8, 34),
        speed: randomBetween(10, 34) * FLOAT_SPEED_MULTIPLIER,
        phase: randomBetween(0, Math.PI * 2),
      };
    };

    const syncParticleCount = () => {
      const targetCount = Math.round(Math.min(Math.max((width * height) / 4300, 180), 720) * DENSITY_MULTIPLIER);
      const particles = particlesRef.current;

      if (particles.length === 0) {
        particlesRef.current = Array.from({ length: targetCount }, () => createParticle("screen"));
        return;
      }

      if (particles.length > targetCount) {
        particlesRef.current = particles.slice(0, targetCount);
        return;
      }

      while (particles.length < targetCount) {
        particles.push(createParticle("bottom"));
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      syncParticleCount();
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const draw = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.035);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      for (const particle of particlesRef.current) {
        particle.phase += delta * 0.9;
        particle.y -= particle.speed * delta;
        particle.baseX += Math.sin(particle.phase) * 0.025;
        particle.x = particle.baseX + Math.sin(particle.phase) * particle.drift;

        if (particle.y < -24) {
          Object.assign(particle, createParticle("bottom"));
        }

        let drawX = particle.x;
        let drawY = particle.y;

        if (mouse.active) {
          const dx = drawX - mouse.x;
          const dy = drawY - mouse.y;
          const distance = Math.hypot(dx, dy);

          if (distance < REPEL_RADIUS) {
            const force = (1 - distance / REPEL_RADIUS) * REPEL_STRENGTH;
            const angle = Math.atan2(dy, dx);
            drawX += Math.cos(angle) * force;
            drawY += Math.sin(angle) * force;
          }
        }

        const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, particle.size * 4);
        glow.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha})`);
        glow.addColorStop(0.45, `rgba(255, 255, 255, ${particle.alpha * 0.22})`);
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, particle.alpha + 0.12)})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="floating-particles-canvas" aria-hidden="true" />;
}
