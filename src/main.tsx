import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

type Task = { id: string; text: string; done: boolean };
type Application = {
  company: string;
  role: string;
  date: string;
  status: string;
  followUp: string;
  notes: string;
};
type Book = { title: string; author: string; progress: string; lesson: string };
type Finance = { emergencyFund: number; income: number; expenses: number; netWorth: number };
type AppState = {
  topPriorities: string[];
  checklist: Task[];
  sitrep: {
    status: string;
    win: string;
    obstacle: string;
    correction: string;
    lesson: string;
    tomorrow: string;
  };
  applications: Application[];
  books: Book[];
  finance: Finance;
  weight: number;
};

const storageKey = "dawson-os-v02";

const seedState: AppState = {
  topPriorities: [
    "Submit five quality job applications",
    "Complete fitness and federal readiness block",
    "Read 20 pages and record one lesson"
  ],
  checklist: [
    { id: "1", text: "Morning brief", done: false },
    { id: "2", text: "Workout", done: false },
    { id: "3", text: "Career block", done: false },
    { id: "4", text: "Financial action", done: false },
    { id: "5", text: "Read 20 pages", done: false },
    { id: "6", text: "Clean 15 minutes", done: false },
    { id: "7", text: "No gaming before mission complete", done: false }
  ],
  sitrep: {
    status: "Active",
    win: "",
    obstacle: "",
    correction: "",
    lesson: "",
    tomorrow: ""
  },
  applications: [
    {
      company: "Example Company",
      role: "Director of Operations",
      date: "2026-07-01",
      status: "Applied",
      followUp: "2026-07-08",
      notes: "Tailor executive resume and follow up."
    }
  ],
  books: [{ title: "Tuesdays with Morrie", author: "Mitch Albom", progress: "Planned", lesson: "" }],
  finance: { emergencyFund: 0, income: 0, expenses: 0, netWorth: 0 },
  weight: 312
};

const navItems = [
  "Command Center",
  "Daily Mission",
  "Career Command",
  "Federal Command",
  "Financial Command",
  "Fitness Readiness",
  "Reading Intelligence",
  "Home Command",
  "Vehicle Command",
  "Weekly Review",
  "Settings"
];

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : seedState;
  } catch {
    return seedState;
  }
}

function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function App() {
  const [page, setPage] = useState("Command Center");
  const [state, setState] = useState<AppState>(loadState());

  function update(next: AppState) {
    setState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const disciplineScore = useMemo(() => {
    return Math.round((state.checklist.filter((task) => task.done).length / state.checklist.length) * 100);
  }, [state.checklist]);

  const emergencyPct = Math.round((state.finance.emergencyFund / 1000) * 100);
  const federalReadiness = 28;
  const readingProgress = state.books.length > 0 ? 18 : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-kicker">DawsonOS</div>
          <div className="brand-title">Command</div>
          <p className="brand-subtitle">Executive Personal Operating System</p>
        </div>

        <nav className="nav">
          {navItems.map((item, index) => (
            <button
              key={item}
              className={`nav-button ${page === item ? "active" : ""}`}
              onClick={() => setPage(item)}
            >
              <span className="nav-icon">{["🏛", "📅", "💼", "🛡", "💰", "🏋️", "📚", "🏠", "🚗", "📋", "⚙️"][index]}</span>
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <strong>Mission:</strong><br />
          Build stability, readiness, and trust through disciplined execution.
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">Good Morning</div>
            <h1 className="page-title">{page === "Command Center" ? "Mr. Dawson De Vito" : page}</h1>
            <p className="subtitle">
              Lead by example. Listen first. Earn trust through consistent action.
            </p>
          </div>
          <div className="status-pill">Mission Status: ACTIVE</div>
        </header>

        {page === "Command Center" && (
          <div className="grid">
            <section className="card wide">
              <div className="section-label">Command Brief</div>
              <h2 style={{ marginTop: 12 }}>Today's Mission</h2>
              <p className="muted">
                Build forward movement before comfort. Career first, fitness second, finances protected.
              </p>
              <div className="mission-list">
                {state.topPriorities.map((priority) => (
                  <div className="mission-item" key={priority}>
                    <span className="check-dot" />
                    <span>{priority}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="section-label">Daily Discipline</div>
              <div className="kpi">{disciplineScore}%</div>
              <Progress value={disciplineScore} />
              <p className="muted">Checklist completion</p>
            </section>

            <section className="card">
              <div className="section-label">Emergency Fund</div>
              <div className="kpi">${state.finance.emergencyFund}</div>
              <Progress value={emergencyPct} />
              <p className="muted">Target: $1,000</p>
            </section>

            <section className="card">
              <div className="section-label">Current Weight</div>
              <div className="kpi">{state.weight}</div>
              <Progress value={42} />
              <p className="muted">Goal: 230 lb</p>
            </section>

            <section className="card">
              <div className="section-label">Career Applications</div>
              <div className="kpi">{state.applications.length}</div>
              <p className="muted">Tracked opportunities</p>
            </section>

            <section className="card">
              <div className="section-label">Federal Readiness</div>
              <div className="kpi">{federalReadiness}%</div>
              <Progress value={federalReadiness} />
              <p className="muted">Agency prep and documents</p>
            </section>

            <section className="card">
              <div className="section-label">Reading Progress</div>
              <div className="kpi">{readingProgress}%</div>
              <Progress value={readingProgress} />
              <p className="muted">Current book pipeline</p>
            </section>

            <section className="card full">
              <div className="section-label">Bills Due</div>
              <div className="mission-list">
                <div className="mission-item"><span className="check-dot" /> Rent — $1,250 due on the 1st</div>
                <div className="mission-item"><span className="check-dot" /> Car loan — $307 due around the 15th</div>
                <div className="mission-item"><span className="check-dot" /> Electric/Gas — near end of month</div>
              </div>
            </section>
          </div>
        )}

        {page === "Daily Mission" && (
          <div className="grid">
            <section className="card half">
              <div className="section-label">Execution Checklist</div>
              <h2 style={{ marginTop: 12 }}>Daily Orders</h2>
              {state.checklist.map((task) => (
                <label key={task.id} className={`task ${task.done ? "done" : ""}`}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() =>
                      update({
                        ...state,
                        checklist: state.checklist.map((item) =>
                          item.id === task.id ? { ...item, done: !item.done } : item
                        )
                      })
                    }
                  />
                  {task.text}
                </label>
              ))}
            </section>

            <section className="card half">
              <div className="section-label">Situation Report</div>
              {(["status", "win", "obstacle", "correction", "lesson", "tomorrow"] as const).map((field) => (
                <div className="field" key={field}>
                  <label>{field}</label>
                  <textarea
                    value={state.sitrep[field]}
                    onChange={(event) =>
                      update({ ...state, sitrep: { ...state.sitrep, [field]: event.target.value } })
                    }
                  />
                </div>
              ))}
            </section>
          </div>
        )}

        {page === "Career Command" && (
          <section className="card full">
            <div className="section-label">Application Tracker</div>
            <h2 style={{ marginTop: 12 }}>Career Pipeline</h2>
            <div className="table-like">
              <div className="row header">
                <span>Company</span><span>Role</span><span>Status</span><span>Follow Up</span><span>Notes</span>
              </div>
              {state.applications.map((app) => (
                <div className="row" key={`${app.company}-${app.role}`}>
                  <span>{app.company}</span>
                  <span>{app.role}</span>
                  <span>{app.status}</span>
                  <span>{app.followUp}</span>
                  <span>{app.notes}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "Federal Command" && (
          <SimplePage
            title="Federal Law Enforcement Readiness"
            items={["FBI", "DEA", "ATF", "HSI", "Secret Service", "U.S. Marshals", "CBP"]}
          />
        )}

        {page === "Financial Command" && (
          <div className="grid">
            <section className="card half">
              <div className="section-label">Monthly Obligations</div>
              <div className="mission-list">
                <div className="mission-item"><span className="check-dot" /> Rent: $1,250 due on the 1st</div>
                <div className="mission-item"><span className="check-dot" /> Car loan: $307 due around the 15th</div>
                <div className="mission-item"><span className="check-dot" /> Apple storage: ~$3 monthly</div>
                <div className="mission-item"><span className="check-dot" /> Xbox Game Pass: monthly</div>
              </div>
            </section>

            <section className="card half">
              <div className="section-label">Emergency Fund</div>
              <div className="field">
                <label>Emergency fund balance</label>
                <input
                  type="number"
                  value={state.finance.emergencyFund}
                  onChange={(event) =>
                    update({
                      ...state,
                      finance: { ...state.finance, emergencyFund: Number(event.target.value) }
                    })
                  }
                />
              </div>
              <Progress value={emergencyPct} />
              <p className="muted">First milestone: $1,000</p>
            </section>
          </div>
        )}

        {page === "Fitness Readiness" && (
          <SimplePage title="Fitness Readiness" items={["Morning workout", "Cardio", "Mobility", "Weekly weigh-in", "Federal fitness prep"]} />
        )}

        {page === "Reading Intelligence" && (
          <SimplePage title="Reading Intelligence" items={state.books.map((book) => `${book.title} — ${book.author} (${book.progress})`)} />
        )}

        {page === "Home Command" && (
          <SimplePage title="Home Command" items={["Executive apartment", "Wood desk", "Leather chairs", "Bookshelves", "White columns inspiration"]} />
        )}

        {page === "Vehicle Command" && (
          <SimplePage title="Vehicle Command" items={["Mileage", "Oil change", "Tire rotation", "Registration", "Inspection", "Insurance"]} />
        )}

        {page === "Weekly Review" && (
          <SimplePage title="Weekly Review" items={["Wins", "Failures", "Lessons learned", "Money saved", "Applications sent", "Workouts", "Pages read"]} />
        )}

        {page === "Settings" && (
          <section className="card full">
            <div className="section-label">System Settings</div>
            <h2 style={{ marginTop: 12 }}>DawsonOS v0.2</h2>
            <p className="muted">Local-first prototype. GitHub and Vercel deployment active.</p>
          </section>
        )}

        <div className="version">DawsonOS v0.2 • Executive Command Center</div>
      </main>
    </div>
  );
}

function SimplePage({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="card full">
      <div className="section-label">{title}</div>
      <div className="mission-list">
        {items.map((item) => (
          <div className="mission-item" key={item}>
            <span className="check-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
