import React from "react";
import { motion } from "framer-motion";
import { Code, Server, Brain, Smartphone } from "lucide-react";

const About = ({
  accentColor = "#00f0ff",
  mainBgColor = "#0a0a0a",
  textColor = "#ffffff",
}) => {
  const skills = [
    {
      label: "Frontend",
      icon: Code,
      tools: ["React", "TypeScript", "Next.js", "Tailwind", "Three.js"],
    },
    {
      label: "Backend",
      icon: Server,
      tools: ["Node.js", "Python", "PostgreSQL", "GraphQL", "Docker"],
    },
    {
      label: "AI / ML",
      icon: Brain,
      tools: ["TensorFlow", "OpenAI", "LangChain", "Hugging Face"],
    },
    {
      label: "Mobile",
      icon: Smartphone,
      tools: ["React Native", "Swift", "Expo"],
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full min-h-screen py-32 px-6 md:px-12 lg:px-24 flex items-center"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* LEFT COLUMN: Sticky Visuals */}
        <div className="lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Clean Profile Image */}
            <div className="relative z-10 w-full aspect-square max-w-md rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <img
                src="https://github.com/SurajAdhikari01.png"
                alt="Suraj Adhikari"
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />

              {/* Minimal Overlay Gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, \${mainBgColor} 0%, transparent 50%)`,
                }}
              />
            </div>

            {/* Decorative Minimal Frame using Accent Color */}
            <div
              className="absolute -inset-4 border-r-2 z-0   opacity-20"
              style={{ borderColor: accentColor }}
            />
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Minimal Typography & Skills */}
        <div className="pt-8 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm tracking-widest opacity-60">
                /// 01. ABOUT
              </span>
              <div
                className="h-[1px] flex-grow opacity-20"
                style={{ backgroundColor: textColor }}
              ></div>
            </div>

            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
              Full-stack <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px " + textColor,
                  opacity: 0.7,
                }}
              >
                Engineer.
              </span>
            </h2>

            <p className="text-lg opacity-60 leading-relaxed mb-12 max-w-xl font-light">
              I seamlessly merge technical logic with design aesthetics. My work
              isn't just about writing code—it's about building resilient,
              user-centric interfaces that feel alive.
            </p>

            {/* Minimal Stats Grid */}
            <div
              className="grid grid-cols-3 gap-8 mb-16 border-t border-b py-8"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              {[
                { label: "Years Exp.", value: "04+" },
                { label: "Projects", value: "30+" },
                { label: "Clients", value: "12+" },
              ].map((stat, i) => (
                <div key={i}>
                  <div
                    className="text-3xl font-mono font-medium"
                    style={{ color: accentColor }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest opacity-40 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Clean Skills Grid */}
            <div className="space-y-10">
              <h3 className="text-sm font-mono uppercase tracking-widest opacity-40 mb-6">
                Technologies
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <skill.icon
                        className="w-5 h-5 opacity-70"
                        style={{ color: accentColor }}
                      />
                      <span className="font-medium text-lg">{skill.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-sm opacity-50 hover:opacity-100 transition-opacity cursor-default"
                        >
                          {tool} <span className="opacity-20 mx-1">/</span>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
