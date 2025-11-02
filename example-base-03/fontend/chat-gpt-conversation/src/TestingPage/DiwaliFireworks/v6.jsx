import React, { useEffect, useRef } from "react";

export default function ChhathPujaSunset() {
  const canvasRef = useRef(null);
  const diyas = useRef([]);
  const mantraText = ["ॐ सूर्याय नमः", "ॐ सूर्य देवाय नमः", "ॐ नमः सूर्याय"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createDiyas = () => {
      diyas.current = Array.from({ length: 10 }).map(() => ({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.65 + Math.random() * 40,
        drift: Math.random() * 0.5 + 0.1,
      }));
    };
    createDiyas();

    let waveOffset = 0;
    let sunY = canvas.height * 0.45;
    let mantraIndex = 0;
    let mantraOpacity = 0;
    let mantraFadeIn = true;

    const drawSky = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#FF4500");
      gradient.addColorStop(0.5, "#FF8C00");
      gradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawSun = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        sunY,
        10,
        canvas.width / 2,
        sunY,
        100
      );
      gradient.addColorStop(0, "#FFD700");
      gradient.addColorStop(1, "rgba(255,69,0,0.3)");
      ctx.beginPath();
      ctx.arc(canvas.width / 2, sunY, 100, 0, Math.PI * 2);
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
      const waterGradient = ctx.createLinearGradient(0, h, 0, canvas.height);
      waterGradient.addColorStop(0, "#1e3a8a");
      waterGradient.addColorStop(1, "#000");
      ctx.fillStyle = waterGradient;
      ctx.fill();
    };

    const drawReflection = () => {
      const h = canvas.height * 0.65;
      const reflectionGradient = ctx.createLinearGradient(
        canvas.width / 2,
        h,
        canvas.width / 2,
        h + 200
      );
      reflectionGradient.addColorStop(0, "rgba(255,215,0,0.3)");
      reflectionGradient.addColorStop(1, "rgba(255,140,0,0)");
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(canvas.width / 2 - 80, h, 160, 200);
    };

    const drawDiyas = () => {
      const h = canvas.height * 0.65;
      diyas.current.forEach((diya) => {
        diya.x += Math.sin(waveOffset * 0.5) * 0.3;
        diya.y += Math.sin(waveOffset + diya.drift) * 0.2;
        if (diya.x > canvas.width) diya.x = -20;

        ctx.beginPath();
        ctx.arc(diya.x, diya.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#DAA520";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(diya.x, diya.y - 6, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "#FFA500";
        ctx.shadowBlur = 15;
        ctx.fill();
      });
    };

    const drawWomen = () => {
      const baseY = canvas.height * 0.65;
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      // Left woman
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.35, baseY - 80, 20, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      // Arms
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.35 - 20, baseY - 100);
      ctx.lineTo(canvas.width * 0.35 + 20, baseY - 110);
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 8;
      ctx.stroke();
      // Right woman
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.65, baseY - 80, 20, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.65 - 20, baseY - 100);
      ctx.lineTo(canvas.width * 0.65 + 20, baseY - 110);
      ctx.stroke();
      ctx.restore();
    };

    const drawMantra = () => {
      ctx.save();
      ctx.globalAlpha = mantraOpacity;
      ctx.fillStyle = "rgba(255,215,0,0.9)";
      ctx.font = "bold 40px 'Noto Sans Devanagari', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        mantraText[mantraIndex],
        canvas.width / 2,
        canvas.height * 0.2
      );
      ctx.restore();

      if (mantraFadeIn) {
        mantraOpacity += 0.01;
        if (mantraOpacity >= 1) mantraFadeIn = false;
      } else {
        mantraOpacity -= 0.01;
        if (mantraOpacity <= 0) {
          mantraFadeIn = true;
          mantraIndex = (mantraIndex + 1) % mantraText.length;
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSky();
      drawSun();
      drawReflection();
      drawWater();
      drawDiyas();
      drawWomen();
      drawMantra();

      waveOffset += 0.04;
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-300 drop-shadow-[0_0_25px_rgba(255,215,0,0.9)] animate-pulse">
          Chhath Puja Sunset 🌅
        </h1>
        <p className="text-gray-200 text-lg mt-4 animate-bounce">
          Prayers to the setting sun for peace, prosperity & purity 🌞🪔
        </p>
      </div>
    </div>
  );
}