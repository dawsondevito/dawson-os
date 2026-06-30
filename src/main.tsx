import React from "react";
import { createRoot } from "react-dom/client";
import { progress } from "./data/progress";
import "./index.css";

const nav = [
  ["🏛", "Mission", "#mission"],
  ["💼", "Career", "#career"],
  ["🛡", "Federal", "#federal"],
  ["🏋️", "Fitness", "#fitness"],
  ["💰", "Finance", "#finance"],
  ["📚", "Reading", "#reading"],
  ["📋", "SITREP", "#sitrep"],
  ["🏁", "Milestones", "#milestones"]
];

function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function Kpi({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <section className="card">
      <div className="section-label">{label}</div>
      <div className="kpi">{value}%</div>
      <Progress value={value} />
      <p className="muted">{note}</p>
    </section>
  );
}

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-kicker">DawsonOS</div>
          <div className="brand-title">Progress</div>
          <p className="brand-subtitle">Public Accountability Dashboard</p>
        </div>

        <nav className="nav">
          {nav.map(([icon, label, href]) => (
            <a href={href} key={label}>
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <strong>Last Updated:</strong><br />
          {progress.updated}
          <div className="safe-note">
            Public view only. No private contact details, bills, addresses, or sensitive records are displayed.
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar" id="mission">
          <div>
            <div className="eyebrow">DawsonOS</div>
            <h1 className="page-title">{progress.name}</h1>
            <p className="subtitle">{progress.mission}</p>
            <div className="tag-row">
              {progress.values.map((value) => (
                <span className="tag" key={value}>{value}</span>
              ))}
            </div>
          </div>
          <div className="status-pill">{progress.campaign.status}</div>
        </header>

        <div className="grid">
          <section className="card wide">
            <div className="section-label">Current Campaign</div>
            <h2>{progress.campaign.name}</h2>
            <p className="muted">{progress.campaign.focus}</p>
            <Progress value={progress.metrics.missionStatus} />
          </section>

          <Kpi label="Mission Status" value={progress.metrics.missionStatus} note="Overall campaign progress" />
          <Kpi label="Career Progress" value={progress.metrics.careerProgress} note="Resume, LinkedIn, applications, portfolio" />
          <Kpi label="Federal Readiness" value={progress.metrics.federalReadiness} note="Agency research, documents, standards" />
          <Kpi label="Fitness Progress" value={progress.metrics.fitnessProgress} note="Weight loss and physical readiness" />
          <Kpi label="Financial Independence" value={progress.metrics.financialIndependence} note="Stability, emergency fund, planning" />
          <Kpi label="Reading & Leadership" value={progress.metrics.readingLeadership} note="Books, notes, leadership development" />

          <section className="card full" id="career">
            <div className="section-label">Career Progress</div>
            <h2>{progress.career.headline}</h2>
            <div className="mission-list">
              {progress.career.notes.map((item) => (
                <div className="mission-item" key={item}><span className="check-dot" />{item}</div>
              ))}
            </div>
          </section>

          <section className="card half" id="federal">
            <div className="section-label">Federal Readiness</div>
            <h2>Target Path</h2>
            <p className="muted">Preparing for federal law enforcement through career stabilization, physical readiness, and documentation.</p>
            <div className="tag-row">
              {["FBI", "DEA", "HSI", "ATF", "Secret Service", "U.S. Marshals", "CBP"].map((agency) => (
                <span className="tag" key={agency}>{agency}</span>
              ))}
            </div>
          </section>

          <section className="card half" id="fitness">
            <div className="section-label">Fitness Progress</div>
            <h2>{progress.fitness.currentWeight} lb → {progress.fitness.goalWeight} lb</h2>
            <p className="muted">{progress.fitness.note}</p>
            <Progress value={progress.metrics.fitnessProgress} />
          </section>

          <section className="card half" id="finance">
            <div className="section-label">Financial Independence</div>
            <h2>{progress.finance.emergencyFundTarget}</h2>
            <p className="muted">{progress.finance.focus}</p>
            <Progress value={progress.metrics.financialIndependence} />
          </section>

          <section className="card half" id="reading">
            <div className="section-label">Reading & Leadership</div>
            <h2>{progress.reading.current}</h2>
            <p className="muted">{progress.reading.focus}</p>
            <Progress value={progress.metrics.readingLeadership} />
          </section>

          <section className="card full" id="sitrep">
            <div className="section-label">Weekly SITREP</div>
            <h2>{progress.weeklySitrep.status}</h2>
            <div className="grid" style={{ marginTop: 18 }}>
              <div className="card half">
                <div className="section-label">Wins</div>
                <div className="mission-list">
                  {progress.weeklySitrep.wins.map((win) => (
                    <div className="mission-item" key={win}><span className="check-dot" />{win}</div>
                  ))}
                </div>
              </div>
              <div className="card half">
                <div className="section-label">Next Objectives</div>
                <div className="mission-list">
                  {progress.weeklySitrep.next.map((next) => (
                    <div className="mission-item" key={next}><span className="check-dot" />{next}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="card full" id="milestones">
            <div className="section-label">Milestones</div>
            <div className="timeline">
              {progress.milestones.map((milestone) => (
                <div className="timeline-item" key={`${milestone.date}-${milestone.title}`}>
                  <div className="timeline-date">{milestone.date}</div>
                  <div>{milestone.title}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="version">DawsonOS v0.4 • Public Progress Dashboard</div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
