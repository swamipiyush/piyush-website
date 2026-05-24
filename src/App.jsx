import { useEffect, useMemo, useState } from "react";

const CONTACT = {
  email: "pswami399@gmail.com",
  phoneDisplay: "+91-9799101073",
  phoneHref: "+919799101073",
  subject: "Website Contact - Dr. Piyush Swami",
};

const STORAGE_PREFIX = "piyush-portfolio-log";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

const focusAreas = [
  {
    icon: "⚕️",
    title: "Surgery & Oncology",
    text: "Clinical notes, surgical reflections, and oncology-focused learning.",
  },
  {
    icon: "🔬",
    title: "Research",
    text: "Thesis-based publications, academic projects, surgery, AI, and biology.",
  },
  {
    icon: "🎵",
    title: "Music",
    text: "Piano, guitar, singing, production experiments, and artistic growth.",
  },
  {
    icon: "🏃",
    title: "Body & Discipline",
    text: "Fitness, calisthenics, martial arts, nutrition, and disciplined living.",
  },
];

const journalItems = [
  {
    id: "knowledge-notes",
    icon: "📚",
    title: "Knowledge Notes",
    tag: "Learning",
    prompt: "Write concepts, book notes, ideas, and questions worth revisiting.",
    placeholder: `Example:
- Concept learned today:
- Why it matters:
- Questions to explore next:`,
  },
  {
    id: "surgical-reflections",
    icon: "✍️",
    title: "Surgical Reflections",
    tag: "Medicine",
    prompt: "Record operative learning, clinical reflections, cases, and academic thoughts.",
    placeholder: `Example:
- Case / topic:
- Key learning:
- Mistake or insight:
- Follow-up reading:`,
  },
  {
    id: "music-practice-log",
    icon: "🎹",
    title: "Music Practice Log",
    tag: "Art",
    prompt: "Track piano, guitar, singing, rhythm, and production practice.",
    placeholder: `Example:
- Practice duration:
- Skill practiced:
- What improved:
- Tomorrow’s target:`,
  },
  {
    id: "travel-adventure",
    icon: "✈️",
    title: "Travel & Adventure",
    tag: "Life",
    prompt: "Save places, travel memories, plans, and adventure ideas.",
    placeholder: `Example:
- Place / idea:
- Why I want to go:
- Notes:
- Next step:`,
  },
];

const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(CONTACT.subject)}`;

function getStorageKey(id) {
  return `${STORAGE_PREFIX}:${id}`;
}

// --- Custom Hooks ---
function useJournalStorage(activeLogId) {
  const [draft, setDraft] = useState("");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    if (!activeLogId) return;
    try {
      setDraft(window.localStorage.getItem(getStorageKey(activeLogId)) || "");
      setSavedAt(window.localStorage.getItem(`${getStorageKey(activeLogId)}:savedAt`) || "");
    } catch (error) {
      console.warn("Storage restricted:", error);
    }
  }, [activeLogId]);

  const saveLog = () => {
    if (!activeLogId) return;
    try {
      const timestamp = new Date().toLocaleString();
      window.localStorage.setItem(getStorageKey(activeLogId), draft);
      window.localStorage.setItem(`${getStorageKey(activeLogId)}:savedAt`, timestamp);
      setSavedAt(timestamp);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Unable to save log to local storage.");
    }
  };

  const clearLog = () => {
    if (!activeLogId) return;
    try {
      setDraft("");
      setSavedAt("");
      window.localStorage.removeItem(getStorageKey(activeLogId));
      window.localStorage.removeItem(`${getStorageKey(activeLogId)}:savedAt`);
    } catch (error) {
      console.error("Failed to clear:", error);
    }
  };

  return { draft, setDraft, savedAt, saveLog, clearLog };
}

// --- Components ---
function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-400">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">{description}</p>
      ) : null}
    </div>
  );
}

function IconBox({ children }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-2xl ring-1 ring-white/10">
      {children}
    </span>
  );
}

function LogEditor({ activeLog, onClose }) {
  const { draft, setDraft, savedAt, saveLog, clearLog } = useJournalStorage(activeLog?.id);

  useEffect(() => {
    if (!activeLog) return;
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeLog, onClose]);

  if (!activeLog) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-editor-title"
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6 md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <IconBox>{activeLog.icon}</IconBox>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">Editable Log</p>
                <h2 id="log-editor-title" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {activeLog.title}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-2xl leading-7 text-neutral-300">{activeLog.prompt}</p>
            {savedAt ? <p className="mt-2 text-sm text-neutral-500">Last saved: {savedAt}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-neutral-300 transition hover:bg-white/[0.1] hover:text-white"
            aria-label="Close log editor"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8">
          <textarea
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={activeLog.placeholder}
            className="min-h-[360px] w-full resize-y rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-base leading-8 text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-white/30 focus:bg-white/[0.06]"
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">Your log is saved in this browser using local storage.</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearLog}
                className="rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.09]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={saveLog}
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
              >
                💾 Save log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5" aria-label="Primary navigation">
        <a href="#home" className="text-lg font-semibold tracking-wide text-white transition hover:text-neutral-200">
          Dr. Piyush Swami
        </a>

        <div className="hidden gap-8 text-sm text-neutral-300 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </div>

        <a href={mailto} className="rounded-full bg-white px-5 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200">
          Connect
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
      <div>
        <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-neutral-300 backdrop-blur">
          Surgeon • Researcher • Learner • Musician
        </div>

        <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">Learning Life</h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
          I am a surgeon from India, deeply interested in surgical oncology, research, AI,
          philosophy, music, and human performance. This is my digital home for work,
          learning, reflections, and projects.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <a href="#work" className="inline-flex items-center rounded-full bg-white px-6 py-4 font-medium text-neutral-950 hover:bg-neutral-200">
            Explore my work <span className="ml-2" aria-hidden="true">→</span>
          </a>
          <a href="#journal" className="rounded-full border border-white/20 bg-white/[0.04] px-6 py-4 font-medium text-white hover:bg-white/[0.09]">
            Read journal
          </a>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl" aria-label="Profile summary">
        <div className="rounded-[1.5rem] bg-gradient-to-br from-neutral-800 to-neutral-950 p-8">
          <div className="aspect-[4/5] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.18),rgba(255,255,255,0.03))] p-6">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="h-20 w-20 rounded-full bg-white/20 ring-1 ring-white/20" aria-hidden="true" />
                <h2 className="mt-8 text-3xl font-semibold tracking-tight">Piyush Swami</h2>
                <p className="mt-3 text-neutral-300">General Surgery • Surgical Oncology Aspirant</p>
              </div>

              <div className="space-y-3 text-sm text-neutral-300">
                <p className="rounded-2xl bg-white/10 p-4">Current focus: oncology, research, AI, music, fitness.</p>
                <p className="rounded-2xl bg-white/10 p-4">Mission: become excellent, useful, and deeply alive.</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}

function About() {
  const education = [
    "MBBS from All India Institute of Medical Sciences, Jodhpur.",
    "Master of Surgery from Sawai Man Singh Medical College, Jaipur.",
  ];

  return (
    <section id="about" className="mt-28 scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur md:p-12">
      <SectionHeading
        eyebrow="About"
        title="Busy Being Born"
        description="I am Dr. Piyush Swami, a general surgeon from India with a strong interest in surgical oncology, research, AI in healthcare, philosophy, music, fitness, and building meaningful systems for learning and impact."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {education.map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5 text-neutral-200">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">Education</p>
            <p className="mt-3 text-lg leading-8">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="mt-28 scroll-mt-28">
      <SectionHeading eyebrow="What I’m building" title="A personal operating system for excellence." />

      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {focusAreas.map((item) => (
          <article key={item.title} className="h-full rounded-3xl border border-white/10 bg-white/[0.055] p-6 text-white backdrop-blur transition hover:border-white/20 hover:bg-white/[0.08]">
            <IconBox>{item.icon}</IconBox>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 leading-7 text-neutral-300">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journal({ onOpenLog }) {
  return (
    <section id="journal" className="mt-28 grid scroll-mt-28 gap-10 md:grid-cols-[0.8fr_1.2fr]">
      <SectionHeading
        eyebrow="Journal"
        title="Thoughts, logs, and field notes."
        description="Open a category, write freely, and save your notes directly inside the website. Each log stays separate and editable."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {journalItems.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => onOpenLog(post.id)}
            className="rounded-3xl border border-white/10 bg-neutral-900/80 p-6 text-left text-white transition hover:border-white/20 hover:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl" aria-hidden="true">{post.icon}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">{post.tag}</span>
            </div>
            <h3 className="mt-8 text-2xl font-semibold tracking-tight">{post.title}</h3>
            <p className="mt-4 leading-6 text-neutral-400">{post.prompt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
              Open editable log <span aria-hidden="true">→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mt-28 scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur md:p-12">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">Let’s build, learn, and collaborate.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-neutral-300">
            For surgical research, AI-healthcare ideas, academic collaborations, music projects,
            or meaningful conversations.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-neutral-200 sm:flex-row sm:gap-6">
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 transition hover:text-white">
              <span aria-hidden="true">✉️</span>
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phoneHref}`} className="inline-flex items-center gap-2 transition hover:text-white">
              <span aria-hidden="true">☎️</span>
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <a href={mailto} className="rounded-full bg-white px-8 py-4 font-medium text-neutral-950 hover:bg-neutral-200">
          Email me
        </a>
      </div>
    </section>
  );
}

export default function App() {
  const [activeLogId, setActiveLogId] = useState(null);

  const activeLog = useMemo(
    () => journalItems.find((item) => item.id === activeLogId) || null,
    [activeLogId]
  );

  return (
    <div className="min-h-screen overflow-hidden scroll-smooth bg-neutral-950 text-neutral-100 antialiased selection:bg-white selection:text-neutral-950">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(120,120,255,0.18),transparent_30%),radial-gradient(circle_at_60%_90%,rgba(255,180,100,0.10),transparent_38%)]"
        aria-hidden="true"
      />

      <Navbar />

      <main id="home" className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-24">
        <Hero />
        <About />
        <Work />
        <Journal onOpenLog={setActiveLogId} />
        <Contact />
      </main>

      <LogEditor activeLog={activeLog} onClose={() => setActiveLogId(null)} />
    </div>
  );
}