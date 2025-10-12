import { useState, useEffect, useRef } from "react";
import axios from "axios";
import BackgroundGrid from "../BackgroundGrid";

// Helper function to format time
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString();
}

// Helper function to get descriptive activity text
const getActivityDescription = (event, accentColor) => {
  const repoNameStyle = { color: accentColor };

  switch (event.type) {
    case "PushEvent":
      return (
        <>
          Pushed {event.payload.commits.length} commit
          {event.payload.commits.length > 1 ? "s" : ""} to{" "}
          <span style={repoNameStyle}>{event.repo.name}</span>
        </>
      );
    case "PullRequestEvent":
      return (
        <>
          {event.payload.action === "opened"
            ? "Opened"
            : event.payload.action === "closed" &&
              event.payload.pull_request.merged
            ? "Merged"
            : event.payload.action.charAt(0).toUpperCase() +
              event.payload.action.slice(1)}{" "}
          PR in <span style={repoNameStyle}>{event.repo.name}</span>
        </>
      );
    case "ForkEvent":
      return (
        <>
          Forked <span style={repoNameStyle}>{event.repo.name}</span>
        </>
      );
    case "IssuesEvent":
      return (
        <>
          {event.payload.action.charAt(0).toUpperCase() +
            event.payload.action.slice(1)}{" "}
          issue in <span style={repoNameStyle}>{event.repo.name}</span>
        </>
      );
    case "CreateEvent":
      return (
        <>
          Created {event.payload.ref_type}{" "}
          <span style={repoNameStyle}>{event.repo.name}</span>
        </>
      );
    case "WatchEvent":
      return (
        <>
          Starred <span style={repoNameStyle}>{event.repo.name}</span>
        </>
      );
    default:
      return (
        <>
          Did <span style={repoNameStyle}>{event.type}</span> on{" "}
          <span style={repoNameStyle}>{event.repo.name}</span>
        </>
      );
  }
};

const Projects = ({ accentColor, mainBgColor, textColor, isDarkTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const sectionRef = useRef(null);
  const GITHUB_USERNAME = "SurajAdhikari01";
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
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

  // Fetch pinned repos using GraphQL
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
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                }
              }
              repositoryTopics(first: 5) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
    const variables = { login: username };

    try {
      const response = await axios.post(
        "https://api.github.com/graphql",
        { query, variables },
        { headers }
      );

      if (response.data && response.data.data && response.data.data.user) {
        return (
          response.data.data.user.pinnedItems.nodes.filter(
            (repo) => !repo.isFork
          ) || []
        );
      }
      return [];
    } catch (error) {
      console.error("GraphQL Error:", error);
      return [];
    }
  };

  // Load pinned repos
  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      try {
        if (!GITHUB_TOKEN) {
          console.error("GitHub token is missing!");
          setProjects([]);
          setLoading(false);
          return;
        }

        const pinnedRepos = await fetchPinnedRepos(
          GITHUB_USERNAME,
          GITHUB_TOKEN
        );

        if (pinnedRepos.length === 0) {
          console.warn("No pinned repos found");
          setProjects([]);
        } else {
          const detailedRepos = pinnedRepos.map((repo) => {
            const languageTags =
              repo.languages?.nodes?.map((lang) => lang.name).slice(0, 3) || [];

            return {
              id: repo.id,
              title: repo.name
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              description:
                repo.description ||
                "An exciting project built with modern technologies.",
              tags: languageTags,
              link:
                repo.homepageUrl && repo.homepageUrl.startsWith("http")
                  ? repo.homepageUrl
                  : null,
              github: repo.url,
              image: repo.openGraphImageUrl,
              stars: repo.stargazerCount || 0,
              forks: repo.forkCount || 0,
              primaryLanguage: repo.primaryLanguage,
              updated: new Date(repo.pushedAt),
            };
          });
          setProjects(detailedRepos);
        }
      } catch (err) {
        console.error("Error loading repos:", err);
        setProjects([]);
      }
      setLoading(false);
    };

    loadRepos();
  }, [GITHUB_TOKEN]);

  // Fetch recent activity
  useEffect(() => {
    const fetchActivity = async () => {
      setActivityLoading(true);
      try {
        const res = await axios.get(
          `https://api.github.com/users/${GITHUB_USERNAME}/events/public`
        );
        setActivity(res.data.slice(0, 5)); // Fetching 5 recent activities
      } catch (e) {
        console.error("Error fetching GitHub activity:", e);
        setActivity([]);
      }
      setActivityLoading(false);
    };
    fetchActivity();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen relative overflow-y-auto scrollbar-hide"
      style={{ backgroundColor: mainBgColor }}
    >
      <BackgroundGrid
        accentColor={accentColor}
        isDarkTheme={isDarkTheme}
        opacity={0.05}
      />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Section Header */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono" style={{ color: accentColor }}>
              02.
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold uppercase tracking-tight"
              style={{ color: textColor }}
            >
              Featured Work
            </h2>
          </div>
          <p className="text-sm opacity-70" style={{ color: textColor }}>
            Pinned repositories and recent activity from GitHub
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{
                borderColor: `${accentColor}40`,
                borderTopColor: "transparent",
              }}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Pinned Projects (2/3 width) */}
            <div className="lg:col-span-2">
              <div
                className={`mb-6 transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h3
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ color: textColor }}
                >
                  <span>📌</span> Pinned Repositories
                </h3>
              </div>

              {projects.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {projects.map((project, idx) => (
                    <div
                      key={project.id}
                      className={`group relative transition-all duration-1000 ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
                      style={{ transitionDelay: `${(idx + 1) * 150}ms` }}
                    >
                      <div
                        className="relative h-full overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl"
                        style={{
                          "--glow-color":
                            project.primaryLanguage?.color || accentColor,
                        }}
                      >
                        {/* Glassy Background Overlay */}
                        <div
                          className="absolute inset-0 backdrop-blur-md"
                          style={{
                            backgroundColor: isDarkTheme
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.03)",
                            border: `1px solid ${
                              isDarkTheme
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.1)"
                            }`,
                            clipPath:
                              "polygon(0 0, 0 calc(100% - 28px), 28px 100%, 100% 100%, 100% 28px, 75% 28px, 65% 0)",
                          }}
                        />

                        <div className="relative p-6 flex flex-col h-full min-h-[280px]">
                          {/* Top Section: Title */}
                          <h3
                            className="text-lg font-bold mb-2 line-clamp-1"
                            style={{ color: textColor }}
                          >
                            {project.title}
                          </h3>

                          {/* Middle Section: Description & Tags */}
                          <div className="flex-grow">
                            <p
                              className="text-sm opacity-80 mb-4 line-clamp-2 min-h-[40px]"
                              style={{ color: textColor }}
                            >
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: isDarkTheme
                                      ? "rgba(255, 255, 255, 0.1)"
                                      : "rgba(0, 0, 0, 0.05)",
                                    border: `1px solid ${
                                      isDarkTheme
                                        ? "rgba(255, 255, 255, 0.2)"
                                        : "rgba(0, 0, 0, 0.1)"
                                    }`,
                                    color: textColor,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Bottom Section: Links */}
                          <div
                            className="flex gap-3 pt-4 border-t"
                            style={{
                              borderColor: isDarkTheme
                                ? "rgba(255,255,255,0.2)"
                                : "rgba(0,0,0,0.2)",
                            }}
                          >
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                              style={{
                                backgroundColor: isDarkTheme
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)",
                                color: textColor,
                              }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs font-medium">Code</span>
                            </a>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                                style={{
                                  backgroundColor: accentColor,
                                  color: isDarkTheme ? "#000" : "#fff",
                                }}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                                <span className="text-xs font-medium">
                                  Live
                                </span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="p-8 rounded-2xl text-center"
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
                  <p
                    className="text-sm opacity-60"
                    style={{ color: textColor }}
                  >
                    No pinned repositories found.
                  </p>
                </div>
              )}
              <div className="mt-8 text-center">
                <a
                  href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm text-sm font-medium group"
                  style={{
                    backgroundColor: isDarkTheme
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)",
                    border: `2px solid ${accentColor}`,
                    color: textColor,
                  }}
                >
                  View All Repositories
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="lg:col-span-1">
              <div
                className={`mb-6 transition-all duration-1000 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h3
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ color: textColor }}
                >
                  <span>⚡</span> Recent Activity
                </h3>
              </div>

              <div
                className="p-4 rounded-2xl"
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
                {activityLoading ? (
                  <div
                    className="text-center opacity-70"
                    style={{ color: textColor }}
                  >
                    Loading recent activity…
                  </div>
                ) : !activity.length ? (
                  <div
                    className="text-center opacity-70"
                    style={{ color: textColor }}
                  >
                    No recent public activity found.
                  </div>
                ) : (
                  <div className="space-y-4 text-sm">
                    {activity.map((event, idx) => (
                      <div
                        key={event.id}
                        className={`flex items-start transition-all duration-1000 ${
                          isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-10"
                        }`}
                        style={{ transitionDelay: `${(idx + 5) * 100}ms` }}
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0`}
                          style={{
                            backgroundColor:
                              idx === 0
                                ? "#10B981"
                                : idx === 1
                                ? "#8B5CF6"
                                : "#F59E0B",
                          }}
                        ></div>
                        <div>
                          <div style={{ color: textColor }}>
                            {getActivityDescription(event, accentColor)}
                          </div>
                          <div
                            className="text-xs opacity-60"
                            style={{ color: textColor }}
                          >
                            {timeAgo(event.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-right">
                      <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-xs font-medium"
                        style={{ color: accentColor }}
                      >
                        view full activity →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
