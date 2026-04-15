'use client';
import { useEffect, useState } from 'react';
import { IntroContent } from '@/lib/intro';
import { AgreementContent } from '@/lib/agreement';
import { COMMISSIONS } from '@/lib/commissions';

type Coach = {
  id: string;
  name: string;
  age: number | null;
  location: string | null;
  enagic_rank: string | null;
  time_in_enagic: string | null;
  sales_results: string | null;
  sales_experience: string | null;
  sales_style: string | null;
  about: string | null;
  why_love: string | null;
  email: string;
  calendar_link: string;
  photo_url: string | null;
  approved: boolean;
};

export default function Home() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileCoach, setProfileCoach] = useState<Coach | null>(null);
  const [hireCoach, setHireCoach] = useState<Coach | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/coaches').then(r => r.json()).then(d => {
      setCoaches(d.items || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        <div>
          <div className="eyebrow">Ignite Legacy</div>
          <h1 className="display">The Clarity<br/>Coach Vault</h1>
          <p className="subtitle">Hire an experienced closer to run your Enagic sales calls — so you can focus on leads while an expert converts them.</p>
        </div>
      </div>

      {/* Intro */}
      <h2 className="section-heading">What is a Clarity Coach?</h2>
      <div className="intro-section">
        <IntroContent />
      </div>

      {/* Commissions */}
      <div className="commission-section">
        <h2 className="section-heading">Commission Structure</h2>
        <div className="commission-note">
          <strong>$30 USD base fee</strong> per Clarity Call — covers the initial call and
          any follow-ups. Due within 7 days of invoice, whether the lead joins Enagic or not.
          <br/><br/>
          <strong>Completed Sale Fee</strong> (below) is charged additionally, only when a
          sale closes. Due within 30 days of paperwork submitted to Enagic.
        </div>
        <table className="commission-table">
          <thead>
            <tr><th>Product</th><th style={{ textAlign: 'right' }}>Flat Closer Commission</th></tr>
          </thead>
          <tbody>
            {COMMISSIONS.map(c => (
              <tr key={c.product}><td>{c.product}</td><td>${c.amount}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coaches */}
      <h2 className="section-heading">Meet the Coaches</h2>
      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
      {!loading && coaches.length === 0 && (
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: 60 }}>
          No coaches available yet.
        </p>
      )}
      <div className="coach-grid">
        {coaches.map(c => (
          <div key={c.id} className="coach-card" onClick={() => setProfileCoach(c)}>
            <div className="coach-photo">
              {c.photo_url ? <img src={c.photo_url} alt={c.name} /> : c.name.charAt(0)}
            </div>
            <div className="coach-info">
              <div className="coach-name">{c.name}</div>
              <div className="coach-location">{c.location}</div>
              <div className="coach-stats">
                {c.enagic_rank && (
                  <div className="coach-stat">
                    <span className="stat-label">Rank</span>
                    <span className="stat-value">{c.enagic_rank}</span>
                  </div>
                )}
                {c.time_in_enagic && (
                  <div className="coach-stat">
                    <span className="stat-label">Experience</span>
                    <span className="stat-value">{c.time_in_enagic}</span>
                  </div>
                )}
              </div>
              {c.sales_style && <div className="coach-blurb">{c.sales_style}</div>}
              <button className="btn btn-block" onClick={(e) => { e.stopPropagation(); setHireCoach(c); }}>
                Hire {c.name.split(' ')[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply CTA */}
      <div className="apply-cta">
        <h2>Want to become a Clarity Coach?</h2>
        <p>If you're an experienced Enagic sales closer who'd love to support the Ignite Legacy community, we'd love to hear from you. Applications are reviewed individually.</p>
        <button className="btn" onClick={() => setApplyOpen(true)}>Apply to Become a Coach</button>
      </div>

      {profileCoach && (
        <ProfileModal
          coach={profileCoach}
          onClose={() => setProfileCoach(null)}
          onHire={() => { setHireCoach(profileCoach); setProfileCoach(null); }}
        />
      )}
      {hireCoach && (
        <HireModal coach={hireCoach} onClose={() => setHireCoach(null)} />
      )}
      {applyOpen && (
        <ApplyModal onClose={() => setApplyOpen(false)} onSuccess={() => {
          setApplyOpen(false);
          setToast('Application submitted! We\'ll be in touch.');
          setTimeout(() => setToast(''), 4000);
        }} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function ProfileModal({ coach, onClose, onHire }: { coach: Coach; onClose: () => void; onHire: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="profile-grid">
          <div className="profile-photo">
            {coach.photo_url ? <img src={coach.photo_url} alt={coach.name} /> : coach.name.charAt(0)}
          </div>
          <div className="profile-header">
            <h2>{coach.name}</h2>
            <div className="meta">
              {[coach.age && `${coach.age}`, coach.location].filter(Boolean).join(' · ')}
            </div>
            <div className="profile-stats">
              {coach.enagic_rank && (
                <div className="coach-stat">
                  <span className="stat-label">Enagic Rank</span>
                  <span className="stat-value">{coach.enagic_rank}</span>
                </div>
              )}
              {coach.time_in_enagic && (
                <div className="coach-stat">
                  <span className="stat-label">Time in Enagic</span>
                  <span className="stat-value">{coach.time_in_enagic}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {coach.sales_results && (
          <div className="profile-section">
            <div className="label">Sales Results</div>
            <div className="value">{coach.sales_results}</div>
          </div>
        )}
        {coach.sales_experience && (
          <div className="profile-section">
            <div className="label">Sales Experience</div>
            <div className="value">{coach.sales_experience}</div>
          </div>
        )}
        {coach.sales_style && (
          <div className="profile-section">
            <div className="label">Sales Style</div>
            <div className="value">{coach.sales_style}</div>
          </div>
        )}
        {coach.about && (
          <div className="profile-section">
            <div className="label">About</div>
            <div className="value">{coach.about}</div>
          </div>
        )}
        {coach.why_love && (
          <div className="profile-section">
            <div className="label">Why I Love This Work</div>
            <div className="value">{coach.why_love}</div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn" onClick={onHire}>Hire {coach.name.split(' ')[0]}</button>
        </div>
      </div>
    </div>
  );
}

function HireModal({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      coach_id: coach.id,
      coach_name: coach.name,
      sponsor_name: form.get('sponsor_name'),
      sponsor_email: form.get('sponsor_email'),
      sponsor_instagram: form.get('sponsor_instagram'),
      sponsor_enagic_id: form.get('sponsor_enagic_id'),
      notes: form.get('notes'),
    };
    const res = await fetch('/api/hire', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (res.ok) setSuccess(true);
  }

  async function copy() {
    await navigator.clipboard.writeText(coach.calendar_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="success-screen">
            <h2>You're all set!</h2>
            <p>Here's {coach.name}'s booking link. We've also sent it to your email along with next steps.</p>
            <div className="success-link-box">
              <div className="label">{coach.name}'s Calendar Link</div>
              <a href={coach.calendar_link} target="_blank" rel="noopener noreferrer">{coach.calendar_link}</a>
              <br/>
              <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
            </div>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Hire {coach.name}</h2>
        <p className="modal-sub">Review the agreement, fill in your details, and submit to receive {coach.name.split(' ')[0]}'s booking link.</p>

        <div className="profile-section">
          <div className="label">Service Agreement</div>
          <div className="agreement-box">
            <AgreementContent />
          </div>
          <label className="checkbox-row">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>I have read and agree to the Ignite Legacy Clarity Coach Service Agreement, and I accept the commission structure and sponsor responsibilities outlined above.</span>
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field"><label>Your Full Name</label><input name="sponsor_name" required /></div>
          <div className="field"><label>Email</label><input name="sponsor_email" type="email" required /></div>
          <div className="field"><label>Instagram Username</label><input name="sponsor_instagram" placeholder="@yourhandle" /></div>
          <div className="field"><label>Your Enagic ID</label><input name="sponsor_enagic_id" placeholder="e.g. 1234567" /></div>
          <div className="field">
            <label>Notes (optional)</label>
            <textarea name="notes" placeholder="Anything the coach should know about your lead or your business?" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={!agreed || submitting}>
              {submitting ? 'Submitting…' : 'Submit & Get Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/api/apply', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (res.ok) onSuccess();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Apply to Become a Coach</h2>
        <p className="modal-sub">Fill out your details. Applications are reviewed by Ignite Legacy admin.</p>
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Full Name</label><input name="name" required /></div>
          <div className="field"><label>Age</label><input name="age" type="number" /></div>
          <div className="field"><label>Location</label><input name="location" placeholder="City, Country" /></div>
          <div className="field"><label>Email</label><input name="email" type="email" required /></div>
          <div className="field"><label>Instagram</label><input name="instagram" placeholder="@yourhandle" /></div>
          <div className="field"><label>Current Enagic Rank</label><input name="enagic_rank" placeholder="e.g. 6A2" /></div>
          <div className="field"><label>Time in Enagic</label><input name="time_in_enagic" placeholder="e.g. 8 years" /></div>
          <div className="field"><label>Sales Results</label><textarea name="sales_results" placeholder="Total volume, number of sales, notable wins..." /></div>
          <div className="field"><label>Sales Experience</label><textarea name="sales_experience" placeholder="High-ticket, network marketing, coaching..." /></div>
          <div className="field"><label>Your Sales Style</label><textarea name="sales_style" placeholder="How do you approach a sales call?" /></div>
          <div className="field"><label>About You</label><textarea name="about" /></div>
          <div className="field"><label>Why You Love This Work</label><textarea name="why_love" /></div>
          <div className="field"><label>Calendar / Booking Link</label><input name="calendar_link" type="url" placeholder="https://..." /></div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
