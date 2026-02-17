import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact = ({
  accentColor = "#00f0ff",
  mainBgColor = "#0a0a0a",
  textColor = "#ffffff",
  isDarkTheme = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });
  const [activeField, setActiveField] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState([
    { text: "> initializing secure uplink...", type: "system" },
    { text: "> node: suraj_adhikari_main_v4", type: "system" },
    { text: "> status: listening for packets", type: "success" },
  ]);

  const sectionRef = useRef(null);
  const terminalRef = useRef(null);

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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const logToTerminal = (text, type = "system") => {
    setTerminalOutput((prev) => [...prev, { text: `> ${text}`, type }]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.length % 10 === 0 && value.length > 0) {
      logToTerminal(`buffering ${name} data...`, "input");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logToTerminal("attempting handshake with mail server...", "system");
    setFormStatus({
      submitted: true,
      success: false,
      message: "Transmitting...",
    });

    // Assuming EmailJS is configured as in your original snippet
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: "Transmission Success",
      });
      logToTerminal("packet received. secure connection closed.", "success");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* Background Graphic: Giant '03' */}
      <div className="absolute left-0 bottom-0 text-[20rem] font-black opacity-[0.03] select-none pointer-events-none -translate-x-1/4 translate-y-1/4">
        03
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div
          className={`mb-20 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="h-[2px] w-12"
              style={{ backgroundColor: accentColor }}
            ></div>
            <span className="font-mono text-xs tracking-widest uppercase opacity-60">
              Transmission Interface
            </span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Drop a <br />
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: `1px ${textColor}`,
              }}
            >
              Signal
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* FORM: Left Side (7 cols) */}
          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {[
                {
                  id: "name",
                  label: "Identity",
                  type: "text",
                  placeholder: "Your Name",
                },
                {
                  id: "email",
                  label: "Return Path",
                  type: "email",
                  placeholder: "your@email.com",
                },
              ].map((field) => (
                <div key={field.id} className="group relative">
                  <label
                    className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-2 block group-focus-within:opacity-100 transition-opacity"
                    style={{
                      color: activeField === field.id ? accentColor : textColor,
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    onFocus={() => setActiveField(field.id)}
                    onBlur={() => setActiveField(null)}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent border-b border-white/10 py-4 outline-none text-xl font-light focus:border-white transition-all placeholder:opacity-20"
                    required
                  />
                  <div
                    className="absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 w-0 group-focus-within:w-full"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                </div>
              ))}

              <div className="group relative">
                <label className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-2 block group-focus-within:opacity-100">
                  The Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/[0.03] border border-white/10 p-6 outline-none text-xl font-light focus:border-white/30 transition-all min-h-[200px] placeholder:opacity-20"
                  required
                />
              </div>

              <button
                type="submit"
                className="relative overflow-hidden group px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs transition-all hover:bg-transparent hover:text-white border border-white"
              >
                <span className="relative z-10">
                  {formStatus.message || "Initiate Transfer"}
                </span>
                <div className="absolute inset-0 bg-white group-hover:translate-y-full transition-transform duration-300"></div>
              </button>
            </form>
          </div>

          {/* ASIDE: Right Side (5 cols) */}
          <div
            className={`lg:col-span-5 space-y-12 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            {/* Terminal Window */}
            <div className="bg-black/40 border border-white/5 backdrop-blur-2xl rounded-lg p-6 font-mono text-xs">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <span className="opacity-40 uppercase tracking-tighter text-[9px]">
                  Uplink_Monitor.log
                </span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div
                ref={terminalRef}
                className="h-40 overflow-y-auto space-y-2 opacity-80"
              >
                {terminalOutput.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.type === "error"
                        ? "text-red-400"
                        : line.type === "success"
                          ? "text-green-400"
                          : ""
                    }
                    style={{
                      color: line.type === "success" ? accentColor : "",
                    }}
                  >
                    {line.text}
                  </div>
                ))}
                <div className="animate-pulse">_</div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "GitHub", handle: "@SurajAdhikari01", color: "#333" },
                {
                  name: "LinkedIn",
                  handle: "suraj-adhikari",
                  color: "#0077b5",
                },
                { name: "Twitter", handle: "@savvyaye", color: "#1da1f2" },
                { name: "Email", handle: "icloud.com", color: accentColor },
              ].map((link) => (
                <a
                  key={link.name}
                  href="#"
                  className="group relative p-6 border border-white/10 overflow-hidden transition-all hover:border-white/30"
                >
                  <div
                    className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10"
                    style={{ backgroundColor: link.color }}
                  ></div>
                  <div className="relative z-10">
                    <div className="text-[10px] font-mono opacity-40 uppercase mb-1">
                      {link.name}
                    </div>
                    <div className="text-xs font-bold tracking-tight">
                      {link.handle}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-8 opacity-20 text-[10px] font-mono leading-relaxed">
              * ALL DATA TRANSMISSIONS ARE ENCRYPTED <br />
              * RESPONSE TIME: &lt; 24 HOURS <br />* LOCATION: POKHARA, NP
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
