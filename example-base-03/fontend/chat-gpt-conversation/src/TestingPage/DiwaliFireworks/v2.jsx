import React, { useEffect, useRef, useState } from "react";

export default function DiwaliFireworksV2({
  message = "Happy Deepawali 🪔",
  autoLaunch = true,
  launchInterval = 900,
  particleCount = 100,
  speedFactor = 1,
  hueRange = [0, 360],
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const intervalRef = useRef(null);

  const rand = (min, max) => Math.random() * (max - min) + min;

  class Particle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1.5, 5.5) * speedFactor;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = rand(0.01, 0.03);
      this.size = rand(1, 2.5);
      this.hue = hue + rand(-15, 15);
      this.gravity = 0.04;
      this.friction = 0.985;
    }
    update() {
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
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},100%,60%,${this.alpha})`;
      ctx.fill();
    }
  }

  class Firework {
    constructor(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
      this.distanceTraveled = 0;
      this.speed = rand(3.5, 6.5) * speedFactor;
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.hue = rand(hueRange[0], hueRange[1]);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.distanceTraveled += Math.hypot(this.vx, this.vy);
      return this.distanceTraveled < this.distanceToTarget;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue},100%,70%)`;
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fireworks = [];
    const particles = [];

    const spawnExplosion = (x, y, hue = rand(...hueRange)) => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, hue));
      }
    };

    const spawnFirework = (tx, ty) => {
      const sx = rand(canvas.width * 0.2, canvas.width * 0.8);
      const sy = canvas.height;
      fireworks.push(new Firework(sx, sy, tx, ty));
    };

    if (autoLaunch) {
      intervalRef.current = setInterval(() => {
        const tx = rand(canvas.width * 0.1, canvas.width * 0.9);
        const ty = rand(canvas.height * 0.1, canvas.height * 0.5);
        spawnFirework(tx, ty);
      }, launchInterval);
    }

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnFirework(x, y);
      spawnExplosion(x, y);
    };

    canvas.addEventListener("click", handleClick);

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        if (f.update()) {
          f.draw(ctx);
        } else {
          spawnExplosion(f.x, f.y, f.hue);
          fireworks.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.update()) {
          p.draw(ctx);
        } else {
          particles.splice(i, 1);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(intervalRef.current);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
    };
  }, [autoLaunch, launchInterval, particleCount, speedFactor, hueRange]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex h-full items-center justify-center select-none">
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
          {message}
        </h1>
      </div>
    </div>
  );
}
