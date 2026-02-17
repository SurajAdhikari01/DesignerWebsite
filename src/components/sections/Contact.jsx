import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import BackgroundGrid from "../BackgroundGrid";

const Contact = ({ accentColor, mainBgColor, textColor, isDarkTheme }) => {
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

  const sectionRef = useRef(null);
  const terminalRef = useRef(null);

  // EmailJS Configuration
  const SERVICE_ID =
    import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
  const TEMPLATE_ID =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
  const PUBLIC_KEY =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

  // Current timestamp and username
  const currentTimestamp =
    new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const currentUsername = "SurajAdhikari01";

  // Terminal Output
  const [terminalOutput, setTerminalOutput] = useState([
    { text: "system: initialized contact module v2.4.1", type: "system" },
    { text: `system: current timestamp: ${currentTimestamp}`, type: "system" },
    { text: `system: user login: ${currentUsername}`, type: "system" },
    { text: "system: ready to receive transmission.", type: "system" },
  ]);

  const prevFormData = useRef(formData);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (
      prevFormData.current[name] !== value &&
      value.length > 0 &&
      (value.length === 1 || value.length % 15 === 0)
    ) {
      const now = new Date().toISOString().substr(11, 8);
      setTerminalOutput((prev) => [
        ...prev,
        { text: `input: ${now} - ${name} field updated.`, type: "input" },
      ]);
    }
    prevFormData.current = { ...formData, [name]: value };
  };

  const handleFocus = (field) => {
    setActiveField(field);
    setTerminalOutput((prev) => [
      ...prev,
      { text: `system: field '${field}' activated`, type: "system" },
    ]);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setTerminalOutput((prev) => [
        ...prev,
        {
          text: "error: incomplete transmission. all fields required.",
          type: "error",
        },
      ]);
      setFormStatus({ submitted: false, success: false, message: "" });
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setTerminalOutput((prev) => [
        ...prev,
        { text: "error: invalid email format detected.", type: "error" },
      ]);
      setFormStatus({ submitted: false, success: false, message: "" });
      return;
    }

    setTerminalOutput((prev) => [
      ...prev,
      {
        text: "system: processing transmission via EmailJS...",
        type: "system",
      },
    ]);
    setFormStatus({ submitted: true, success: false, message: "Sending..." });

    const emailMessageContent = `Email sent from ${formData.email} saying:\n\n${formData.message}`;

    const templateParams = {
      name: formData.name,
      time: currentTimestamp,
      message: emailMessageContent,
    };

    if (
      SERVICE_ID === "YOUR_SERVICE_ID" ||
      TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
      PUBLIC_KEY === "YOUR_PUBLIC_KEY"
    ) {
      const configErrorMsg = "Configuration error: EmailJS keys missing.";
      setFormStatus({
        submitted: true,
        success: false,
        message: configErrorMsg,
      });
      setTerminalOutput((prev) => [
        ...prev,
        { text: `error: ${configErrorMsg}`, type: "error" },
        { text: "system: please check configuration.", type: "system" },
      ]);
      return;
    }

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        setFormStatus({
          submitted: true,
          success: true,
          message: "Message transmission successful!",
        });
        setTerminalOutput((prev) => [
          ...prev,
          {
            text: `success: message from ${formData.name} relayed via EmailJS.`,
            type: "success",
          },
          { text: "system: transmission complete.", type: "system" },
        ]);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        let specificErrorMsg = "Transmission failed. Please try again.";
        let terminalErrorText = "error: EmailJS transmission failed.";

        if (error && typeof error === "object") {
          if (error.text) {
            specificErrorMsg = `Failed: ${error.text}`;
            terminalErrorText = `error: EmailJS Failed - ${error.text}`;
          } else if (error.message) {
            specificErrorMsg = `Failed: ${error.message}`;
            terminalErrorText = `error: EmailJS Failed - ${error.message}`;
          }
        }

        setFormStatus({
          submitted: true,
          success: false,
          message: specificErrorMsg,
        });
        setTerminalOutput((prev) => [
          ...prev,
          { text: terminalErrorText, type: "error" },
          {
            text: "system: please retry transmission.",
            type: "system",
          },
        ]);
      });
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: "🐙",
      url: "https://github.com/SurajAdhikari01",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      url: "https://www.linkedin.com/in/suraj-adhikari-041667240/",
    },
    {
      name: "Twitter",
      icon: "🐦",
      url: "https://x.com/savvyaye",
    },
    {
      name: "Email",
      icon: "📧",
      url: "mailto:surajadhikari01@icloud.com",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen relative  scrollbar-hide"
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
              03.
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight"
              style={{ color: textColor }}
            >
              Get In Touch
            </h2>
          </div>
          <p className="text-sm opacity-70" style={{ color: textColor }}>
            Reach out for collaboration or just to say hello
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Contact Form */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div
              className="p-4 sm:p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover-lift"
              style={{
                backgroundColor: isDarkTheme
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${
                  isDarkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
                boxShadow: activeField
                  ? `0 0 20px ${accentColor}33`
                  : "none",
              }}
            >
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span
                    className="text-xs font-mono ml-2"
                    style={{ color: accentColor }}
                  >
                    transmit_message.sh
                  </span>
                </div>
                <div
                  className="text-xs font-mono opacity-50 hidden sm:block"
                  style={{ color: textColor }}
                >
                  user: {currentUsername}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    className="block text-sm font-mono mb-2"
                    style={{ color: accentColor }}
                    htmlFor="name"
                  >
                    NAME:
                  </label>
                  <div
                    className={`relative rounded-lg overflow-hidden transition-all duration-300`}
                    style={{
                      backgroundColor: isDarkTheme
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      border: `2px solid ${
                        activeField === "name"
                          ? accentColor
                          : isDarkTheme
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                      boxShadow:
                        activeField === "name"
                          ? `0 0 20px ${accentColor}30`
                          : "none",
                    }}
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("name")}
                      onBlur={handleBlur}
                      className="w-full bg-transparent p-3 outline-none font-mono text-sm"
                      style={{ color: textColor }}
                      placeholder="Enter your name"
                      required
                    />
                    {activeField === "name" && (
                      <div className="absolute top-0 right-0 bottom-0 p-3 flex items-center">
                        <div
                          className="h-2 w-2 rounded-full animate-pulse"
                          style={{ backgroundColor: accentColor }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="block text-sm font-mono mb-2"
                    style={{ color: accentColor }}
                    htmlFor="email"
                  >
                    EMAIL:
                  </label>
                  <div
                    className={`relative rounded-lg overflow-hidden transition-all duration-300`}
                    style={{
                      backgroundColor: isDarkTheme
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      border: `2px solid ${
                        activeField === "email"
                          ? accentColor
                          : isDarkTheme
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                      boxShadow:
                        activeField === "email"
                          ? `0 0 20px ${accentColor}30`
                          : "none",
                    }}
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className="w-full bg-transparent p-3 outline-none font-mono text-sm"
                      style={{ color: textColor }}
                      placeholder="Enter your email"
                      required
                    />
                    {activeField === "email" && (
                      <div className="absolute top-0 right-0 bottom-0 p-3 flex items-center">
                        <div
                          className="h-2 w-2 rounded-full animate-pulse"
                          style={{ backgroundColor: accentColor }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label
                    className="block text-sm font-mono mb-2"
                    style={{ color: accentColor }}
                    htmlFor="message"
                  >
                    MESSAGE:
                  </label>
                  <div
                    className={`relative rounded-lg overflow-hidden transition-all duration-300`}
                    style={{
                      backgroundColor: isDarkTheme
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      border: `2px solid ${
                        activeField === "message"
                          ? accentColor
                          : isDarkTheme
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                      boxShadow:
                        activeField === "message"
                          ? `0 0 20px ${accentColor}30`
                          : "none",
                    }}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("message")}
                      onBlur={handleBlur}
                      className="w-full bg-transparent p-3 outline-none min-h-[100px] sm:min-h-[120px] resize-y font-mono text-sm"
                      style={{ color: textColor }}
                      placeholder="Enter your message"
                      required
                    ></textarea>
                    {activeField === "message" && (
                      <div className="absolute top-3 right-3">
                        <div
                          className="h-2 w-2 rounded-full animate-pulse"
                          style={{ backgroundColor: accentColor }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={
                      formStatus.submitted &&
                      formStatus.message === "Sending..."
                    }
                    className="group px-6 py-3 rounded-lg font-mono text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: accentColor,
                      color: isDarkTheme ? "#000" : "#fff",
                    }}
                  >
                    <span>
                      {formStatus.submitted &&
                      formStatus.message === "Sending..."
                        ? "TRANSMITTING..."
                        : "SEND MESSAGE"}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        formStatus.submitted &&
                        formStatus.message === "Sending..."
                          ? "animate-pulse"
                          : "group-hover:translate-x-1"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>

                  {formStatus.submitted && formStatus.message && (
                    <div
                      className={`text-sm text-center sm:text-left font-mono ${
                        formStatus.success ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formStatus.message}
                    </div>
                  )}
                </div>

                {/* Security Footer */}
                <div
                  className="flex items-center gap-2 pt-4 border-t"
                  style={{
                    borderColor: isDarkTheme
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "#10B981" }}
                  ></div>
                  <span
                    className="text-xs font-mono opacity-60"
                    style={{ color: textColor }}
                  >
                    CONNECTION SECURE | ENCRYPTION: ENABLED
                  </span>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Terminal & Info */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Terminal */}
            <div
              className="p-4 sm:p-6 rounded-2xl backdrop-blur-sm"
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
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: "#10B981" }}
                ></div>
                <span
                  className="text-xs uppercase tracking-wider font-mono"
                  style={{ color: accentColor }}
                >
                  Terminal Connection
                </span>
              </div>

              <div
                ref={terminalRef}
                className="h-48 sm:h-56 lg:h-48 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: `${accentColor}40 transparent`,
                }}
              >
                {terminalOutput.map((line, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                    style={{
                      color:
                        line.type === "system"
                          ? "#60A5FA"
                          : line.type === "error"
                          ? "#EF4444"
                          : line.type === "success"
                          ? "#10B981"
                          : "#FBBF24",
                    }}
                  >
                    <span className="opacity-40">
                      [{index.toString().padStart(3, "0")}]
                    </span>
                    <span>{line.text}</span>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 pt-3 border-t flex items-center gap-2 font-mono text-sm"
                style={{
                  borderColor: isDarkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                  color: accentColor,
                }}
              >
                <span>$</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="p-4 sm:p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover-lift"
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
              <h3
                className="text-sm font-mono mb-4"
                style={{ color: accentColor }}
              >
                COMM CHANNELS
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-110 hover-lift relative overflow-hidden"
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
                    {/* Glow effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${accentColor}15, transparent)`,
                      }}
                    />
                    <span className="text-xl relative z-10 group-hover:scale-125 transition-transform duration-300">
                      {social.icon}
                    </span>
                    <span
                      className="text-sm font-mono relative z-10"
                      style={{ color: textColor }}
                    >
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
