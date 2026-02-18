import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Terminal as TerminalIcon,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import emailjs from "@emailjs/browser";

const Contact = ({
  accentColor = "#00f0ff",
  mainBgColor = "#0a0a0a",
  textColor = "#ffffff",
  isDarkTheme = true,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    status: "idle", // idle, sending, success, error
    message: "",
  });
  const [terminalLogs, setTerminalLogs] = useState([
    { text: "system_ready...", type: "info" },
    { text: "awaiting_user_input", type: "info" },
  ]);

  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const addLog = (text, type = "info") => {
    setTerminalLogs((prev) => [
      ...prev,
      { text, type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({
      status: "sending",
      message: "Initiating transmission protocol...",
    });
    addLog(`encrypting_packet: \${formData.email}\`, "process"`);
    addLog("establishing_uplink...", "process");

    // Simulating email send (replace with actual EmailJS logic if needed)
    setTimeout(() => {
      // Mock success
      setFormStatus({
        status: "success",
        message: "Message transmitted successfully.",
      });
      addLog("transmission_complete", "success");
      addLog("closing_connection", "info");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setFormStatus({ status: "idle", message: "" }), 3000);
    }, 2000);
  };

  const inputStyle = {
    backgroundColor: isDarkTheme
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
    borderColor: isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    color: textColor,
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen py-24 px-6 md:px-12 lg:px-24 overflow-hidden selection:bg-white selection:text-black"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* 1. Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative Grid Lines */}
      <div
        className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] opacity-10 pointer-events-none hidden lg:block"
        style={{ backgroundColor: textColor }}
      ></div>
      <div
        className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] opacity-10 pointer-events-none hidden lg:block"
        style={{ backgroundColor: textColor }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* LEFT COLUMN: Header & Info */}
        <div className="lg:w-1/3 flex flex-col h-auto lg:h-[80vh] lg:sticky lg:top-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm tracking-widest opacity-60">
                /// 03. CONTACT
              </span>
              <div
                className="h-[1px] flex-grow opacity-20"
                style={{ backgroundColor: textColor }}
              ></div>
            </div>

            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
              Let's <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px " + textColor,
                  opacity: 0.7,
                }}
              >
                Connect
              </span>
            </h2>

            <div className="mb-12">
              <div
                className="p-6 rounded-2xl border backdrop-blur-sm bg-opacity-5 relative overflow-hidden group flex items-start gap-6"
                style={{
                  borderColor: isDarkTheme
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                {/* Avatar Addition */}
                <div className="relative shrink-0 hidden md:block">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-opacity-20"
                    style={{ borderColor: accentColor }}
                  >
                    <img
                      src="https://github.com/SurajAdhikari01.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-black"
                    style={{ backgroundColor: "#22c55e" }}
                  ></div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <Mail className="w-4 h-4 opacity-70" />
                    <span className="font-mono text-xs opacity-70 uppercase tracking-wider">
                      Direct Channel
                    </span>
                  </div>
                  <a
                    href="mailto:surajadhikari.0042@example.com"
                    className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity block break-all"
                  >
                    surajadhikari.0042
                    <br />
                    @gmail.com
                  </a>
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className="lg:w-2/3 lg:mt-24">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl border backdrop-blur-xl relative overflow-hidden"
            style={{
              backgroundColor: isDarkTheme
                ? "rgba(255,255,255,0.02)"
                : "rgba(255,255,255,0.5)",
              borderColor: isDarkTheme
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            {/* Decorative Gradient */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full filter blur-[80px] opacity-20 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest opacity-50 ml-1">
                    Identity // Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b-2 py-4 px-2 focus:outline-none transition-all placeholder:opacity-20 text-lg"
                    style={{
                      borderColor: isDarkTheme
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                      caretColor: accentColor,
                    }}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest opacity-50 ml-1">
                    Signal // Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b-2 py-4 px-2 focus:outline-none transition-all placeholder:opacity-20 text-lg"
                    style={{
                      borderColor: isDarkTheme
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                      caretColor: accentColor,
                    }}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest opacity-50 ml-1">
                  Payload // Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-transparent border-b-2 py-4 px-2 focus:outline-none transition-all placeholder:opacity-20 text-lg resize-none"
                  style={{
                    borderColor: isDarkTheme
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                    caretColor: accentColor,
                  }}
                  placeholder="Project details or just saying hello..."
                />
              </div>

              <div className="pt-8 flex items-center justify-between">
                <div className="flex items-center gap-2 opacity-50 text-xs font-mono">
                  {formStatus.status === "idle" && (
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  )}
                  {formStatus.status === "sending" && (
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></div>
                  )}
                  {formStatus.status === "success" && (
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                  <span>STATUS: {formStatus.status.toUpperCase()}</span>
                </div>

                <button
                  type="submit"
                  disabled={
                    formStatus.status === "sending" ||
                    formStatus.status === "success"
                  }
                  className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:grayscale"
                  style={{ backgroundColor: textColor, color: mainBgColor }}
                >
                  {formStatus.status === "sending" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : formStatus.status === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span>
                    {formStatus.status === "sending"
                      ? "Transmitting..."
                      : formStatus.status === "success"
                        ? "Sent"
                        : "Transmit"}
                  </span>
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
