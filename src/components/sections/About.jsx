import React from "react";
import { motion } from "framer-motion";
import { Code, Server, Brain, Smartphone } from "lucide-react";
import profileimage from "../../assets/newimage.png";

const About = ({
  accentColor = "#00f0ff",
  mainBgColor = "#050505",
  textColor = "#ffffff",
}) => {
  const skills = [
    { label: "Frontend", icon: Code, tools: ["React", "Next.js", "Three.js"] },
    {
      label: "Backend",
      icon: Server,
      tools: ["Node.js", "PostgreSQL", "Docker"],
    },
    {
      label: "Intelligence",
      icon: Brain,
      tools: ["TensorFlow", "LangChain", "OpenAI"],
    },
    {
      label: "Mobile",
      icon: Smartphone,
      tools: ["Expo", "Swift"],
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full min-h-screen py-32 px-6 md:px-12 lg:px-24 flex items-center overflow-hidden"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* 2. BACKGROUND 01 ANCHOR */}
      <div className="absolute top-10 right-10 select-none pointer-events-none z-0">
        <span className="text-[20rem] font-black opacity-[0.03] italic leading-none">
          01
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* IMAGE BLOCK: Columns 1-5 */}
        <div className="lg:col-span-5 relative group">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* The Main Image Container */}
            <div className="relative z-10 aspect-[4/5] w-full overflow-hidden border border-white/10  hover:grayscale-0 transition-all duration-1000 ease-in-out">
              <img
                src={profileimage}
                alt="Suraj Adhikari"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
              />
              {/* Scanline Effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))`,
                  backgroundSize: "100% 2px, 3px 100%",
                }}
              />
            </div>

            {/* Geometric Floating Frame (Brutalist Style) */}
            <div
              className="absolute -top-6 -right-6 w-full h-full border-2 z-0 translate-x-3 translate-y-3 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0"
              style={{ borderColor: accentColor }}
            />

            {/* Corner Markers */}
            <div
              className="absolute -bottom-4 -left-4 w-12 h-12 border-l-2 border-b-2"
              style={{ borderColor: accentColor }}
            />
          </motion.div>
        </div>

        {/* CONTENT BLOCK: Columns 7-12 */}
        <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Minimal Header */}
            <div className="flex items-center gap-6 mb-12">
              <div
                className="h-[2px] w-16"
                style={{ backgroundColor: accentColor }}
              />
              <span className="font-mono text-xs tracking-[0.5em] uppercase opacity-40">
                About me
              </span>
            </div>

            <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-10">
              Software
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `1.5px ${textColor}`,
                }}
                className="opacity-50"
              >
                Engineer
              </span>
            </h2>

            <p
              className="text-xl opacity-50 font-light leading-relaxed mb-16 border-l-2 pl-8"
              style={{ borderColor: `${accentColor}40` }}
            >
              Synthesizing complex logic into elegant digital experiences. I
              don't just build software; I engineer systems that live at the
              intersection of performance and visual impact.
            </p>

            {/* STATS MATRIX */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-20">
              {[
                { label: "Systems Built", value: "10+" },
                { label: "Experience", value: "04Y" },
                { label: "Stack", value: "Full" },
              ].map((stat, i) => (
                <div key={i} className="relative group">
                  <div
                    className="text-4xl font-black italic group-hover:not-italic transition-all"
                    style={{ color: textColor }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 mt-2">
                    {stat.label}
                  </div>
                  <div
                    className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              ))}
            </div>

            {/* TECH CATEGORIES */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="border-t border-white/10 pt-6 group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <skill.icon
                        className="w-4 h-4"
                        style={{ color: accentColor }}
                      />
                      <span className="font-mono text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100">
                        {skill.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {skill.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-sm font-light opacity-40 group-hover:opacity-100 transition-opacity"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. DECORATIVE DATA LINE */}
      <div className="absolute bottom-10 left-10 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default About;
