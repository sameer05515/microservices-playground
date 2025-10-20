import React, { useEffect, useRef } from "react";

export default function ChhathPujaScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let sunY = 100;
    let waveOffset = 0;

    const drawSun = () => {
      const gradient = ctx.createRadialGradient(canvas.width / 2, sunY, 10, canvas.width / 2, sunY, 80);
      gradient.addColorStop(0, "#FFD700");
      gradient.addColorStop(1, "rgba(255,140,0,0.3)");

      ctx.beginPath();
      ctx.arc(canvas.width / 2, sunY, 80, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawWater = () => {
      const h = canvas.height * 0.65;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = h + Math.sin(x * 0.02 + waveOffset) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = "#1e3a8a";
      ctx.fill();
    };

    const drawReflection = () => {
      const h = canvas.height * 0.65;
      const reflectionGradient = ctx.createLinearGradient(canvas.width / 2, h, canvas.width / 2, h + 200);
      reflectionGradient.addColorStop(0, "rgba(255,215,0,0.3)");
      reflectionGradient.addColorStop(1, "rgba(255,140,0,0)");
      ctx.beginPath();
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(canvas.width / 2 - 80, h, 160, 200);
    };

    const drawOfferings = () => {
      const items = [
        { color: "#FF6347", size: 10 }, // fruits
        { color: "#DAA520", size: 8 }, // diya
        { color: "#ADFF2F", size: 9 }, // sugarcane
      ];

      for (let i = 0; i < 6; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        const x = canvas.width * 0.3 + i * 40;
        const y = canvas.height * 0.65 - Math.sin(i + waveOffset * 0.5) * 5;
        ctx.beginPath();
        ctx.arc(x, y, item.size, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawSun();
      drawWater();
      drawReflection();
      drawOfferings();

      waveOffset += 0.05;
      sunY = 100 + Math.sin(Date.now() * 0.001) * 8;

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full select-none">
        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-300 drop-shadow-[0_0_25px_rgba(255,215,0,0.9)] animate-pulse">
          Chhath Puja 🌅
        </h1>
        <p className="text-gray-200 text-lg mt-4 animate-bounce">
          May the Sun God bless you with health, happiness & prosperity 🌞
        </p>
      </div>
    </div>
  );
}