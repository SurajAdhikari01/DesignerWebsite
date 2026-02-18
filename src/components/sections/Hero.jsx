import React, { useState, useEffect, useRef } from "react";

const ScrambleText = ({ text, delay = 0, className, style }) => {
  const [display, setDisplay] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    let iteration = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return (
    <span className={className} style={style}>
      {display}
    </span>
  );
};

const Hero = ({
  accentColor = "#00f0ff",
  mainBgColor = "#050505",
  textColor = "#ffffff",
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMouse({ x: clientX, y: clientY });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      // Removed cursor-none so you can see your mouse
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* 1. DYNAMIC GRID SYSTEM (Fills the 'Empty' space) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${textColor}11 1px, transparent 1px),
            linear-gradient(to bottom, ${textColor}11 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
          transform: `translate(${(mouse.x - 500) * 0.01}px, ${(mouse.y - 500) * 0.01}px)`,
        }}
      />

      {/* 2. MOUSE LIGHT BEAM (Adds interaction depth) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: `radial-gradient(circle 400px at ${mouse.x}px ${mouse.y}px, ${accentColor}15, transparent 80%)`,
        }}
      />

      {/* 3. MASSIVE BACKGROUND NUMBER */}
      <div className="absolute -bottom-20 -left-20 select-none pointer-events-none group">
        <span className="text-[40rem] font-black leading-none opacity-[0.03] italic tracking-tighter transition-all duration-700 group-hover:opacity-[0.05]">
          00
        </span>
      </div>

      {/* 4. ASYMMETRIC GEOMETRY */}
      {/* Rotating Ring */}
      <div
        className="absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] border-[1px] rounded-full opacity-10 animate-spin-slow"
        style={{ borderColor: accentColor }}
      />
      {/* Floating Glass Rectangle */}
      <div
        className="absolute w-[400px] h-[150px] border border-white/5 backdrop-blur-[4px] z-0 skew-x-12"
        style={{
          transform: `translate(${(mouse.x - 500) * -0.03}px, ${(mouse.y - 500) * -0.03}px)`,
          right: "15%",
          bottom: "20%",
        }}
      />
      {/* Vertical Data Line */}
      <div
        className="absolute top-0 left-1/4 w-[1px] h-full opacity-10"
        style={{
          background: `linear-gradient(to bottom, transparent, ${textColor}, transparent)`,
        }}
      />

      {/* 5. MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-7xl px-10 flex flex-col items-start">
        <div className="relative">
          <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter uppercase italic">
            <div className="relative overflow-visible">
              <ScrambleText text="SURAJ" delay={300} />
            </div>

            <div className="relative mt-4">
              <ScrambleText
                text="ADHIKARI"
                delay={900}
                style={{
                  color: "transparent",
                  WebkitTextStroke: `2px ${textColor}`,
                }}
                className="block opacity-70"
              />
              <div
                className="absolute -bottom-4 left-0 h-4"
                style={{
                  width: "40%",
                  backgroundColor: accentColor,
                  boxShadow: `0 0 50px ${accentColor}`,
                }}
              />
            </div>
          </h1>
        </div>
      </div>

      {/* 6. TECHNICAL OVERLAYS (Corner Brackets) */}
      <div className="absolute inset-10 border border-white/5 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-8 h-8 border-t border-l"
          style={{ borderColor: accentColor }}
        />
        <div
          className="absolute top-0 right-0 w-8 h-8 border-t border-r"
          style={{ borderColor: accentColor }}
        />
        <div
          className="absolute bottom-0 left-0 w-8 h-8 border-b border-l"
          style={{ borderColor: accentColor }}
        />
        <div
          className="absolute bottom-0 right-0 w-8 h-8 border-b border-r"
          style={{ borderColor: accentColor }}
        />
      </div>

      {/* 7. TEXTURE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-overlay">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full scale-150"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
      `,
        }}
      />
    </section>
  );
};

export default Hero;
