import { useEffect, useMemo, useState } from "react";
import * as D from "./data.js";

const { profile, projects, skills, achievements, contact } = D;
const skillText = D.Skill ?? D.updatePlan;

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Achievements / Skills" },
];
function Sky() {
  // Fixed star positions so they don't jump around on re-render.
  const stars = useMemo(() => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2.2,
      delay: rand() * 4,
      dur: 2 + rand() * 3,
    }));
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky-day">
        <div className="sun" />
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
      </div>
      <div className="sky-night">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
        <div className="moon" />
      </div>
    </div>
  );
}
function Header() {
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

  return (
    <header>
      <div className="wrap">
        <a className="brand" href="#home">
          <span className="logo" aria-hidden="true">{profile.initials}</span>
          {profile.name}
        </a>
        <div className="nav-right">
          <nav aria-label="Main">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}>{n.label}</a>
            ))}
          </nav>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}

const Section = ({ id, title, children }) => (
  <section id={id} className="wrap section" aria-labelledby={`${id}-title`}>
    <h2 className="section-title" id={`${id}-title`}>{title}</h2>
    {children}
  </section>
);

const Panel = ({ title, children }) => (
  <div className="panel"><h2>{title}</h2>{children}</div>
);

function Home() {
  return (
    <section id="home" className="wrap hero">
      <div>
        <h1>{profile.name}</h1>
        <span className="age">Age: {profile.age}</span>
        <p>{profile.intro}</p>
        <div className="buttons">
          <a className="btn" href="#about">About</a>
          <a className="btn" href="#projects">Projects</a>
          <a className="btn alt" href="#skills">Achievements / Skills</a>
        </div>
      </div>
      <img className="avatar" src="90bd97d8-232e-4d28-9d5f-3b14b93c51d3.jpg" alt={`Photo of ${profile.name}`} />
    </section>
  );
}

function About() {
  return (
    <Section id="about" title="About me">
      <Panel title="Who I am"><p>{profile.story}</p></Panel>
      <div className="grid">
        <Panel title="Education"><p>{profile.education}</p></Panel>
        <Panel title="Interests"><p>{profile.interests}</p></Panel>
        <Panel title="Goal"><p>{profile.goal}</p></Panel>
      </div>

      {contact && (
        <div className="panel contact">
          <h2>Contact me</h2>
          <ul className="contact-list">
            <li>
              <span>Email</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <span>Phone</span>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            </li>
            <li>
              <span>Location</span>
              <b>{contact.location}</b>
            </li>
          </ul>
          <div className="contact-links">
            {contact.links.map((l) => (
              <a key={l.label} className="btn small" href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid">
        {projects.map((p) => (
          <article className="panel" key={p.title}>
            {p.image && (
              <a href={p.image} target="_blank" rel="noopener noreferrer" aria-label={`Open picture of ${p.title} in a new tab`}>
                <img
                  className="project-img"
                  src={p.image}
                  alt={`Screenshot of ${p.title}`}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </a>
            )}
            <h2>{p.title}</h2>
            <p>{p.text}</p>
            {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </article>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" title="Achievements / Skills">
      <div className="grid">
        <Panel title="Skills">
          {skills.map((s) => (
            <div key={s.name}>
              <p>{s.name}</p>
              <div className="bar" role="img" aria-label={`${s.name}: ${s.level}%`}>
                <span style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Achievements">
          <ul className="achievement-list">
            {achievements.map((item) => {
              const a = typeof item === "string" ? { text: item } : item;
              return (
                <li key={a.text}>
                  {a.image && (
                    <a href={a.image} target="_blank" rel="noopener noreferrer" aria-label={`Open picture: ${a.text}`}>
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
              );
            })}
          </ul>
        </Panel>

        <Panel title="My skills"><p>{skillText}</p></Panel>
      </div>
    </Section>
  );
}

export default function App() {
  useEffect(() => {
    document.title = `${profile.name} | Portfolio`;
  }, []);

  return (
    <>
      <Sky />
      <Header />
      <main>
        <Home />
        <About />
        <Projects />
        <Skills />
      </main>
      <footer>
        &copy; 2026 {profile.name}. Built with React. <a href="#home">Back to top</a>
      </footer>
    </>
  );
}