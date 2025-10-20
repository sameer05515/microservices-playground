import React, { useEffect, useRef } from "react";

export default function DiwaliFireworksV4({
  message = "Happy Deepawali 🪔",
  autoLaunch = true,
  launchInterval = 600,
  particleCount = 160,
  speedFactor = 1.3,
  hueRange = [0, 360],
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const intervalRef = useRef(null);
  const emojiContainerRef = useRef(null);

  const rand = (min, max) => Math.random() * (max - min) + min;

  class Particle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      const angle = rand(0, Math.PI * 2);
      const speed = rand(2, 8) * speedFactor;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = rand(0.008, 0.02);
      this.size = rand(1, 3);
      this.hue = hue + rand(-20, 20);
      this.gravity = 0.06;
      this.friction = 0.985;
      this.sparkle = Math.random() > 0.5;
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
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const glow = this.sparkle ? 80 : 50;
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${glow}%, ${this.alpha})`;
      ctx.shadowColor = `hsl(${this.hue},100%,60%)`;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.restore();
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
      this.speed = rand(4, 7) * speedFactor;
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.hue = rand(hueRange[0], hueRange[1]);
      this.trail = [];
      this.trailLength = 6;
    }
    update() {
      this.trail.unshift([this.x, this.y]);
      if (this.trail.length > this.trailLength) this.trail.pop();
      this.x += this.vx;
      this.y += this.vy;
      this.distanceTraveled += Math.hypot(this.vx, this.vy);
      return this.distanceTraveled < this.distanceToTarget;
    }
    draw(ctx) {
      ctx.beginPath();
      const trailColor = `hsl(${this.hue}, 100%, 60%)`;
      ctx.strokeStyle = trailColor;
      ctx.lineWidth = 2;
      for (let i = 0; i < this.trail.length - 1; i++) {
        const [x1, y1] = this.trail[i];
        const [x2, y2] = this.trail[i + 1];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
  }

  const spawnEmojiBurst = (x, y) => {
    const container = emojiContainerRef.current;
    const emojis = ["✨", "🎆", "🪔", "🎇", "🌟", "💥"];
    for (let i = 0; i < 10; i++) {
      const emoji = document.createElement("span");
      emoji.textContent = emojis[Math.floor(rand(0, emojis.length))];
      emoji.style.position = "absolute";
      emoji.style.left = `${x}px`;
      emoji.style.top = `${y}px`;
      emoji.style.fontSize = `${rand(16, 36)}px`;
      emoji.style.transition = `transform 1.2s ease-out, opacity 1.2s ease-out`;
      emoji.style.transform = `translate(${rand(-100, 100)}px, ${rand(-100, 100)}px)`;
      emoji.style.opacity = "1";
      emoji.style.pointerEvents = "none";
      container.appendChild(emoji);

      setTimeout(() => {
        emoji.style.transform += " scale(0)";
        emoji.style.opacity = "0";
      }, 50);

      setTimeout(() => {
        emoji.remove();
      }, 1200);
    }
  };

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
      for (let i = 0; i < particleCount; i++) particles.push(new Particle(x, y, hue));
      spawnEmojiBurst(x, y);
    };

    const spawnFirework = (tx, ty) => {
      const sx = rand(canvas.width * 0.2, canvas.width * 0.8);
      const sy = canvas.height;
      fireworks.push(new Firework(sx, sy, tx, ty));
    };

    if (autoLaunch) {
      intervalRef.current = setInterval(() => {
        for (let i = 0; i < 3; i++) {
          const tx = rand(canvas.width * 0.1, canvas.width * 0.9);
          const ty = rand(canvas.height * 0.1, canvas.height * 0.6);
          spawnFirework(tx, ty);
        }
      }, launchInterval);
    }

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 2; i++) spawnFirework(x + rand(-50, 50), y + rand(-50, 50));
      spawnExplosion(x, y);
    };

    canvas.addEventListener("click", handleClick);

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
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
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div ref={emojiContainerRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex h-full items-center justify-center select-none animate-pulse">
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-300 drop-shadow-[0_0_25px_rgba(255,215,0,0.9)] animate-bounce">
          {message}
        </h1>
      </div>
    </div>
  );
}