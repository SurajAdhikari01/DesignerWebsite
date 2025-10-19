import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import MainContent from "./components/MainContent";

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isNavAnimating, setIsNavAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navHoverTimeoutRef = useRef(null);
  const mainContentRef = useRef(null);
  const menuRef = useRef(null);
  const [isMainContentZoomedOut, setIsMainContentZoomedOut] = useState(false);

  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("activeTheme") || "skyBlush";
  });

  const [hoveredTheme, setHoveredTheme] = useState(null);

  // 🎨 COLOR THEMES
  const colorThemes = {
    // lavenderDream: {
    //   menu: "#E8D5E8",
    //   main: "#F5F0FA",
    //   accent: "#9B8FB8",
    //   name: "Lavender Dream",
    //   category: "Pastel",
    //   preview: ["#E8D5E8", "#F5F0FA", "#9B8FB8"],
    // },
    // mintBreeze: {
    //   menu: "#D5E8E0",
    //   main: "#F0FAF5",
    //   accent: "#7CB8A3",
    //   name: "Mint Breeze",
    //   category: "Pastel",
    //   preview: ["#D5E8E0", "#F0FAF5", "#7CB8A3"],
    // },
    peachSunset: {
      menu: "#FFE4D6",
      main: "#FFF5F0",
      accent: "#E8A87C",
      name: "Peach Sunset",
      category: "Pastel",
      preview: ["#FFE4D6", "#FFF5F0", "#E8A87C"],
    },
    skyBlush: {
      menu: "#D6E8FF",
      main: "#F0F7FF",
      accent: "#7CA8E8",
      name: "Sky Blush",
      category: "Pastel",
      preview: ["#D6E8FF", "#F0F7FF", "#7CA8E8"],
    },
    // midnightPurple: {
    //   menu: "#1A1625",
    //   main: "#0F0B14",
    //   accent: "#9B8FB8",
    //   name: "Midnight Purple",
    //   category: "Dark",
    //   preview: ["#1A1625", "#0F0B14", "#9B8FB8"],
    // },
    // deepOcean: {
    //   menu: "#0A1628",
    //   main: "#050B14",
    //   accent: "#4A90E2",
    //   name: "Deep Ocean",
    //   category: "Dark",
    //   preview: ["#0A1628", "#050B14", "#4A90E2"],
    // },
    // darkForest: {
    //   menu: "#1A2520",
    //   main: "#0F1612",
    //   accent: "#6B9B7F",
    //   name: "Dark Forest",
    //   category: "Dark",
    //   preview: ["#1A2520", "#0F1612", "#6B9B7F"],
    // },
    carbonNoir: {
      menu: "#1C1C1E",
      main: "#0D0D0D",
      accent: "#8E8E93",
      name: "Carbon Noir",
      category: "Dark",
      preview: ["#1C1C1E", "#0D0D0D", "#8E8E93"],
    },
    // glassmorphism: {
    //   menu: "#E8F0FE",
    //   main: "#F8FBFF",
    //   accent: "#4285F4",
    //   name: "Glassmorphism Blue",
    //   category: "Modern",
    //   preview: ["#E8F0FE", "#F8FBFF", "#4285F4"],
    // },
    // neonCyber: {
    //   menu: "#1A1A2E",
    //   main: "#0F0F1E",
    //   accent: "#00FFF5",
    //   name: "Neon Cyber",
    //   category: "Modern",
    //   preview: ["#1A1A2E", "#0F0F1E", "#00FFF5"],
    // },
    // warmNeutral: {
    //   menu: "#F5F1E8",
    //   main: "#FEFAF5",
    //   accent: "#D4A574",
    //   name: "Warm Neutral",
    //   category: "Modern",
    //   preview: ["#F5F1E8", "#FEFAF5", "#D4A574"],
    // },
    // monochrome: {
    //   menu: "#F5F5F7",
    //   main: "#FFFFFF",
    //   accent: "#000000",
    //   name: "Pure Monochrome",
    //   category: "Modern",
    //   preview: ["#F5F5F7", "#FFFFFF", "#000000"],
    // },
    sunsetGradient: {
      menu: "#FF6B9D",
      main: "#FFF0F5",
      accent: "#C44569",
      name: "Sunset Gradient",
      category: "Vibrant",
      preview: ["#FF6B9D", "#FFF0F5", "#C44569"],
    },
    // tropicalVibe: {
    //   menu: "#38B2AC",
    //   main: "#F0FDFA",
    //   accent: "#0F766E",
    //   name: "Tropical Vibe",
    //   category: "Vibrant",
    //   preview: ["#38B2AC", "#F0FDFA", "#0F766E"],
    // },
    // royalGold: {
    //   menu: "#2C1810",
    //   main: "#0F0805",
    //   accent: "#D4AF37",
    //   name: "Royal Gold",
    //   category: "Vibrant",
    //   preview: ["#2C1810", "#0F0805", "#D4AF37"],
    // },
    // arcticMinimal: {
    //   menu: "#E5F2FF",
    //   main: "#F7FBFF",
    //   accent: "#0EA5E9",
    //   name: "Arctic Minimal",
    //   category: "Vibrant",
    //   preview: ["#E5F2FF", "#F7FBFF", "#0EA5E9"],
    // },
  };

  const menuThemeColor = colorThemes[activeTheme].menu;
  const mainBgColor = colorThemes[activeTheme].main;
  const accentColor = colorThemes[activeTheme].accent;

  useEffect(() => {
    localStorage.setItem("activeTheme", activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    return () => {
      if (navHoverTimeoutRef.current) {
        clearTimeout(navHoverTimeoutRef.current);
      }
    };
  }, []);

  const toggleNav = useCallback(() => {
    if (isNavAnimating) return;
    setIsNavExpanded((prev) => !prev);
    setIsNavAnimating(true);
    setTimeout(() => setIsNavAnimating(false), 500);
  }, [isNavAnimating]);

  const openMenu = useCallback(() => {
    if (!isNavExpanded && !isNavAnimating) {
      setIsNavExpanded(true);
      setIsNavAnimating(true);
      setTimeout(() => setIsNavAnimating(false), 500);
    } else if (isNavExpanded && !isNavAnimating) {
      setIsNavExpanded(false);
      setIsNavAnimating(true);
      setTimeout(() => setIsNavAnimating(false), 500);
    }
  }, [isNavExpanded, isNavAnimating]);

  const closeNav = useCallback(() => {
    if (isNavExpanded && !isNavAnimating) {
      setIsNavExpanded(false);
      setIsNavAnimating(true);
      setTimeout(() => setIsNavAnimating(false), 500);
    }
  }, [isNavExpanded, isNavAnimating]);

  const handleMenuButtonHover = useCallback(() => {
    if (!isNavExpanded && !isNavAnimating) {
      if (navHoverTimeoutRef.current) clearTimeout(navHoverTimeoutRef.current);
      navHoverTimeoutRef.current = setTimeout(() => {
        setIsNavExpanded(true);
        setIsNavAnimating(true);
        setTimeout(() => setIsNavAnimating(false), 500);
      }, 200);
    }
  }, [isNavExpanded, isNavAnimating]);

  const handleMenuButtonLeave = useCallback(() => {
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current);
    }
  }, []);

  const handleNavClick = useCallback(
    (sectionId) => {
      if (mainContentRef.current) {
        mainContentRef.current.navigateToSection(sectionId);
      }
      setActiveSection(sectionId);
      closeNav();
    },
    [closeNav]
  );

  const handleThemeChange = useCallback((themeName) => {
    setActiveTheme(themeName);
  }, []);

  const handleZoomChange = useCallback((isZoomedOut) => {
    setIsMainContentZoomedOut(isZoomedOut);
  }, []);

  const navLinks = [
    { id: "home", title: "Home" },
    { id: "about", title: "About Us" },
    { id: "projects", title: "Projects" },
    { id: "contact", title: "Contact" },
  ];

  const getTextColor = (bgColor) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#2C2C2C" : "#ffffff";
  };

  const textColor = getTextColor(menuThemeColor);
  const isDarkTheme = textColor === "#ffffff";

  // Scramble Text Component
  const ScrambleText = ({ text, textColor, accentColor }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const scramble = () => {
      let iterations = 0;
      const originalText = text.toUpperCase();

      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setDisplayText(
          originalText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iterations) return originalText[index];
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("")
        );

        iterations += 1 / 3;

        if (iterations >= originalText.length) {
          clearInterval(intervalRef.current);
          setDisplayText(originalText);
        }
      }, 30);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      scramble();
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDisplayText(text.toUpperCase());
      }, 100);
    };

    useEffect(() => {
      return () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-block"
      >
        <span
          className="text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-wider transition-colors duration-300"
          style={{ color: isHovered ? accentColor : textColor }}
        >
          {displayText}
        </span>
        <span
          className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 ease-out ${
            isHovered ? "w-full" : "w-0"
          }`}
          style={{ backgroundColor: accentColor }}
        ></span>
      </span>
    );
  };

  const PizzaThemeCircle = ({ theme, isActive, isHovered }) => {
    return (
      <svg
        width="56"
        height="56"
        viewBox="0 0 100 100"
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-transform duration-300"
        style={{
          filter: isHovered
            ? "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))"
            : "none",
        }}
      >
        <path
          d="M 50 50 L 50 0 A 50 50 0 0 1 93.301 75 Z"
          fill={theme.preview[0]}
          className="transition-all duration-300"
        />
        <path
          d="M 50 50 L 93.301 75 A 50 50 0 0 1 6.699 75 Z"
          fill={theme.preview[1]}
          className="transition-all duration-300"
        />
        <path
          d="M 50 50 L 6.699 75 A 50 50 0 0 1 50 0 Z"
          fill={theme.preview[2]}
          className="transition-all duration-300"
        />
        {isActive && (
          <g className="animate-fadeIn">
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="rgba(0, 0, 0, 0.3)"
              className="transition-all duration-300"
            />
            <path
              d="M 30 50 L 43 63 L 70 36"
              stroke="white"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
            />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div
      className="min-h-screen overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: menuThemeColor }}
    >
      {/* Navigation */}
      <nav
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-40 transition-all duration-500 ease-in-out flex flex-col justify-between ${
          isNavExpanded ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: menuThemeColor }}
        onMouseEnter={() => {
          if (navHoverTimeoutRef.current) {
            clearTimeout(navHoverTimeoutRef.current);
          }
        }}
      >
        {/* Nav Links */}
        <div className="flex flex-col items-start gap-y-6 sm:gap-y-10 px-8 sm:px-16 w-full flex-1 justify-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="group w-full flex justify-between items-center"
            >
              <ScrambleText
                text={link.title}
                textColor={textColor}
                accentColor={accentColor}
              />
              <span
                className={`h-2 w-2 rounded-full transition-all duration-300 ease-in-out ${
                  activeSection === link.id ? "scale-100" : "scale-0"
                }`}
                style={{ backgroundColor: accentColor }}
              ></span>
            </button>
          ))}
        </div>

        {/* Theme Switcher */}
        <div className="px-6 sm:px-12 pb-8 sm:pb-16">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold opacity-40"
                style={{ color: textColor }}
              >
                Color Theme
              </p>
              <div
                className="h-1 w-1 rounded-full opacity-40"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="h-px flex-1 opacity-20"
                style={{ backgroundColor: textColor }}
              ></div>
              <p
                className="text-xs sm:text-sm font-medium tracking-wide transition-all duration-300"
                style={{ color: accentColor }}
              >
                {hoveredTheme
                  ? colorThemes[hoveredTheme].name
                  : colorThemes[activeTheme].name}
              </p>
              <div
                className="h-px flex-1 opacity-20"
                style={{ backgroundColor: textColor }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {Object.entries(colorThemes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                onMouseEnter={() => setHoveredTheme(key)}
                onMouseLeave={() => setHoveredTheme(null)}
                className="group relative flex items-center justify-center transition-all duration-300 touch-manipulation"
                title={theme.name}
                aria-label={`Switch to ${theme.name} theme`}
              >
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    hoveredTheme === key || activeTheme === key
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }`}
                  style={{
                    background: `radial-gradient(circle, ${theme.preview[2]}40 0%, transparent 70%)`,
                    transform: `scale(${activeTheme === key ? 1.3 : 1.2})`,
                  }}
                ></div>

                <div
                  className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                    activeTheme === key
                      ? "scale-100 shadow-lg"
                      : hoveredTheme === key
                      ? "scale-110 shadow-md"
                      : "scale-95 shadow-sm"
                  }`}
                  style={{
                    boxShadow:
                      activeTheme === key
                        ? `0 0 0 2px ${accentColor}, 0 8px 16px rgba(0, 0, 0, 0.15)`
                        : hoveredTheme === key
                        ? `0 0 0 2px ${theme.preview[2]}60, 0 4px 12px rgba(0, 0, 0, 0.1)`
                        : "0 2px 4px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <PizzaThemeCircle
                    theme={theme}
                    isActive={activeTheme === key}
                    isHovered={hoveredTheme === key}
                  />
                </div>

                {activeTheme === key && (
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg animate-scaleIn"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="drop-shadow"
                    >
                      <path
                        d="M 2 6 L 5 9 L 10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <p
              className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-medium opacity-30"
              style={{ color: textColor }}
            >
              {hoveredTheme
                ? colorThemes[hoveredTheme].category
                : colorThemes[activeTheme].category}
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className={`relative transition-all duration-500 ease-in-out origin-top-left overflow-hidden ${
          isNavExpanded
            ? "sm:w-[calc(100%-420px)] sm:h-[calc(100vh-40px)] sm:translate-x-5 sm:translate-y-5 sm:rounded-2xl sm:shadow-2xl"
            : "w-full h-screen translate-x-0 translate-y-0 rounded-none"
        }`}
      >
        <button
          onClick={toggleNav}
          onMouseEnter={handleMenuButtonHover}
          onMouseLeave={handleMenuButtonLeave}
          className="group absolute top-1/2 -translate-y-1/2 right-0 z-50 h-32 sm:h-40 w-7 sm:w-8 transition-all duration-300 ease-in-out overflow-hidden touch-manipulation"
          aria-label="Toggle menu"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 40 164"
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id="trapezoidClip">
                <path
                  d="M 0 34 Q 0 30 3 28 C 12.6667 23 25 20 33 14 Q 42 7 45 0 Q 48 7 51 14 C 56 20 60 23 66 28 Q 69 30 69 34 L 69 130 Q 69 134 66 136 C 60 141 56 144 51 150 Q 48 157 45 164 Q 42 157 33 150 C 25 144 12.6667 141 3 136 Q 0 134 0 130 L 0 34 Z"
                  fill={menuThemeColor}
                />
              </clipPath>
            </defs>
            <rect
              width="40"
              height="164"
              fill={menuThemeColor}
              clipPath="url(#trapezoidClip)"
              className="backdrop-blur-sm transition-colors duration-500"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute font-bold text-base sm:text-lg transition-all duration-300 ease-in-out overflow-hidden"
              style={{
                color: textColor,
                transform: `rotate(90deg) ${
                  isNavExpanded ? "translateX(100%)" : "translateX(0)"
                }`,
                opacity: isNavExpanded ? 0 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {"MENU".split("").map((char, idx) => (
                <span
                  key={idx}
                  className="inline-block transition-all duration-300 ease-out group-hover:scale-110"
                  style={{
                    transitionDelay: `${idx * 40}ms`,
                    letterSpacing: idx === 3 ? "0" : "0.4em",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>

            <div
              className="absolute font-bold text-base sm:text-lg transition-all duration-300 ease-in-out overflow-hidden"
              style={{
                color: textColor,
                transform: `rotate(90deg) ${
                  isNavExpanded ? "translateX(0)" : "translateX(-100%)"
                }`,
                opacity: isNavExpanded ? 1 : 0,
                whiteSpace: "nowrap",
              }}
            >
              {"CLOSE".split("").map((char, idx) => (
                <span
                  key={idx}
                  className="inline-block transition-all duration-300 ease-out group-hover:scale-110"
                  style={{
                    transitionDelay: `${idx * 40}ms`,
                    letterSpacing: idx === 4 ? "0" : "0.4em",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </button>

        <main
          onMouseEnter={() => {
            if (isNavExpanded && !isNavAnimating && !isMainContentZoomedOut) {
              closeNav();
            }
          }}
          className="h-full w-full overflow-hidden rounded-inherit transition-colors duration-500"
          style={{ backgroundColor: mainBgColor }}
        >
          <MainContent
            ref={mainContentRef}
            menuRef={menuRef}
            accentColor={accentColor}
            mainBgColor={mainBgColor}
            menuThemeColor={menuThemeColor}
            textColor={textColor}
            isDarkTheme={isDarkTheme}
            onOpenMenu={openMenu}
            onCloseMenu={closeNav}
            onZoomChange={handleZoomChange}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
