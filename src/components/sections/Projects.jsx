import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Projects = ({
  accentColor = "#00f0ff",
  mainBgColor = "#0a0a0a",
  textColor = "#ffffff",
  isDarkTheme = true,
}) => {
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const GITHUB_USERNAME = "SurajAdhikari01";
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  // Animation Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch Logic (Simplified for brevity, assuming your GraphQL helper)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch logic here... (using your existing axios/graphql logic)
        // Mocking structure for the visual update:
        const mockProjects = [
          {
            id: 1,
            title: "NeuralEngine V2",
            description:
              "High-performance ML inference wrapper for edge devices.",
            stars: 124,
            forks: 12,
            tags: ["C++", "Python"],
            github: "#",
          },
          {
            id: 2,
            title: "AuraUI",
            description:
              "A design system focused on glassmorphism and spatial awareness.",
            stars: 89,
            forks: 5,
            tags: ["React", "Three.js"],
            github: "#",
          },
          {
            id: 3,
            title: "SkyNet-Sentinel",
            description:
              "Automated security auditing tool for cloud-native applications.",
            stars: 45,
            forks: 8,
            tags: ["Go", "AWS"],
            github: "#",
          },
        ];
        setProjects(mockProjects);

        const activityRes = await axios.get(
          `https://api.github.com/users/${GITHUB_USERNAME}/events/public`,
        );
        setActivity(activityRes.data.slice(0, 6));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* Background Decorative Element: Large Vertical Text */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[15rem] font-black opacity-[0.02] select-none pointer-events-none rotate-90 origin-right">
        REPOSITORIES
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header: Minimalist & Clean */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0 translate-x-[-20px]"}`}
          >
            <span
              className="font-mono text-xs tracking-[0.3em] uppercase opacity-50 mb-2 block"
              style={{ color: accentColor }}
            >
              Section 02 // Production
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Featured <br />{" "}
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `1px ${textColor}`,
                }}
              >
                Deployment
              </span>
            </h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs opacity-40 max-w-[200px]">
              SYNCING WITH GITHUB_API_V4...
            </p>
            <div className="w-full h-1 mt-2 bg-current opacity-10 relative">
              <div
                className="absolute top-0 left-0 h-full animate-progress"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Project Masonry (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className={`group relative flex flex-col md:flex-row gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                {/* Visual Index */}
                <div
                  className="hidden md:block font-mono text-4xl opacity-10 group-hover:opacity-100 transition-opacity"
                  style={{ color: accentColor }}
                >
                  0{idx + 1}
                </div>

                <div
                  className="flex-1 border-l-2 pl-8 transition-all group-hover:border-current"
                  style={{ borderColor: `${textColor}20` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-3xl font-bold tracking-tight group-hover:italic transition-all">
                      {project.title}
                    </h3>
                    <div className="flex gap-4 font-mono text-xs opacity-60">
                      <span>STARS: {project.stars}</span>
                      <span>FORKS: {project.forks}</span>
                    </div>
                  </div>

                  <p className="text-lg opacity-60 font-light mb-6 max-w-xl">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-widest uppercase px-2 py-1 border border-current opacity-40 group-hover:opacity-100 transition-opacity"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-6">
                    <a
                      href={project.github}
                      className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 transition-all hover:pr-4"
                      style={{ borderColor: accentColor }}
                    >
                      View Source
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Terminal Activity Stream (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-6 border border-white/10 rounded-sm bg-white/[0.02] backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
                <span className="font-mono text-[10px] opacity-40 ml-2 uppercase tracking-tighter">
                  Live_Activity_Monitor.exe
                </span>
              </div>

              <div className="space-y-6">
                {activity.map((event, i) => (
                  <div
                    key={i}
                    className="group/item relative pl-4 border-l border-white/5 hover:border-accent transition-colors"
                    style={{ "--accent": accentColor }}
                  >
                    <p className="text-xs font-mono leading-relaxed opacity-80">
                      <span className="opacity-30">
                        [{new Date(event.created_at).toLocaleTimeString()}]
                      </span>{" "}
                      <br />
                      <span style={{ color: accentColor }}>
                        {event.actor.login}
                      </span>{" "}
                      pushed to{" "}
                      <span className="text-white">
                        {event.repo.name.split("/")[1]}
                      </span>
                    </p>
                    <div
                      className="h-0.5 w-0 group-hover/item:w-full transition-all duration-500 mt-1"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                  </div>
                ))}
              </div>

              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                className="block mt-8 text-center font-mono text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity border-t border-white/10 pt-4"
              >
                Full System Log →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
