import { Routes, Route, Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { profile, projects, skills, achievements, Skill } from "./data.js";

function Layout({ title, children, showNav = true }) {
    const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
    } catch { /* ignore */ }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* ignore */ }
  }, [theme]);
  useEffect(() => { document.title = `${title} | ${profile.name}`; window.scrollTo(0, 0); }, [title]);
  return (
    <>
      <header><div className="wrap">
        <Link className="brand" to="/"><span className="logo" aria-hidden="true">{profile.initials}</span>{profile.name}</Link>
          {showNav && (
            <nav aria-label="Main">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/skills">Achievements / Skills</NavLink>
            </nav>
          )}
         <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div></header>
      {children}
      <footer>&copy; 2026 {profile.name}. / CS Student.</footer>
    </>
  );
}

const Panel = ({ title, children }) => (
  <section className="panel"><h2>{title}</h2>{children}</section>
);
const Back = () => <p className="buttons"><Link className="btn alt" to="/">Back to home</Link></p>;

function Home() {
  return (
    <main className="wrap hero">
      <div>
        <h1>{profile.name}</h1>
        <span className="age">Age: {profile.age}</span>
        <p>{profile.intro}</p>
        <div className="buttons">
          {/* target="_blank" opens each page in a new tab */}
          <Link className="btn" to="/about" target="_blank" rel="noopener">About</Link>
          <Link className="btn" to="/projects" target="_blank" rel="noopener">Projects</Link>
          <Link className="btn alt" to="/skills" target="_blank" rel="noopener">Achievements / Skills</Link>
        </div>
      </div>
      <img className="avatar" src="90bd97d8-232e-4d28-9d5f-3b14b93c51d3.jpg" alt={`Photo of ${profile.name}`} />
    </main>
  );
}

function About() {
  return (
    <main className="wrap"><h1>About me</h1>
      <Panel title="Who I am"><p>{profile.story}</p></Panel>
      <div className="grid">
        <Panel title="Education"><p>{profile.education}</p></Panel>
        <Panel title="Interests"><p>{profile.interests}</p></Panel>
        <Panel title="Goal"><p>{profile.goal}</p></Panel>
      </div><Back />
    </main>
  );
}

function Projects() {
  return (
    <main className="wrap"><h1>Projects</h1>
      <div className="grid">
        {projects.map(p => (
          <article className="panel" key={p.title}>
            {p.image && (
              <img
                className="project-img"
                src={p.image}
                alt={`Screenshot of ${p.title}`}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}
            <h2>{p.title}</h2>
            <p>{p.text}</p>
            {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </article>
        ))}
      </div><Back />
    </main>
  );
}

function Skills() {
  return (
    <main className="wrap"><h1>Achievements / Skills</h1>
      <div className="grid">
        <Panel title="Skills">
          {skills.map(s => (
            <div key={s.name}><p>{s.name}</p>
              <div className="bar" role="img" aria-label={`${s.name}: ${s.level}%`}>
                <span style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Achievements">
          <ul className="achievement-list">
            {achievements.map(a => (
              <li key={a.text}>
                {a.image && (
                  <a href={a.image} target="_blank" rel="noopener" aria-label={`Open picture: ${a.text}`}>
                    <img
                      className="achievement-img"
                      src={a.image}
                      alt={a.text}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </a>
                )}
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="My skills"><p>{Skill}</p></Panel>
      </div><Back />
    </main>
  );
}

export default function App() {
  const page = (title, el, showNav = false) => (
    <Layout title={title} showNav={showNav}>{el}</Layout>
  );
  return (
    <Routes>
      <Route path="/" element={page("Home", <Home />, false)} />
      <Route path="/about" element={page("About", <About />)} />
      <Route path="/projects" element={page("Projects", <Projects />)} />
      <Route path="/skills" element={page("Achievements & Skills", <Skills />)} />
      <Route path="*" element={page("Not found", <main className="wrap"><h1>Page not found</h1><Back /></main>)} />
    </Routes>
  );
}