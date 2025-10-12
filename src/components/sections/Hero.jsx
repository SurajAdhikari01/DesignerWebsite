import { useState, useEffect, useRef } from "react";
import BackgroundGrid from "../BackgroundGrid";

const Hero = ({ accentColor, mainBgColor, textColor, isDarkTheme }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e) => {
    // Disable mouse move effect on touch devices to save performance
    if ("ontouchstart" in window) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    }
  };

  const createLongShadow = (length = 30) => {
    let shadow = "";
    const baseOpacity = isDarkTheme ? 0.15 : 0.05;
    for (let i = 1; i <= length; i++) {
      const opacity = baseOpacity - (i / length) * baseOpacity * 0.5;
      shadow += `${i}px ${i}px 0 ${accentColor}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}${i < length ? "," : ""}`;
    }
    return shadow;
  };

  const rings = [
    { baseSize: 500, duration: "30s", opacity: 0.05 },
    { baseSize: 375, duration: "20s", opacity: 0.08 },
    { baseSize: 250, duration: "15s", opacity: 0.1 },
  ];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="w-full h-screen relative flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: mainBgColor,
        perspective: "1000px",
      }}
    >
      <BackgroundGrid
        accentColor={accentColor}
        isDarkTheme={isDarkTheme}
        opacity={0.05}
      />
      {/* 3D Rotating Rings - Optimized & Responsive */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${mousePosition.y * 10}deg) rotateY(${
              mousePosition.x * 10
            }deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {rings.map((ring, i) => {
            const size = `min(${ring.baseSize}px, 80vw)`;
            return (
              <div
                key={i}
                className="absolute inset-0 rounded-full border animate-spin-slow"
                style={{
                  width: size,
                  height: size,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  animationDuration: ring.duration,
                  borderColor: accentColor,
                  opacity: ring.opacity,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div
          className="transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${mousePosition.y * -3}deg) rotateY(${
              mousePosition.x * 3
            }deg) translateZ(50px)`,
            transformStyle: "preserve-3d",
          }}
        >
          <h1
            className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transform: `translateZ(100px)`,
              color: textColor,
            }}
          >
            <div className="relative inline-block mb-2">
              <span
                className="relative font-bold"
                style={{
                  textShadow: `
                    1px 1px 0 ${accentColor}30,
                    2px 2px 0 ${accentColor}28,
                    3px 3px 0 ${accentColor}20,
                    4px 4px 0 ${accentColor}18,
                    5px 5px 0 ${accentColor}10,
                    6px 6px 0 ${accentColor}08
                  `,
                }}
              >
                Hi, I'm
              </span>
            </div>
            <br />
            <div className="relative inline-block">
              <span
                className="relative font-black tracking-tight"
                style={{
                  textShadow: createLongShadow(20), // Reduced shadow length for performance
                }}
              >
                Suraj Adhikari
              </span>
            </div>
          </h1>

          <div
            className={`mb-8 sm:mb-10 transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transform: `translateZ(80px)`,
            }}
          >
            <p
              className="text-lg sm:text-xl md:text-3xl font-light tracking-wide mb-2"
              style={{
                textShadow: `1px 1px 0 ${accentColor}15`,
                color: `${textColor}cc`,
              }}
            >
              <span className="inline-block animate-wave origin-bottom-right">
                ✨
              </span>{" "}
              Creative Developer{" "}
              <span className="inline-block animate-wave origin-bottom-right animation-delay-200">
                &
              </span>{" "}
              Designer
            </p>
          </div>

          <p
            className={`text-sm sm:text-base md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transform: `translateZ(60px)`,
              color: `${textColor}b3`,
            }}
          >
            Crafting beautiful, interactive experiences with modern web
            technologies. Transforming ideas into pixel-perfect reality.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-900 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transform: `translateZ(80px)`,
            }}
          ></div>
        </div>

        {/* Floating 3D Objects - Simplified for mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            {
              style: "top-10 left-4 sm:top-20 sm:left-10",
              size: "w-12 h-12 sm:w-16 sm:h-16",
              delay: "0s",
              z: mousePosition.x * 50,
            },
            {
              style: "bottom-20 right-4 sm:bottom-32 sm:right-16",
              size: "w-10 h-10 sm:w-12 sm:h-12",
              delay: "1s",
              z: mousePosition.y * -50,
            },
            {
              style: "top-1/3 right-5 sm:right-20",
              size: "w-16 h-16 sm:w-20 sm:h-20",
              delay: "2s",
              z: mousePosition.x * -30,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`absolute ${item.style} animate-float-slow opacity-10 transition-opacity`}
              style={{
                animationDelay: item.delay,
                transform: `translateZ(${item.z}px)`,
              }}
            >
              <div
                className={`${item.size} border-2 rounded-lg transform rotate-45 animate-spin-very-slow`}
                style={{ borderColor: accentColor }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
