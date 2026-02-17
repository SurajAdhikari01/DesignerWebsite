import React, { useState, useEffect, useRef } from "react";

const About = ({
  accentColor = "#00f0ff",
  mainBgColor = "#0a0a0a",
  textColor = "#ffffff",
  isDarkTheme = true,
}) => {
  const [activeModule, setActiveModule] = useState(0); // Default open first module
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const skillModules = [
    {
      id: "01",
      name: "Frontend Architecture",
      description:
        "Building responsive, pixel-perfect interfaces with modern reactivity.",
      stack: [
        "React",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "Three.js",
        "Framer Motion",
      ],
    },
    {
      id: "02",
      name: "Backend Engineering",
      description: "Designing scalable APIs and robust server-side logic.",
      stack: ["Node.js", "Python", "PostgreSQL", "GraphQL", "Redis", "Docker"],
    },
    {
      id: "03",
      name: "AI & Intelligence",
      description:
        "Integrating machine learning models for smarter applications.",
      stack: [
        "TensorFlow",
        "OpenAI API",
        "LangChain",
        "Hugging Face",
        "Pandas",
      ],
    },
    {
      id: "04",
      name: "Mobile & Native",
      description: "Crafting performant cross-platform mobile experiences.",
      stack: ["React Native", "Swift", "Expo", "Mobile UI/UX"],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 px-6 md:px-12 lg:px-24 overflow-hidden selection:bg-white selection:text-black"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* 1. Background Texture (Consistent with Hero) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Grid Lines */}
      <div
        className="absolute left-12 top-0 bottom-0 w-[1px] opacity-10 pointer-events-none hidden lg:block"
        style={{ backgroundColor: textColor }}
      ></div>
      <div
        className="absolute right-12 top-0 bottom-0 w-[1px] opacity-10 pointer-events-none hidden lg:block"
        style={{ backgroundColor: textColor }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* LEFT COLUMN: Sticky Header & Visual */}
        <div className="lg:w-1/3 flex flex-col justify-between h-auto lg:h-[80vh] lg:sticky lg:top-24">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm tracking-widest opacity-60">
                /// 01. PROFILE
              </span>
              <div
                className="h-[1px] flex-grow opacity-20"
                style={{ backgroundColor: textColor }}
              ></div>
            </div>

            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
              Who <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `1px ${textColor}`,
                  opacity: 0.7,
                }}
              >
                I Am
              </span>
            </h2>

            {/* The "Mind" Visualization - CSS Wireframe Sphere */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mt-8 opacity-80">
              <div
                className="absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-20"
                style={{ borderColor: accentColor }}
              ></div>
              <div
                className="absolute inset-4 rounded-full border border-dotted animate-spin-reverse-slow opacity-40"
                style={{ borderColor: textColor }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: accentColor }}
                ></div>
              </div>
              {/* Floating Code Snippet Effect */}
              <div
                className="absolute -right-10 top-1/2 p-2 rounded bg-black/50 backdrop-blur-md border text-[10px] font-mono opacity-60"
                style={{ borderColor: `${accentColor}40`, color: accentColor }}
              >
                {`{ status: "online" }`}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div
              className="text-xs font-mono opacity-40 tracking-widest rotate-180"
              style={{ writingMode: "vertical-rl" }}
            >
              SCROLL TO DECRYPT DATA
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content Stream */}
        <div className="lg:w-2/3 pt-4 lg:pt-0">
          {/* The Manifesto / Bio */}
          <div
            className={`transition-all duration-1000 ease-out mb-20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
          >
            <p className="text-xl md:text-3xl font-light leading-relaxed">
              I am a{" "}
              <span className="font-semibold" style={{ color: accentColor }}>
                Full-Stack Engineer
              </span>{" "}
              obsessed with the intersection of design and logic.
            </p>
            <p className="mt-6 text-lg md:text-xl opacity-70 leading-relaxed font-light">
              While others see code as just syntax, I see it as the raw material
              for digital architecture. I don't just build applications; I craft{" "}
              <strong className="text-white">resilient ecosystems</strong> where
              AI meets intuitive human interfaces. My goal is to transform
              complex technical requirements into seamless, elegant user
              experiences.
            </p>

            <div className="mt-8 flex flex-wrap gap-8">
              {[
                { label: "Experience", val: "4+ Years" },
                { label: "Projects", val: "30+ Delivered" },
                { label: "Coffee", val: "∞ Consumed" },
              ].map((stat, i) => (
                <div key={i}>
                  <div
                    className="text-3xl font-bold font-mono"
                    style={{ color: textColor }}
                  >
                    {stat.val}
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-50 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The "System Modules" (Skills Accordion) */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8 opacity-50">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              ></div>
              <span className="font-mono text-xs tracking-widest uppercase">
                System Capabilities / Tech Stack
              </span>
            </div>

            <div className="space-y-4">
              {skillModules.map((module, index) => (
                <div
                  key={module.id}
                  className="group relative border-b last:border-0 pb-4 transition-all duration-300"
                  style={{ borderColor: `${textColor}15` }}
                  onMouseEnter={() => setActiveModule(index)}
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between cursor-pointer py-4">
                    <div className="flex items-baseline gap-6">
                      <span
                        className="font-mono text-sm opacity-30 group-hover:opacity-100 transition-opacity"
                        style={{
                          color:
                            activeModule === index ? accentColor : textColor,
                        }}
                      >
                        /{module.id}
                      </span>
                      <h3
                        className={`text-2xl md:text-3xl font-bold transition-all duration-300 ${activeModule === index ? "translate-x-2" : ""}`}
                        style={{
                          color:
                            activeModule === index ? accentColor : textColor,
                        }}
                      >
                        {module.name}
                      </h3>
                    </div>
                    {/* Arrow Indicator */}
                    <span
                      className={`text-2xl transition-transform duration-300 ${activeModule === index ? "rotate-45" : ""}`}
                      style={{
                        color:
                          activeModule === index
                            ? accentColor
                            : `${textColor}40`,
                      }}
                    >
                      ↗
                    </span>
                  </div>

                  {/* Module Content (Expanded) */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${activeModule === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="pl-12 pt-2 pb-6">
                      <p className="text-sm md:text-base opacity-70 mb-4 max-w-lg">
                        {module.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {module.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs md:text-sm font-mono border rounded-full"
                            style={{
                              borderColor: `${textColor}20`,
                              backgroundColor: `${textColor}05`,
                              color: textColor,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
