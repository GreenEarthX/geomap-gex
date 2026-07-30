"use client";

import { useState } from "react";

type DemoStep = {
  id: string;
  title: string;
  detail: string;
  protocol: string;
};

const architecture = [
  { icon: "◎", name: "ORCE Node", tech: "Node.js", tone: "blue" },
  { icon: "G", name: "Issuer Plugin", tech: "Go · Goa", tone: "cyan" },
  { icon: "▦", name: "Participant Data", tech: "gRPC · mTLS", tone: "violet" },
  { icon: "✦", name: "Trust Services", tech: "TSA · SD-JWT", tone: "amber" },
  { icon: "N", name: "OCM W-Stack", tech: "NATS", tone: "pink" },
  { icon: "⌁", name: "PCM Wallet", tech: "OID4VCI", tone: "green" },
];

const initialSteps: DemoStep[] = [
  { id: "validate", title: "Anfrage validieren", detail: "Tenant, Principal & Konfiguration", protocol: "Goa" },
  { id: "participant", title: "Teilnehmerdaten abrufen", detail: "Typisierter Service-Contract", protocol: "gRPC · mTLS" },
  { id: "sign", title: "Credential signieren", detail: "TSA / Crypto Provider", protocol: "SD-JWT" },
  { id: "status", title: "Status reservieren", detail: "Status List Service", protocol: "API" },
  { id: "offer", title: "Offer publizieren", detail: "Idempotentes Event an OCM", protocol: "NATS" },
];

export default function FacisDemo() {
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [offer, setOffer] = useState<string | null>(null);

  async function startDemo() {
    setRunning(true);
    setCompleted([]);
    setOffer(null);

    try {
      const response = await fetch("/api/facis/issue", { method: "POST" });
      const result = await response.json();
      for (const step of result.steps as string[]) {
        await new Promise((resolve) => setTimeout(resolve, 420));
        setCompleted((current) => [...current, step]);
      }
      setOffer(result.offerUri);
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="facis-shell">
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="FACIS Demo Startseite">
          <span className="brand-mark">F</span>
          <span><strong>FACIS</strong><small>ISSUER PLATFORM</small></span>
        </a>
        <div className="nav-links">
          <a href="#architecture">Architektur</a>
          <a href="#issuance">Issuance Flow</a>
          <a href="#services">Services</a>
        </div>
        <span className="demo-badge"><i /> LIVE DEMO</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">SOVEREIGN DIGITAL IDENTITY INFRASTRUCTURE</div>
          <h1>Credentials ausstellen.<br /><span>Sicher. Typisiert. Skalierbar.</span></h1>
          <p>Eine interaktive Referenz für das FACIS Go-Backend – von Teilnehmerdaten über Signatur bis zum OID4VCI Credential Offer.</p>
          <div className="hero-actions">
            <button onClick={startDemo} disabled={running} className="primary-button">
              {running ? "Issuance läuft …" : "Issuance starten"}<span>→</span>
            </button>
            <a href="#architecture" className="secondary-button">Architektur ansehen</a>
          </div>
          <div className="trust-row"><span>✓ mTLS secured</span><span>✓ Tenant isolated</span><span>✓ No credential data stored</span></div>
        </div>
        <div className="credential-card" aria-label="Beispiel eines digitalen Credentials">
          <div className="card-glow" />
          <div className="card-head"><span className="mini-logo">F</span><span>PARTICIPANT CREDENTIAL</span><small>VERIFIED</small></div>
          <div className="chip">▦</div>
          <div className="card-label">LEGAL PARTICIPANT</div>
          <h3>Green Energy Solutions GmbH</h3>
          <div className="card-grid"><span>LEI<strong>529900EXAMPLE</strong></span><span>ISSUER<strong>FACIS EU</strong></span></div>
          <div className="card-foot"><span>SD-JWT VC</span><span>VALID UNTIL 2027-07-30</span></div>
        </div>
      </section>

      <section className="architecture section" id="architecture">
        <div className="section-heading"><div><span className="section-kicker">SYSTEM ARCHITECTURE</span><h2>Ein Flow. Klare Verantwortlichkeiten.</h2></div><p>Go für die Fachlogik. Standardisierte Protokolle für jede Schnittstelle.</p></div>
        <div className="architecture-flow">
          {architecture.map((item, index) => (
            <div className="architecture-item" key={item.name}>
              <div className={`architecture-card ${item.tone}`}><span className="architecture-icon">{item.icon}</span><strong>{item.name}</strong><small>{item.tech}</small></div>
              {index < architecture.length - 1 && <span className="connector">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="issuance section" id="issuance">
        <div className="flow-copy">
          <span className="section-kicker">INTERACTIVE FLOW</span>
          <h2>Vom Principal zum<br />Credential Offer.</h2>
          <p>Die Demo bildet die Orchestrierung im Issuer Plugin ab. Es werden ausschließlich technische Statusinformationen verarbeitet.</p>
          <div className="code-contract"><div><span className="code-dot red"/><span className="code-dot yellow"/><span className="code-dot green"/><em>participant.proto</em></div><code><b>rpc</b> GetCredentialData (<br />&nbsp;&nbsp;tenant_id,<br />&nbsp;&nbsp;principal_id,<br />&nbsp;&nbsp;credential_type<br />) <b>returns</b> (CredentialData);</code></div>
        </div>
        <div className="flow-panel">
          <div className="flow-panel-head"><span>ISSUANCE PIPELINE</span><span className={running ? "running" : "ready"}>● {running ? "RUNNING" : offer ? "COMPLETED" : "READY"}</span></div>
          <div className="steps">
            {initialSteps.map((step, index) => {
              const done = completed.includes(step.id);
              const active = running && completed.length === index;
              return <div className={`step ${done ? "done" : ""} ${active ? "active" : ""}`} key={step.id}>
                <span className="step-number">{done ? "✓" : String(index + 1).padStart(2, "0")}</span>
                <span className="step-info"><strong>{step.title}</strong><small>{step.detail}</small></span>
                <span className="protocol">{step.protocol}</span>
              </div>;
            })}
          </div>
          {offer && <div className="offer-result"><span>✓</span><div><small>CREDENTIAL OFFER ERSTELLT</small><strong>{offer}</strong></div></div>}
          <button className="panel-button" onClick={startDemo} disabled={running}>{running ? "Verarbeitung …" : offer ? "Demo wiederholen" : "Pipeline ausführen"}</button>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="section-heading"><div><span className="section-kicker">BACKEND SERVICES</span><h2>Gebaut für Cloud-native Issuance.</h2></div></div>
        <div className="service-grid">
          <article><span>01</span><h3>Issuer Plugin</h3><p>Zentrale Fachkomponente für Validierung, Signatur und Credential Offers.</p><div><b>Go</b><b>Goa</b><b>OID4VCI</b></div></article>
          <article><span>02</span><h3>Participant Data</h3><p>Mandantenfähige, standardisierte Bereitstellung von Teilnehmerdaten.</p><div><b>gRPC</b><b>Protobuf</b><b>mTLS</b></div></article>
          <article><span>03</span><h3>Event Backbone</h3><p>Asynchrone, idempotente Kommunikation mit OCM und W-Stack.</p><div><b>NATS</b><b>Retries</b><b>Events v1</b></div></article>
        </div>
      </section>

      <footer><div className="brand"><span className="brand-mark">F</span><span><strong>FACIS</strong><small>REFERENCE DEMO</small></span></div><p>Minimal data. Maximum trust.</p><span>Go · gRPC · NATS · OID4VCI</span></footer>
    </main>
  );
}
