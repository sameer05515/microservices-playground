import React, { useEffect, useRef } from "react";

// Default exportable React component: full-screen fireworks on a <canvas>
export default function DiwaliFireworksV1() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const intervalRef = useRef(null);
  const ctxRef = useRef(null);
  const dprRef = useRef(1);

  // Utility: random in [min, max)
  const rand = (min, max) => Math.random() * (max - min) + min;

  // Particle for explosion
  class Particle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1.5, 5.5);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = rand(0.01, 0.03);
      this.size = rand(1, 2.5);
      this.hue = hue + rand(-15, 15);
      this.gravity = 0.04;
      this.friction = 0.985;
      this.trail = [];
      this.trailLen = 6;
    }
    update() {
      // trail
      this.trail.unshift([this.x, this.y]);
      if (this.trail.length > this.trailLen) this.trail.pop();

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }
    draw(ctx) {
      ctx.beginPath();
      if (this.trail.length > 1) {
        ctx.moveTo(this.trail[this.trail.length - 1][0], this.trail[this.trail.length - 1][1]);
        for (let i = this.trail.length - 2; i >= 0; i--) {
          ctx.lineTo(this.trail[i][0], this.trail[i][1]);
        }
      } else {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      }
      ctx.strokeStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
      ctx.lineWidth = this.size;
      ctx.stroke();
    }
  }

  // Firework rocket -> rises then explodes into particles
  class Firework {
    constructor(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
      this.distanceTraveled = 0;
      this.speed = rand(3.5, 6.5);
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.hue = rand(0, 360);
      this.alpha = 1;
      this.trail = [];
      this.trailLen = 10;
    }
    update() {
      const prevX = this.x;
      const prevY = this.y;

      // trail
      this.trail.unshift([this.x, this.y]);
      if (this.trail.length > this.trailLen) this.trail.pop();

      this.x += this.vx;
      this.y += this.vy;
      const dx = this.x - prevX;
      const dy = this.y - prevY;
      this.distanceTraveled += Math.hypot(dx, dy);

      // slow fade-in for tail
      this.alpha = Math.max(0.3, this.alpha - 0.001);

      const arrived = this.distanceTraveled >= this.distanceToTarget || this.vy > 1.5;
      return !arrived;
    }
    draw(ctx) {
      ctx.beginPath();
      if (this.trail.length > 1) {
        ctx.moveTo(this.trail[this.trail.length - 1][0], this.trail[this.trail.length - 1][1]);
        for (let i = this.trail.length - 2; i >= 0; i--) {
          ctx.lineTo(this.trail[i][0], this.trail[i][1]);
        }
      } else {
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      }
      ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      dprRef.current = dpr;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // state
    const fireworks = [];
    const particles = [];

    const spawnExplosion = (x, y, hue = rand(0, 360), count = 80) => {
      for (let i = 0; i < count; i++) particles.push(new Particle(x, y, hue));
    };

    const spawnFirework = (tx, ty) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const startX = rand(w * 0.2, w * 0.8);
      const startY = h + 10; // from bottom
      fireworks.push(new Firework(startX, startY, tx, ty));
    };

    // Auto launch
    const autoLaunch = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const tx = rand(w * 0.15, w * 0.85);
      const ty = rand(h * 0.1, h * 0.45);
      spawnFirework(tx, ty);
    };

    intervalRef.current = setInterval(autoLaunch, 900);

    // Interaction
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnFirework(x, y);
      // Immediate sparkle
      spawnExplosion(x, y, rand(0, 360), 30);
    };

    const handleTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      spawnFirework(x, y);
      spawnExplosion(x, y, rand(0, 360), 24);
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouch, { passive: true });

    // Animation loop
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Clear with slight alpha for glowing trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Update + draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        if (f.update()) {
          f.draw(ctx);
        } else {
          // explode where it stopped
          spawnExplosion(f.x, f.y, f.hue, Math.floor(rand(60, 120)));
          fireworks.splice(i, 1);
        }
      }

      // Update + draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.update()) {
          p.draw(ctx);
        } else {
          particles.splice(i, 1);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Gradient glow backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,215,0,0.15),transparent_60%)]" />

      {/* Center text */}
      <div className="relative z-10 flex h-screen w-full items-center justify-center select-none">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide text-yellow-300 drop-shadow-[0_0_20px_rgba(255,215,0,0.75)]">
            Happy Deepawali 🪔
          </h1>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-200 opacity-80">
            Tap / Click anywhere to launch fireworks
          </p>
        </div>
      </div>
    </div>
  );
}
