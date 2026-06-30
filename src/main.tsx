import React, { ChangeEvent, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

type Task = { id: string; text: string; done: boolean };
type Application = { id: string; company: string; role: string; date: string; status: string; followUp: string; notes: string };
type Bill = { id: string; name: string; amount: number; due: string; paid: boolean };
type Workout = { id: string; date: string; type: string; notes: string };
type Book = { id: string; title: string; author: string; status: string; lesson: string; rating: string };
type Finance = { emergencyFund: number; income: number; expenses: number; netWorth: number; bills: Bill[] };
type Fitness = { currentWeight: number; goalWeight: number; workouts: Workout[] };
type AppState = {
  topPriorities: string[];
  checklist: Task[];
  sitrep: { status: string; win: string; obstacle: string; correction: string; lesson: string; tomorrow: string };
  applications: Application[];
  books: Book[];
  finance: Finance;
  fitness: Fitness;
};

const storageKey = "dawson-os-v03";
const id = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random());

const seedState: AppState = {
  topPriorities: ["Submit five quality job applications", "Complete fitness and federal readiness block", "Read 20 pages and record one lesson"],
  checklist: [
    { id: id(), text: "Morning brief", done: false },
    { id: id(), text: "Workout", done: false },
    { id: id(), text: "Career block", done: false },
    { id: id(), text: "Financial action", done: false },
    { id: id(), text: "Read 20 pages", done: false },
    { id: id(), text: "Clean 15 minutes", done: false },
    { id: id(), text: "No gaming before mission complete", done: false }
  ],
  sitrep: { status: "Active", win: "", obstacle: "", correction: "", lesson: "", tomorrow: "" },
  applications: [{ id: id(), company: "Example Company", role: "Director of Operations", date: "2026-07-01", status: "Applied", followUp: "2026-07-08", notes: "Tailor executive resume and follow up." }],
  books: [{ id: id(), title: "Tuesdays with Morrie", author: "Mitch Albom", status: "Planned", lesson: "", rating: "" }],
  finance: {
    emergencyFund: 0,
    income: 0,
    expenses: 0,
    netWorth: 0,
    bills: [
      { id: id(), name: "Rent", amount: 1250, due: "1st", paid: false },
      { id: id(), name: "Car Loan", amount: 307, due: "15th", paid: false },
      { id: id(), name: "Electric/Gas", amount: 0, due: "End of month", paid: false },
      { id: id(), name: "Apple Storage", amount: 3, due: "Monthly", paid: false },
      { id: id(), name: "Xbox Game Pass", amount: 0, due: "Monthly", paid: false }
    ]
  },
  fitness: { currentWeight: 312, goalWeight: 230, workouts: [] }
};

const navItems = ["Command Center", "Daily Mission", "Career Command", "Federal Command", "Financial Command", "Fitness Readiness", "Reading Intelligence", "Home Command", "Vehicle Command", "Weekly Review", "Settings"];
const icons = ["🏛", "📅", "💼", "🛡", "💰", "🏋️", "📚", "🏠", "🚗", "📋", "⚙️"];

function migrate(raw: any): AppState {
  return {
    ...seedState,
    ...raw,
    finance: { ...seedState.finance, ...(raw?.finance ?? {}), bills: raw?.finance?.bills ?? seedState.finance.bills },
    fitness: raw?.fitness ?? { currentWeight: raw?.weight ?? 312, goalWeight: 230, workouts: [] },
    books: (raw?.books ?? seedState.books).map((b: any) => ({ id: b.id ?? id(), title: b.title ?? "", author: b.author ?? "", status: b.status ?? b.progress ?? "Planned", lesson: b.lesson ?? "", rating: b.rating ?? "" })),
    applications: (raw?.applications ?? seedState.applications).map((a: any) => ({ id: a.id ?? id(), company: a.company ?? "", role: a.role ?? "", date: a.date ?? "", status: a.status ?? "Saved", followUp: a.followUp ?? "", notes: a.notes ?? "" })),
    checklist: (raw?.checklist ?? seedState.checklist).map((t: any) => ({ id: t.id ?? id(), text: t.text ?? "", done: Boolean(t.done) }))
  };
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(storageKey) || localStorage.getItem("dawson-os-v02");
    return saved ? migrate(JSON.parse(saved)) : seedState;
  } catch {
    return seedState;
  }
}

function Progress({ value }: { value: number }) {
  return <div className="progress"><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

function App() {
  const [page, setPage] = useState("Command Center");
  const [state, setState] = useState<AppState>(loadState());
  const fileInput = useRef<HTMLInputElement>(null);

  function update(next: AppState) {
    setState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const disciplineScore = useMemo(() => Math.round((state.checklist.filter((task) => task.done).length / Math.max(1, state.checklist.length)) * 100), [state.checklist]);
  const emergencyPct = Math.round((state.finance.emergencyFund / 1000) * 100);
  const weightPct = Math.round(((312 - state.fitness.currentWeight) / Math.max(1, 312 - state.fitness.goalWeight)) * 100);
  const federalReadiness = 28;
  const booksActive = state.books.filter((b) => b.status !== "Finished").length;
  const billsDue = state.finance.bills.filter((b) => !b.paid).length;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dawson-os-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    update(migrate(JSON.parse(text)));
    event.target.value = "";
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card"><div className="brand-kicker">DawsonOS</div><div className="brand-title">Command</div><p className="brand-subtitle">Executive Personal Operating System</p></div>
        <nav className="nav">{navItems.map((item, index) => <button key={item} className={`nav-button ${page === item ? "active" : ""}`} onClick={() => setPage(item)}><span className="nav-icon">{icons[index]}</span><span>{item}</span></button>)}</nav>
        <div className="sidebar-footer"><strong>Mission:</strong><br />Build stability, readiness, and trust through disciplined execution.</div>
      </aside>
      <main className="main">
        <header className="topbar"><div><div className="eyebrow">Good Morning</div><h1 className="page-title">{page === "Command Center" ? "Mr. Dawson De Vito" : page}</h1><p className="subtitle">Lead by example. Listen first. Earn trust through consistent action.</p></div><div className="status-pill">Mission Status: ACTIVE</div></header>

        {page === "Command Center" && <Dashboard state={state} disciplineScore={disciplineScore} emergencyPct={emergencyPct} weightPct={weightPct} federalReadiness={federalReadiness} booksActive={booksActive} billsDue={billsDue} />}
        {page === "Daily Mission" && <DailyMission state={state} update={update} />}
        {page === "Career Command" && <Career state={state} update={update} />}
        {page === "Financial Command" && <Finance state={state} update={update} />}
        {page === "Fitness Readiness" && <Fitness state={state} update={update} />}
        {page === "Reading Intelligence" && <Reading state={state} update={update} />}
        {page === "Federal Command" && <SimplePage title="Federal Law Enforcement Readiness" items={["FBI", "DEA", "ATF", "HSI", "Secret Service", "U.S. Marshals", "CBP"]} />}
        {page === "Home Command" && <SimplePage title="Home Command" items={["Executive apartment", "Wood desk", "Leather chairs", "Bookshelves", "White columns inspiration"]} />}
        {page === "Vehicle Command" && <SimplePage title="Vehicle Command" items={["Mileage", "Oil change", "Tire rotation", "Registration", "Inspection", "Insurance"]} />}
        {page === "Weekly Review" && <SimplePage title="Weekly Review" items={["Wins", "Failures", "Lessons learned", "Money saved", "Applications sent", "Workouts", "Pages read"]} />}
        {page === "Settings" && <section className="card full"><div className="section-label">System Settings</div><h2>DawsonOS v0.3</h2><p className="muted">Local-first data, editable modules, JSON backup and restore.</p><div className="actions"><button className="btn" onClick={exportData}>Export JSON Backup</button><button className="btn secondary" onClick={() => fileInput.current?.click()}>Import JSON</button><button className="btn danger" onClick={() => confirm("Reset DawsonOS to seed data?") && update(seedState)}>Reset Seed Data</button></div><input ref={fileInput} className="file-input" type="file" accept="application/json" onChange={importData} style={{ display: "none" }} /></section>}
        <div className="version">DawsonOS v0.3 • Functional Local-First Command Center</div>
      </main>
    </div>
  );
}

function Dashboard({ state, disciplineScore, emergencyPct, weightPct, federalReadiness, booksActive, billsDue }: any) {
  return <div className="grid">
    <section className="card wide"><div className="section-label">Command Brief</div><h2>Today's Mission</h2><p className="muted">Build forward movement before comfort. Career first, fitness second, finances protected.</p><div className="mission-list">{state.topPriorities.map((p: string) => <div className="mission-item" key={p}><div className="mission-left"><span className="check-dot" /><span>{p}</span></div></div>)}</div></section>
    <Kpi label="Daily Discipline" value={`${disciplineScore}%`} pct={disciplineScore} note="Checklist completion" />
    <Kpi label="Emergency Fund" value={`$${state.finance.emergencyFund}`} pct={emergencyPct} note="Target: $1,000" />
    <Kpi label="Current Weight" value={`${state.fitness.currentWeight}`} pct={weightPct} note={`Goal: ${state.fitness.goalWeight} lb`} />
    <Kpi label="Career Applications" value={state.applications.length} note="Tracked opportunities" />
    <Kpi label="Federal Readiness" value={`${federalReadiness}%`} pct={federalReadiness} note="Agency prep and documents" />
    <Kpi label="Reading Progress" value={booksActive} note="Active books" />
    <Kpi label="Bills Due" value={billsDue} note="Unpaid obligations" />
  </div>;
}

function Kpi({ label, value, pct, note }: { label: string; value: string | number; pct?: number; note: string }) {
  return <section className="card"><div className="section-label">{label}</div><div className="kpi">{value}</div>{pct !== undefined && <Progress value={pct} />}<p className="muted">{note}</p></section>;
}

function DailyMission({ state, update }: { state: AppState; update: (s: AppState) => void }) {
  const [newTask, setNewTask] = useState("");
  return <div className="grid">
    <section className="card half"><div className="section-label">Execution Checklist</div><h2>Daily Orders</h2>{state.checklist.map((task) => <label key={task.id} className={`task ${task.done ? "done" : ""}`}><input type="checkbox" checked={task.done} onChange={() => update({ ...state, checklist: state.checklist.map((t) => t.id === task.id ? { ...t, done: !t.done } : t) })} />{task.text}<button className="btn danger" onClick={(e) => { e.preventDefault(); update({ ...state, checklist: state.checklist.filter((t) => t.id !== task.id) }); }}>Delete</button></label>)}<div className="actions"><input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New checklist item" /><button className="btn" onClick={() => { if (!newTask.trim()) return; update({ ...state, checklist: [...state.checklist, { id: id(), text: newTask.trim(), done: false }] }); setNewTask(""); }}>Add Task</button></div></section>
    <section className="card half"><div className="section-label">Situation Report</div>{(["status", "win", "obstacle", "correction", "lesson", "tomorrow"] as const).map((field) => <div className="field" key={field}><label>{field}</label><textarea value={state.sitrep[field]} onChange={(e) => update({ ...state, sitrep: { ...state.sitrep, [field]: e.target.value } })} /></div>)}</section>
  </div>;
}

function Career({ state, update }: { state: AppState; update: (s: AppState) => void }) {
  const statuses = ["Saved", "Applied", "Follow-up Needed", "Interview", "Rejected", "Offer"];
  const change = (idv: string, key: keyof Application, value: string) => update({ ...state, applications: state.applications.map((a) => a.id === idv ? { ...a, [key]: value } : a) });
  return <section className="card full"><div className="section-label">Application Tracker</div><h2>Career Pipeline</h2><div className="mission-list">{state.applications.map((a) => <div className="mission-item" key={a.id} style={{ display: "block" }}><div className="edit-grid three"><input value={a.company} onChange={(e) => change(a.id, "company", e.target.value)} placeholder="Company" /><input value={a.role} onChange={(e) => change(a.id, "role", e.target.value)} placeholder="Role" /><select value={a.status} onChange={(e) => change(a.id, "status", e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select><input value={a.date} onChange={(e) => change(a.id, "date", e.target.value)} placeholder="Date applied" /><input value={a.followUp} onChange={(e) => change(a.id, "followUp", e.target.value)} placeholder="Follow-up" /><input value={a.notes} onChange={(e) => change(a.id, "notes", e.target.value)} placeholder="Notes" /></div><div className="actions"><button className="btn danger" onClick={() => update({ ...state, applications: state.applications.filter(x => x.id !== a.id) })}>Delete Application</button></div></div>)}</div><div className="actions"><button className="btn" onClick={() => update({ ...state, applications: [...state.applications, { id: id(), company: "", role: "", date: "", status: "Saved", followUp: "", notes: "" }] })}>Add Application</button></div></section>;
}

function Finance({ state, update }: { state: AppState; update: (s: AppState) => void }) {
  const setFinance = (patch: Partial<Finance>) => update({ ...state, finance: { ...state.finance, ...patch } });
  const billChange = (bid: string, patch: Partial<Bill>) => setFinance({ bills: state.finance.bills.map(b => b.id === bid ? { ...b, ...patch } : b) });
  return <div className="grid"><section className="card half"><div className="section-label">Financial Inputs</div><div className="edit-grid"><Field label="Emergency Fund" value={state.finance.emergencyFund} onChange={(v) => setFinance({ emergencyFund: Number(v) })} /><Field label="Monthly Income" value={state.finance.income} onChange={(v) => setFinance({ income: Number(v) })} /><Field label="Monthly Expenses" value={state.finance.expenses} onChange={(v) => setFinance({ expenses: Number(v) })} /><Field label="Net Worth" value={state.finance.netWorth} onChange={(v) => setFinance({ netWorth: Number(v) })} /></div><Progress value={(state.finance.emergencyFund / 1000) * 100} /></section><section className="card half"><div className="section-label">Bills</div>{state.finance.bills.map(b => <div className="mission-item" key={b.id} style={{ display: "block" }}><div className="edit-grid"><input value={b.name} onChange={e => billChange(b.id, { name: e.target.value })} /><input type="number" value={b.amount} onChange={e => billChange(b.id, { amount: Number(e.target.value) })} /><input value={b.due} onChange={e => billChange(b.id, { due: e.target.value })} /><label className="task"><input type="checkbox" checked={b.paid} onChange={e => billChange(b.id, { paid: e.target.checked })} />Paid</label></div><button className="btn danger" onClick={() => setFinance({ bills: state.finance.bills.filter(x => x.id !== b.id) })}>Delete Bill</button></div>)}<button className="btn" onClick={() => setFinance({ bills: [...state.finance.bills, { id: id(), name: "", amount: 0, due: "", paid: false }] })}>Add Bill</button></section></div>;
}

function Fitness({ state, update }: { state: AppState; update: (s: AppState) => void }) {
  const setFitness = (patch: Partial<Fitness>) => update({ ...state, fitness: { ...state.fitness, ...patch } });
  const workoutChange = (wid: string, patch: Partial<Workout>) => setFitness({ workouts: state.fitness.workouts.map(w => w.id === wid ? { ...w, ...patch } : w) });
  return <div className="grid"><section className="card half"><div className="section-label">Weight</div><div className="edit-grid"><Field label="Current Weight" value={state.fitness.currentWeight} onChange={(v) => setFitness({ currentWeight: Number(v) })} /><Field label="Goal Weight" value={state.fitness.goalWeight} onChange={(v) => setFitness({ goalWeight: Number(v) })} /></div></section><section className="card half"><div className="section-label">Workout Log</div>{state.fitness.workouts.map(w => <div className="mission-item" key={w.id} style={{ display: "block" }}><div className="edit-grid"><input value={w.date} onChange={e => workoutChange(w.id, { date: e.target.value })} placeholder="Date" /><input value={w.type} onChange={e => workoutChange(w.id, { type: e.target.value })} placeholder="Type" /><input value={w.notes} onChange={e => workoutChange(w.id, { notes: e.target.value })} placeholder="Notes" /></div><button className="btn danger" onClick={() => setFitness({ workouts: state.fitness.workouts.filter(x => x.id !== w.id) })}>Delete Workout</button></div>)}<button className="btn" onClick={() => setFitness({ workouts: [...state.fitness.workouts, { id: id(), date: "", type: "", notes: "" }] })}>Add Workout</button></section></div>;
}

function Reading({ state, update }: { state: AppState; update: (s: AppState) => void }) {
  const bookChange = (bid: string, patch: Partial<Book>) => update({ ...state, books: state.books.map(b => b.id === bid ? { ...b, ...patch } : b) });
  return <section className="card full"><div className="section-label">Reading Intelligence</div>{state.books.map(b => <div className="mission-item" key={b.id} style={{ display: "block" }}><div className="edit-grid three"><input value={b.title} onChange={e => bookChange(b.id, { title: e.target.value })} placeholder="Title" /><input value={b.author} onChange={e => bookChange(b.id, { author: e.target.value })} placeholder="Author" /><select value={b.status} onChange={e => bookChange(b.id, { status: e.target.value })}><option>Planned</option><option>Reading</option><option>Finished</option></select><input value={b.lesson} onChange={e => bookChange(b.id, { lesson: e.target.value })} placeholder="Key lesson" /><input value={b.rating} onChange={e => bookChange(b.id, { rating: e.target.value })} placeholder="Rating" /></div><button className="btn danger" onClick={() => update({ ...state, books: state.books.filter(x => x.id !== b.id) })}>Delete Book</button></div>)}<button className="btn" onClick={() => update({ ...state, books: [...state.books, { id: id(), title: "", author: "", status: "Planned", lesson: "", rating: "" }] })}>Add Book</button></section>;
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) {
  return <div className="field"><label>{label}</label><input type="number" value={value} onChange={e => onChange(e.target.value)} /></div>;
}

function SimplePage({ title, items }: { title: string; items: string[] }) {
  return <section className="card full"><div className="section-label">{title}</div><div className="mission-list">{items.map((item) => <div className="mission-item" key={item}><div className="mission-left"><span className="check-dot" /><span>{item}</span></div></div>)}</div></section>;
}

createRoot(document.getElementById("root")!).render(<App />);
