import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  CheckCircle,
  Loader2,
  Terminal as TerminalIcon,
} from "lucide-react";

const Contact = ({
  accentColor = "#00f0ff",
  mainBgColor = "#050505",
  textColor = "#ffffff",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle"); // idle, sending, success
  const [logs, setLogs] = useState(["> system_ready", "> awaiting_uplink"]);

  const addLog = (msg) => setLogs((prev) => [...prev.slice(-4), `> ${msg}`]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("sending");
    addLog("initializing_handshake...");

    setTimeout(() => {
      addLog("packet_encryption_verified");
      setTimeout(() => {
        addLog("transmission_complete");
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setFormStatus("idle"), 5000);
      }, 1000);
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen py-32 px-6 md:px-12 lg:px-24 flex items-center overflow-hidden"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* 1. MASSIVE BACKGROUND TEXT "SIGNAL" */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-[40%] rotate-90 select-none pointer-events-none z-0">
        <span
          className="text-[12rem] md:text-[12rem] font-black uppercase leading-none tracking-tighter opacity-[0.12] italic"
          style={{ WebkitTextStroke: `2px ${textColor}`, color: "transparent" }}
        >
          IDEAS?
        </span>
      </div>

      {/* 2. BACKGROUND 03 ANCHOR */}
      <div className="absolute -bottom-20 -right-20 select-none pointer-events-none z-0">
        <span className="text-[35rem] font-black opacity-[0.02] italic leading-none">
          03
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        {/* LEFT COLUMN: Header & Terminal */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-6 mb-12">
              <div
                className="h-[2px] w-16"
                style={{ backgroundColor: accentColor }}
              />
              <span className="font-mono text-xs tracking-[0.5em] uppercase opacity-40">
                Contact me
              </span>
            </div>

            <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
              Get In
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `1.5px ${textColor}`,
                }}
                className="opacity-50"
              >
                Touch
              </span>
            </h2>

            {/* LIVE SYSTEM CONSOLE */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-sm font-mono text-[10px] uppercase tracking-widest mb-12 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 opacity-40">
                <TerminalIcon size={12} />
                <span>Communication_Logs</span>
              </div>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      i === logs.length - 1 ? "text-cyan-400" : "opacity-40"
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
              {/* Decorative scanning line */}
              <div className="absolute inset-0 pointer-events-none animate-pulse bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-1/2 w-full" />
            </div>

            <div className="space-y-2 group cursor-pointer w-fit">
              <div className="text-xs font-mono opacity-30 uppercase tracking-[0.3em]">
                Direct_Route
              </div>
              <a
                href="mailto:surajadhikari.0042@gmail.com"
                className="text-2xl font-bold hover:italic transition-all"
              >
                surajadhikari.0042@gmail.com
              </a>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className="lg:col-span-7 flex items-center">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full relative"
          >
            {/* Form Background Box with Cut Corners Style */}
            <div className="bg-white/[0.02] border border-white/10 p-8 md:p-16 relative">
              {/* Corner Accents */}
              <div
                className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
                style={{ borderColor: accentColor }}
              />
              <div
                className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
                style={{ borderColor: accentColor }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-cyan-400 transition-colors peer placeholder-transparent"
                    placeholder="Name"
                  />
                  <label className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] opacity-30 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-[10px] transition-all">
                    01 _ Identity
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-cyan-400 transition-colors peer placeholder-transparent"
                    placeholder="Email"
                  />
                  <label className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] opacity-30 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-[10px] transition-all">
                    02 _ Signal_Source
                  </label>
                </div>
              </div>

              <div className="relative group mb-16">
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-cyan-400 transition-colors peer placeholder-transparent resize-none"
                  placeholder="Message"
                />
                <label className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] opacity-30 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-[10px] transition-all">
                  03 _ Payload
                </label>
              </div>

              <button
                type="submit"
                disabled={formStatus !== "idle"}
                className="w-full group py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-cyan-400 transition-colors disabled:opacity-50"
                style={{
                  backgroundColor:
                    formStatus === "success"
                      ? "#22c55e"
                      : formStatus === "sending"
                        ? accentColor
                        : "#ffffff",
                }}
              >
                {formStatus === "idle" && (
                  <>
                    <span>Initiate Transmission</span>
                    <Send
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </>
                )}
                {formStatus === "sending" && (
                  <Loader2 className="animate-spin" />
                )}
                {formStatus === "success" && (
                  <>
                    <CheckCircle size={18} />
                    <span>Signal Delivered</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
