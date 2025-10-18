import { useState, useEffect, useRef } from "react";
import BackgroundGrid from "../BackgroundGrid";

const About = ({ accentColor, mainBgColor, textColor, isDarkTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeTab, setActiveTab] = useState("bio");
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills = [
    { name: "React", level: 90, icon: "⚛️" },
    { name: "JavaScript", level: 85, icon: "🟨" },
    { name: "Node.js", level: 85, icon: "🟢" },
    { name: "Python", level: 80, icon: "🐍" },
    { name: "Swift", level: 75, icon: "🍎" },
    { name: "Java", level: 75, icon: "☕" },
    { name: "C++", level: 70, icon: "⚙️" },
    { name: "C", level: 70, icon: "🔧" },
  ];

  const interests = [
    {
      icon: "🤖",
      title: "AI & ML",
      description: "Machine learning & neural networks",
    },
    {
      icon: "🌐",
      title: "Open Source",
      description: "Contributing to community projects",
    },
    {
      icon: "📚",
      title: "Tech Learning",
      description: "Latest and greatest in tech space",
    },
    {
      icon: "🎬",
      title: "Movies",
      description: "New movies and series",
    },
  ];

  const stats = [
    { number: "Full Stack", label: "Developer" },
    { number: "AI/ML", label: "Enthusiast" },
    { number: "App Dev", label: "Specialist" },
    { number: "Online", label: "Status" },
  ];

  const tabs = {
    bio: {
      title: "BIO",
      content:
        "Full-stack and native application developer with a passion for AI and machine learning. I build websites and applications that combines elegant design with powerful functionality.",
    },
    focus: {
      title: "FOCUS AREAS",
      content:
        "Web Development | UI/UX Design | App Development | AI/ML | Full Stack Solutions",
    },
    interests: {
      title: "INTERESTS",
      content: "AI, Open Source Development, Learning New Technologies, Movies",
    },
  };

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen relative scrollbar-hide"
      style={{ backgroundColor: mainBgColor }}
    >
      <BackgroundGrid
        accentColor={accentColor}
        isDarkTheme={isDarkTheme}
        opacity={0.05}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 relative z-10">
        {/* Section Header */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono" style={{ color: accentColor }}>
              01.
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight"
              style={{ color: textColor }}
            >
              About Me
            </h2>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Profile Card */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div
              className="p-5 sm:p-6 rounded-2xl backdrop-blur-sm h-full"
              style={{
                backgroundColor: isDarkTheme
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${
                  isDarkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
              }}
            >
              <div
                className="text-xs opacity-50 mb-4 font-mono"
                style={{ color: accentColor }}
              >
                {">"} executing profile.sh
              </div>

              <div className="relative mb-6">
                <div
                  className="w-24 h-24 mx-auto rounded-full overflow-hidden relative flex items-center justify-center"
                  style={{
                    backgroundColor: `${accentColor}20`,
                  }}
                >
                  <span className="text-5xl opacity-80">👨‍💻</span>
                </div>
                <div
                  className="absolute bottom-1 right-1/3 sm:right-1/2 sm:translate-x-[60px] w-4 h-4 bg-green-500 rounded-full border-4 animate-pulse"
                  style={{ borderColor: mainBgColor }}
                />
              </div>

              <div className="text-center mb-6">
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: textColor }}
                >
                  Suraj Adhikari
                </h3>
                <p
                  className="text-sm uppercase tracking-widest mb-1"
                  style={{ color: accentColor }}
                >
                  Developer
                </p>
                <p
                  className="text-xs opacity-60 font-mono"
                  style={{ color: textColor }}
                >
                  @SurajAdhikari01
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-mono"
                    style={{ color: accentColor }}
                  >
                    NAME:
                  </span>
                  <span className="text-sm" style={{ color: textColor }}>
                    Suraj Adhikari
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-mono"
                    style={{ color: accentColor }}
                  >
                    ROLE:
                  </span>
                  <span className="text-sm" style={{ color: textColor }}>
                    Developer
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-mono"
                    style={{ color: accentColor }}
                  >
                    FOCUS:
                  </span>
                  <span
                    className="text-sm text-right"
                    style={{ color: textColor }}
                  >
                    Full Stack, AI, App Dev
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-mono"
                    style={{ color: accentColor }}
                  >
                    STATUS:
                  </span>
                  <span
                    className="text-sm animate-pulse"
                    style={{ color: "#10B981" }}
                  >
                    ONLINE
                  </span>
                </div>
              </div>

              <div
                className="flex justify-center gap-2 pt-4 border-t"
                style={{
                  borderColor: isDarkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
              >
                {[
                  {
                    icon: "💼",
                    href: "https://linkedin.com/in/SurajAdhikari01",
                  },
                  { icon: "📧", href: "mailto:contact@suraj.dev" },
                  { icon: "🐙", href: "https://github.com/SurajAdhikari01" },
                  { icon: "🐦", href: "https://twitter.com/SurajAdhikari01" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    style={{
                      backgroundColor: isDarkTheme
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                      border: `1px solid ${
                        isDarkTheme
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                    }}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Tabbed Content */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Tabs */}
            <div
              className="flex mb-4 p-1 rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: isDarkTheme
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${
                  isDarkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
              }}
            >
              {Object.keys(tabs).map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-mono rounded-lg transition-all duration-300 ${
                    activeTab === tab
                      ? "scale-105"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === tab ? accentColor : "transparent",
                    color:
                      activeTab === tab
                        ? isDarkTheme
                          ? "#000"
                          : "#fff"
                        : textColor,
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabs[tab].title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              className="p-5 sm:p-6 rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: isDarkTheme
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${
                  isDarkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="text-xs opacity-50 ml-2 font-mono"
                  style={{ color: textColor }}
                >
                  {tabs[activeTab].title.toLowerCase()}.dat
                </div>
              </div>

              <div style={{ color: textColor }}>
                <p className="text-sm leading-relaxed mb-4">
                  {tabs[activeTab].content}
                </p>

                {activeTab === "focus" && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-6">
                    {[
                      "React",
                      "Node.js",
                      "Python",
                      "Swift",
                      "Java",
                      "JavaScript",
                      "C++",
                      "C",
                    ].map((skill) => (
                      <div
                        key={skill}
                        className="p-3 rounded-lg text-center text-sm transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: `${accentColor}15`,
                          border: `1px solid ${accentColor}30`,
                          color: accentColor,
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "bio" && (
                  <div
                    className="mt-6 pt-4 border-t"
                    style={{
                      borderColor: isDarkTheme
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      className="text-sm italic opacity-70"
                      style={{ color: textColor }}
                    >
                      "Exploring the intersection of web development,
                      applications and artificial intelligence to build
                      meaningful software"
                    </div>
                  </div>
                )}

                {activeTab === "interests" && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {interests.map((interest, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: isDarkTheme
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.03)",
                          border: `1px solid ${
                            isDarkTheme
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)"
                          }`,
                        }}
                      >
                        <div className="text-2xl mb-2">{interest.icon}</div>
                        <div
                          className="text-sm font-semibold mb-1"
                          style={{ color: accentColor }}
                        >
                          {interest.title}
                        </div>
                        <div
                          className="text-xs opacity-70"
                          style={{ color: textColor }}
                        >
                          {interest.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              style={{
                backgroundColor: isDarkTheme
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${
                  isDarkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
              }}
            >
              <div
                className="text-base sm:text-lg font-bold mb-1"
                style={{ color: accentColor }}
              >
                {stat.number}
              </div>
              <div
                className="text-xs uppercase tracking-wider opacity-70"
                style={{ color: textColor }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
