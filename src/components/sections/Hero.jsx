import React, { useState, useEffect, useRef } from "react";

// Helper for the scramble effect
const ScrambleText = ({ text, delay = 0, className, style }) => {
  const [display, setDisplay] = useState("");
  const [finished, setFinished] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  useEffect(() => {
    let timeout;
    let iteration = 0;

    // Start delay
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          setFinished(true);
        }

        iteration += 1 / 3; // Speed of decoding
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [text, delay]);

  return (
    <span className={className} style={style}>
      {display}
    </span>
  );
};

const Hero = ({
  accentColor = "#00f0ff",
  mainBgColor = "#0a0a0a",
  textColor = "#ffffff",
  isDarkTheme = true,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex flex-col justify-center overflow-hidden selection:bg-white selection:text-black"
      style={{ backgroundColor: mainBgColor }}
    >
      {/* 1. Cinematic Noise Overlay (Adds texture/professionalism) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* 2. The Grid Background (Hidden by default, revealed by Spotlight) */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${textColor}15 1px, transparent 1px),
            linear-gradient(to bottom, ${textColor}15 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
          maskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
        }}
      />

      {/* 3. The Spotlight Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${accentColor}15, transparent 40%)`,
        }}
      />

      {/* 4. Abstract Geometric Decorations (Floating) */}
      <div
        className="absolute top-20 right-10 md:right-32 w-24 h-24 md:w-48 md:h-48 border border-current opacity-10 rounded-full mix-blend-difference animate-spin-slow"
        style={{ color: accentColor }}
      />
      <div
        className="absolute bottom-20 left-10 md:left-32 w-32 h-32 md:w-64 md:h-64 border border-current opacity-10 rounded-full mix-blend-difference animate-spin-reverse-slow"
        style={{ color: textColor }}
      />

      {/* 5. Main Content Area */}
      <div className="relative z-10 px-6 md:px-20 lg:px-32 w-full max-w-screen-2xl mx-auto">
        {/* Intro Tag */}
        <div className="mb-6 flex items-center gap-4 overflow-hidden">
          <div
            className="h-[1px] w-12 bg-current opacity-50"
            style={{ color: accentColor }}
          ></div>
          <span
            className="text-sm md:text-base font-mono tracking-widest uppercase opacity-60"
            style={{ color: textColor }}
          >
            Portfolio 2026
          </span>
        </div>

        {/* Massive Name Typography */}
        <h1
          className="text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.9] tracking-tighter mb-8"
          style={{ color: textColor }}
        >
          <div className="block overflow-hidden">
            <span className="block opacity-50 text-2xl md:text-4xl font-light font-mono mb-2 text-transparent bg-clip-text bg-gradient-to-r from-current to-transparent">
              &lt;Hello /&gt; I am
            </span>
          </div>
          <div className="block">
            {/* The Scramble Effect Component */}
            <ScrambleText text="SURAJ" delay={500} className="block" />
          </div>
          <div className="block relative">
            <ScrambleText
              text="ADHIKARI"
              delay={1200}
              style={{
                color: "transparent",
                WebkitTextStroke: `2px ${textColor}`,
              }} // Outline effect
              className="block opacity-80"
            />
            {/* Accent color blur behind text */}
            <div
              className="absolute -top-10 -left-10 w-full h-full blur-3xl opacity-20 -z-10"
              style={{ backgroundColor: accentColor }}
            ></div>
          </div>
        </h1>

        {/* Role & Description - Aligned Right/Bottom for asymmetry */}
        <div
          className="flex flex-col md:flex-row justify-between items-end gap-8 mt-12 border-t pt-8 opacity-0 animate-fade-in-up"
          style={{
            borderColor: `${textColor}20`,
            animationDelay: "2s",
            animationFillMode: "forwards",
          }}
        >
          <div className="max-w-md">
            <p
              className="text-lg md:text-xl font-light leading-relaxed"
              style={{ color: `${textColor}90` }}
            >
              A creative developer building digital experiences that blend{" "}
              <strong style={{ color: accentColor }}>visual aesthetics</strong>{" "}
              with{" "}
              <strong style={{ color: accentColor }}>
                technical performance
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-right mb-2">
              <span
                className="block text-xs uppercase tracking-widest opacity-50 mb-1"
                style={{ color: textColor }}
              >
                Current Status
              </span>
              <span
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: accentColor }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
                Available for work
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative 'Scroll' Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div
          className="w-[1px] h-12 bg-gradient-to-b from-transparent via-current to-transparent"
          style={{ color: textColor }}
        ></div>
      </div>
    </section>
  );
};

export default Hero;
