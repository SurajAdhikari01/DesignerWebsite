import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  GitBranch,
  Star,
  Code2,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";

const GITHUB_USERNAME = "SurajAdhikari01";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// 1. Primary Strategy: GraphQL for Pinned Repos (Requires Valid Token)
// Fetch pinned repos via GitHub GraphQL API
const fetchPinnedRepos = async (username, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 4, types: REPOSITORY) {
          nodes {
            ... on Repository {
              id
              name
              description
              url
              homepageUrl
              openGraphImageUrl
              pushedAt
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { login: username };
  const response = await axios.post(
    "https://api.github.com/graphql",
    { query, variables },
    { headers },
  );

  // Filter out forks just in case (shouldn't be pinned anyway)
  return (
    response.data.data.user.pinnedItems.nodes.filter((repo) => !repo.isFork) ||
    []
  );
};

// 2. Fallback Strategy: REST API for Top Repos (No Token Required)
const fetchTopRepos = async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
    );

    // Sort by stars descending to prioritize best work
    const sorted = response.data.sort(
      (a, b) => b.stargazers_count - a.stargazers_count,
    );

    // Map to GraphQL structure for compatibility
    return sorted.slice(0, 6).map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      homepageUrl: repo.homepage,
      openGraphImageUrl: null,
      pushedAt: repo.pushed_at,
      stargazerCount: repo.stargazers_count,
      forkCount: repo.forks_count,
      languages: {
        nodes: repo.language ? [{ name: repo.language }] : [],
      },
    }));
  } catch (error) {
    console.warn("REST API Error:", error);
    return [];
  }
};

const Projects = ({
  accentColor = "#00f0ff",
  mainBgColor = "#0a0a0a",
  textColor = "#ffffff",
  isDarkTheme = true,
}) => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      let repoData = [];
      let success = false;

      // Attempt 1: Pinned Repos (GraphQL)
      if (GITHUB_TOKEN) {
        try {
          console.log("Attempting to fetch pinned repos...");
          repoData = await fetchPinnedRepos(GITHUB_USERNAME, GITHUB_TOKEN);
          success = true;
        } catch (err) {
          console.warn(
            "GraphQL Fetch Failed (likely invalid token). Falling back to REST API.",
            err.message,
          );
        }
      } else {
        console.log("No GitHub token found. Skipping GraphQL.");
      }

      // Attempt 2: Top Repos (REST) - Only if GraphQL failed
      if (!success) {
        try {
          console.log("Attempting to fetch top public repos (REST)...");
          repoData = await fetchTopRepos(GITHUB_USERNAME);
          success = true;
        } catch (err) {
          console.warn("REST API Fetch Failed.", err.message);
        }
      }

      // Attempt 3: Static Fallback Data (If both APIs fail)
      if (!success || repoData.length === 0) {
        console.warn("Using static fallback data.");
        setProjects([
          {
            id: 1,
            title: "NeuralEngine V2",
            description:
              "High-performance ML inference wrapper for edge devices (Static Data).",
            stats: { stars: 124, forks: 12 },
            tags: ["C++", "Python", "CUDA"],
            link: "https://github.com/SurajAdhikari01",
          },
          {
            id: 2,
            title: "AuraUI System",
            description:
              "A design system focused on glassmorphism and spatial awareness.",
            stats: { stars: 89, forks: 5 },
            tags: ["React", "Three.js", "Tailwind"],
            link: "https://github.com/SurajAdhikari01",
          },
          {
            id: 3,
            title: "SkyNet Sentinel",
            description:
              "Automated security auditing tool for cloud-native applications.",
            stats: { stars: 45, forks: 8 },
            tags: ["Go", "AWS", "gRPC"],
            link: "https://github.com/SurajAdhikari01",
          },
          {
            id: 4,
            title: "Quantum Ledger",
            description:
              "Decentralized finance dashboard with real-time analytics.",
            stats: { stars: 210, forks: 34 },
            tags: ["Solidity", "Next.js", "Ethers.js"],
            link: "https://github.com/SurajAdhikari01",
          },
        ]);
      } else {
        // Success! Map the data (works for both GraphQL and REST structures)
        const detailedRepos = repoData.map((repo) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description,
          tags: repo.languages.nodes
            .filter((l) => l && l.name)
            .map((lang) => lang.name),
          link: repo.url,
          homepage: repo.homepageUrl,
          image: repo.openGraphImageUrl,
          stats: {
            stars: repo.stargazerCount,
            forks: repo.forkCount,
          },
        }));
        setProjects(detailedRepos);
      }

      setLoading(false);
    };
    loadRepos();
  }, []);

  return (
    <section
      id="projects"
      className="relative w-full min-h-screen py-24 px-6 md:px-12 lg:px-24 overflow-hidden selection:bg-white selection:text-black"
      style={{ backgroundColor: mainBgColor, color: textColor }}
    >
      {/* 1. Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: "",
        }}
      />
      {/* 1. MASSIVE BACKGROUND "02" - Anchors the bottom left */}
      <div className="absolute -bottom-24 -left-16 select-none pointer-events-none z-0">
        <span
          className="text-[30rem] md:text-[45rem] font-black leading-none opacity-[0.03] italic tracking-tighter"
          style={{ color: textColor }}
        >
          02
        </span>
      </div>
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* LEFT COLUMN: Sticky Header & Description */}
        <div className="lg:w-1/3 flex flex-col h-auto lg:h-[80vh] lg:sticky lg:top-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-6 mb-12">
              <div
                className="h-[2px] w-16"
                style={{ backgroundColor: accentColor }}
              />
              <span className="font-mono text-xs tracking-[0.5em] uppercase opacity-40">
                Works
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
              Selected <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px " + textColor,
                  opacity: 0.7,
                }}
              >
                Projects
              </span>
            </h2>

            <p className="text-lg opacity-70 leading-relaxed max-w-md mb-12">
              A curated collection of digital experiments, engineering
              challenges, and production-ready applications. Each project
              represents a step forward in exploring the intersection of design
              and technology.
            </p>

            <motion.a
              href="https://github.com/SurajAdhikari01"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-6 py-3 border border-opacity-20 rounded-full w-fit group"
              style={{ borderColor: textColor }}
            >
              <span className="font-mono text-sm uppercase tracking-wider">
                View All Repositories
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Project Grid */}
        <div className="lg:w-2/3 flex flex-col gap-8 lg:mt-24">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="font-mono text-sm animate-pulse opacity-50">
                Loading...
              </div>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div
                    className="relative p-8 md:p-10 rounded-2xl border transition-all duration-500 overflow-hidden"
                    style={{
                      backgroundColor: isDarkTheme
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                      borderColor:
                        hoveredProject === project.id
                          ? accentColor
                          : isDarkTheme
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Hover Gradient Background */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      style={{
                        background:
                          "radial-gradient(circle at center, " +
                          accentColor +
                          "20, transparent 70%)",
                      }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <Code2
                            className="w-6 h-6 opacity-50"
                            style={{ color: accentColor }}
                          />
                          <h3 className="text-2xl font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                            {project.title}
                          </h3>
                        </div>

                        <p className="opacity-70 mb-6 leading-relaxed max-w-lg">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full border"
                              style={{
                                borderColor: isDarkTheme
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.1)",
                                color:
                                  hoveredProject === project.id
                                    ? accentColor
                                    : textColor,
                                opacity: 0.8,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 md:flex-col md:gap-4 md:items-end opacity-60 font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>{project.stats.stars}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4" />
                          <span>{project.stats.forks}</span>
                        </div>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                      <ArrowUpRight
                        className="w-6 h-6"
                        style={{ color: accentColor }}
                      />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
