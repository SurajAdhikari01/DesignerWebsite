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
      className="relative w-full h-screen flex items-center justify-center overflow-hidden cursor-none"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* 2. MASSIVE BACKGROUND NUMBER (Off-screen / Brutalist) */}
      <div className="absolute -bottom-20 -left-20 select-none pointer-events-none">
        <span className="text-[40rem] font-black leading-none opacity-[0.03] italic tracking-tighter">
          00
        </span>
      </div>

      {/* 3. FLOATING GEOMETRIC SHAPES */}
      {/* Large Hollow Circle */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] border-[1px] rounded-full opacity-10 animate-spin-slow"
        style={{ borderColor: accentColor }}
      />

      {/* The "Frame" Square - Parallax effect */}
      <div
        className="absolute w-[300px] h-[300px] border border-white/10 backdrop-blur-[2px] z-0"
        style={{
          transform: `translate(${(mouse.x - 500) * 0.02}px, ${(mouse.y - 500) * 0.02}px)`,
          left: "20%",
          top: "25%",
        }}
      />

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-7xl px-10 flex flex-col items-start">
        {/* Name Stack */}
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
                className="block opacity-70 hover:opacity-100 transition-all duration-700"
              />

              {/* Accented Underline / Bar */}
              <div
                className="absolute -bottom-4 left-0 h-4 bg-white"
                style={{
                  width: "40%",
                  backgroundColor: accentColor,
                  boxShadow: `0 0 40px ${accentColor}80`,
                }}
              />
            </div>
          </h1>
        </div>

        {/* Floating Vertical Line Decor */}
        <div className="absolute right-20 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      {/* 5. THE "GRAIN" AND TEXTURE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-soft-light overflow-hidden">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full scale-150"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* 6. CORNER ACCENTS */}
      <div className="absolute top-10 left-10 flex gap-4">
        <div className="w-3 h-3 border border-white" />
        <div
          className="w-3 h-3 bg-white"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 rotate-180">
        <div className="w-20 h-[1px] bg-white/30" />
        <div className="w-10 h-[1px] bg-white/30" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
      `,
        }}
      />
    </section>
  );
};

export default Hero;
