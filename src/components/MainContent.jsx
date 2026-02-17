import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

const MainContent = forwardRef(
  (
    { accentColor, mainBgColor, menuThemeColor, textColor, isDarkTheme },
    ref,
  ) => {
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const projectsRef = useRef(null);
    const contactRef = useRef(null);
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          const totalScrollHeight = scrollHeight - clientHeight;
          const progress = totalScrollHeight > 0 ? (scrollTop / totalScrollHeight) * 100 : 0;
          setScrollProgress(progress);
        }
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
      }
    }, []);

    const scrollToSection = (elementRef) => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      navigateToSection: (sectionId) => {
        switch (sectionId) {
          case "home":
            scrollToSection(heroRef);
            break;
          case "about":
            scrollToSection(aboutRef);
            break;
          case "projects":
            scrollToSection(projectsRef);
            break;
          case "contact":
            scrollToSection(contactRef);
            break;
          default:
            break;
        }
      },
    }));

    const sections = [
      { id: "home", component: Hero, ref: heroRef },
      { id: "about", component: About, ref: aboutRef },
      { id: "projects", component: Projects, ref: projectsRef },
      { id: "contact", component: Contact, ref: contactRef },
    ];

    return (
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth relative"
        style={{
          backgroundColor: mainBgColor,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Progress Bar */}
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r z-50"
          style={{
            width: `${scrollProgress}%`,
            backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)`,
            boxShadow: `0 0 8px ${accentColor}66`,
          }}
        />

        {/* Hide webkit scrollbar */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="flex flex-col w-full max-w-[100vw]">
          {sections.map(({ id, component: Component, ref }) => (
            <section
              key={id}
              ref={ref}
              id={id}
              className="w-full min-h-screen relative flex flex-col justify-center"
              style={{
                borderBottom: `1px solid ${accentColor}15`,
              }}
            >
              <Component
                accentColor={accentColor}
                mainBgColor={mainBgColor}
                menuThemeColor={menuThemeColor}
                textColor={textColor}
                isDarkTheme={isDarkTheme}
              />
            </section>
          ))}

          {/* Footer / Copyright area */}
          <div
            className="py-8 text-center text-sm opacity-40"
            style={{ color: textColor }}
          >
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </div>
        </div>
      </div>
    );
  },
);

MainContent.displayName = "MainContent";

export default MainContent;
