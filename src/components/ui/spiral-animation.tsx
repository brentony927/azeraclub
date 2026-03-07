import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

class Vector2D {
  constructor(public x: number, public y: number) {}
  static random(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}

class Vector3D {
  constructor(public x: number, public y: number, public z: number) {}
}

class Star {
  private dx: number;
  private dy: number;
  private spiralLocation: number;
  private strokeWeightFactor: number;
  private z: number;
  private angle: number;
  private distance: number;
  private rotationDirection: number;
  private expansionRate: number;
  private finalScale: number;

  constructor(cameraZ: number, cameraTravelDistance: number) {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 30 * Math.random() + 15;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.expansionRate = 1.2 + Math.random() * 0.8;
    this.finalScale = 0.7 + Math.random() * 0.6;
    this.dx = this.distance * Math.cos(this.angle);
    this.dy = this.distance * Math.sin(this.angle);
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3;
    this.z = Vector2D.random(0.5 * cameraZ, cameraTravelDistance + cameraZ);
    this.z = this.z * 0.7 + (cameraTravelDistance / 2) * 0.3 * this.spiralLocation;
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0);
  }

  render(p: number, ctrl: AnimationController) {
    const spiralPos = ctrl.spiralPath(this.spiralLocation);
    const q = p - this.spiralLocation;
    if (q <= 0) return;

    const dp = ctrl.constrain(4 * q, 0, 1);
    const elastic = ctrl.easeOutElastic(dp);
    const power = Math.pow(dp, 2);

    let easing: number;
    if (dp < 0.3) easing = dp + (power - dp) * (dp / 0.3);
    else if (dp < 0.7) easing = power + (elastic - power) * ((dp - 0.3) / 0.4);
    else easing = elastic;

    let sx: number, sy: number;
    if (dp < 0.3) {
      const t = easing / 0.3;
      sx = spiralPos.x + this.dx * 0.3 * t;
      sy = spiralPos.y + this.dy * 0.3 * t;
    } else if (dp < 0.7) {
      const mid = (dp - 0.3) / 0.4;
      const curve = Math.sin(mid * Math.PI) * this.rotationDirection * 1.5;
      const bx = spiralPos.x + this.dx * 0.3, by = spiralPos.y + this.dy * 0.3;
      const tx = spiralPos.x + this.dx * 0.7, ty = spiralPos.y + this.dy * 0.7;
      sx = bx + (tx - bx) * mid + (-this.dy * 0.4 * curve) * mid;
      sy = by + (ty - by) * mid + (this.dx * 0.4 * curve) * mid;
    } else {
      const fp = (dp - 0.7) / 0.3;
      const bx = spiralPos.x + this.dx * 0.7, by = spiralPos.y + this.dy * 0.7;
      const td = this.distance * this.expansionRate * 1.5;
      const sa = this.angle + 1.2 * this.rotationDirection * fp * Math.PI;
      sx = bx + (spiralPos.x + td * Math.cos(sa) - bx) * fp;
      sy = by + (spiralPos.y + td * Math.sin(sa) - by) * fp;
    }

    const cz = ctrl.cameraZ;
    const vz = ctrl.viewZoom;
    const vx = (this.z - cz) * sx / vz;
    const vy = (this.z - cz) * sy / vz;

    let sizeMul = dp < 0.6 ? 1.0 + dp * 0.2 : 1.2 * (1.0 - (dp - 0.6) / 0.4) + this.finalScale * ((dp - 0.6) / 0.4);
    ctrl.showProjectedDot(new Vector3D(vx, vy, this.z), 8.5 * this.strokeWeightFactor * sizeMul);
  }
}

class AnimationController {
  private timeline: gsap.core.Timeline;
  private time = 0;
  private ctx: CanvasRenderingContext2D;
  private size: number;
  private stars: Star[] = [];

  readonly cameraZ = -400;
  private readonly cameraTravelDistance = 3400;
  private readonly startDotYOffset = 28;
  readonly viewZoom = 100;
  private readonly numberOfStars = 5000;
  private readonly trailLength = 80;
  private readonly changeEventTime = 0.32;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, _dpr: number, size: number) {
    this.ctx = ctx;
    this.size = size;
    this.timeline = gsap.timeline({ repeat: -1 });

    for (let i = 0; i < this.numberOfStars; i++) {
      this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance));
    }

    this.timeline.to(this, {
      time: 1,
      duration: 15,
      repeat: -1,
      ease: "none",
      onUpdate: () => this.render(),
    });
  }

  ease(p: number, g: number): number {
    return p < 0.5 ? 0.5 * Math.pow(2 * p, g) : 1 - 0.5 * Math.pow(2 * (1 - p), g);
  }

  easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 4.5;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  constrain(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private map(value: number, s1: number, e1: number, s2: number, e2: number): number {
    return s2 + (e2 - s2) * ((value - s1) / (e1 - s1));
  }

  spiralPath(p: number): Vector2D {
    p = this.constrain(1.2 * p, 0, 1);
    p = this.ease(p, 1.8);
    const turns = 6;
    const theta = 2 * Math.PI * turns * Math.sqrt(p);
    const r = 170 * Math.sqrt(p);
    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset);
  }

  showProjectedDot(pos: Vector3D, sizeFactor: number) {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    const newCZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;
    if (pos.z <= newCZ) return;
    const d = pos.z - newCZ;
    const x = this.viewZoom * pos.x / d;
    const y = this.viewZoom * pos.y / d;
    const sw = 400 * sizeFactor / d;
    this.ctx.beginPath();
    this.ctx.arc(x, y, Math.max(sw / 2, 0.2), 0, Math.PI * 2);
    this.ctx.fill();
  }

  private render() {
    const ctx = this.ctx;
    // Use moss green dark background instead of black
    ctx.fillStyle = "hsl(0, 0%, 4%)";
    ctx.fillRect(0, 0, this.size, this.size);
    ctx.save();
    ctx.translate(this.size / 2, this.size / 2);

    const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1), 0, 1);
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    ctx.rotate(-Math.PI * this.ease(t2, 2.7));

    // Trail in moss green accent
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
      ctx.fillStyle = "hsl(0, 0%, 50%)";
      const pt = t1 - 0.00015 * i;
      const pos = this.spiralPath(pt);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, sw / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stars in white-green
    ctx.fillStyle = "hsl(0, 0%, 95%)";
    for (const star of this.stars) star.render(t1, this);

    // Start dot
    if (this.time > this.changeEventTime) {
      const dy = this.cameraZ * this.startDotYOffset / this.viewZoom;
      this.showProjectedDot(new Vector3D(0, dy, this.cameraTravelDistance), 2.5);
    }

    ctx.restore();
  }

  destroy() {
    this.timeline.kill();
  }
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<AnimationController | null>(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const size = Math.max(dims.w, dims.h);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${dims.w}px`;
    canvas.style.height = `${dims.h}px`;
    ctx.scale(dpr, dpr);
    animRef.current = new AnimationController(canvas, ctx, dpr, size);
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [dims]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
