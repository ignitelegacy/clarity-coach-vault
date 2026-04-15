'use client';
import { useEffect, useState } from 'react';

type Coach = any;
type Application = any;
type Hire = any;

export default function AdminPage() {
  const [tab, setTab] = useState<'coaches' | 'applications' | 'hires'>('coaches');
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [hires, setHires] = useState<Hire[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCoach, setEditCoach] = useState<Coach | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin');
    const d = await r.json();
    setCoaches(d.coaches || []);
    setApplications(d.applications || []);
    setHires(d.hires || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function post(body: any) {
    const res = await fetch('/api/admin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) load();
    return res.ok;
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="container">
      <div className="eyebrow">Admin</div>
      <h1 className="display" style={{ fontSize: 48, marginBottom: 30 }}>Clarity Coach Vault Admin</h1>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'coaches' ? 'active' : ''}`} onClick={() => setTab('coaches')}>
          Coaches ({coaches.length})
        </button>
        <button className={`admin-tab ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
          Applications ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button className={`admin-tab ${tab === 'hires' ? 'active' : ''}`} onClick={() => setTab('hires')}>
          Hire Submissions ({hires.length})
        </button>
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

      {!loading && tab === 'coaches' && (
        <>
          <button className="btn" style={{ marginBottom: 24 }} onClick={() => setAddOpen(true)}>+ Add Coach</button>
          {coaches.length === 0 && <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No coaches yet.</p>}
          {coaches.map(c => (
            <div key={c.id} className="admin-card">
              <h3>{c.name}</h3>
              <div className="admin-meta">{c.location} · {c.enagic_rank} · {c.email}</div>
              {c.sales_style && <div className="admin-section"><strong>Sales Style</strong>{c.sales_style}</div>}
              <div className="admin-section"><strong>Calendar Link</strong>
                <a href={c.calendar_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--burgundy)', wordBreak: 'break-all' }}>{c.calendar_link}</a>
              </div>
              <div className="admin-actions">
                <button className="btn btn-sm" onClick={() => setEditCoach(c)}>Edit</button>
                <button className="btn btn-sm btn-delete" onClick={async () => {
                  if (confirm(`Delete ${c.name}?`)) {
                    const ok = await post({ action: 'delete', table: 'coaches', id: c.id });
                    if (ok) showToast('Coach deleted');
                  }
                }}>Delete</button>
              </div>
            </div>
          ))}
        </>
      )}

      {!loading && tab === 'applications' && (
        <>
          {applications.length === 0 && <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No applications yet.</p>}
          {applications.map(a => (
            <div key={a.id} className="admin-card">
              <h3>{a.name} {a.status !== 'pending' && <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'Montserrat' }}>· {a.status}</span>}</h3>
              <div className="admin-meta">{a.location} · {a.enagic_rank} · {a.email} · {new Date(a.created_at).toLocaleString()}</div>
              {a.sales_results && <div className="admin-section"><strong>Sales Results</strong>{a.sales_results}</div>}
              {a.sales_experience && <div className="admin-section"><strong>Experience</strong>{a.sales_experience}</div>}
              {a.sales_style && <div className="admin-section"><strong>Sales Style</strong>{a.sales_style}</div>}
              {a.about && <div className="admin-section"><strong>About</strong>{a.about}</div>}
              {a.why_love && <div className="admin-section"><strong>Why They Love It</strong>{a.why_love}</div>}
              {a.calendar_link && <div className="admin-section"><strong>Calendar</strong>{a.calendar_link}</div>}
              {a.status === 'pending' && (
                <div className="admin-actions">
                  <button className="btn btn-sm btn-approve" onClick={async () => {
                    const ok = await post({ action: 'approve-application', id: a.id });
                    if (ok) showToast('Application approved and coach added');
                  }}>Approve & Add as Coach</button>
                  <button className="btn btn-sm btn-reject" onClick={async () => {
                    const ok = await post({ action: 'reject-application', id: a.id });
                    if (ok) showToast('Application rejected');
                  }}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {!loading && tab === 'hires' && (
        <>
          {hires.length === 0 && <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No hire submissions yet.</p>}
          {hires.map(h => (
            <div key={h.id} className="admin-card">
              <h3>{h.sponsor_name} → hired {h.coach_name}</h3>
              <div className="admin-meta">{new Date(h.created_at).toLocaleString()}</div>
              <div className="admin-section"><strong>Email</strong>{h.sponsor_email}</div>
              {h.sponsor_instagram && <div className="admin-section"><strong>Instagram</strong>{h.sponsor_instagram}</div>}
              {h.sponsor_enagic_id && <div className="admin-section"><strong>Enagic ID</strong>{h.sponsor_enagic_id}</div>}
              {h.notes && <div className="admin-section"><strong>Notes</strong>{h.notes}</div>}
              <div className="admin-section"><strong>Agreed to Terms</strong>{h.agreed_to_terms ? 'Yes' : 'No'}</div>
              <div className="admin-actions">
                <button className="btn btn-sm btn-delete" onClick={async () => {
                  if (confirm('Delete this submission?')) {
                    const ok = await post({ action: 'delete', table: 'hire_submissions', id: h.id });
                    if (ok) showToast('Deleted');
                  }
                }}>Delete</button>
              </div>
            </div>
          ))}
        </>
      )}

      {(addOpen || editCoach) && (
        <CoachForm
          coach={editCoach}
          onClose={() => { setAddOpen(false); setEditCoach(null); }}
          onSaved={() => {
            load();
            setAddOpen(false);
            setEditCoach(null);
            showToast(editCoach ? 'Coach updated' : 'Coach added');
          }}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function CoachForm({ coach, onClose, onSaved }: { coach: any; onClose: () => void; onSaved: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const data: any = {
      name: form.get('name'),
      age: form.get('age') ? parseInt(form.get('age') as string) : null,
      location: form.get('location'),
      email: form.get('email'),
      enagic_rank: form.get('enagic_rank'),
      time_in_enagic: form.get('time_in_enagic'),
      sales_results: form.get('sales_results'),
      sales_experience: form.get('sales_experience'),
      sales_style: form.get('sales_style'),
      about: form.get('about'),
      why_love: form.get('why_love'),
      calendar_link: form.get('calendar_link'),
      photo_url: form.get('photo_url'),
    };
    const body = coach
      ? { action: 'update-coach', id: coach.id, data }
      : { action: 'create-coach', data };
    const res = await fetch('/api/admin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setSubmitting(false);
    if (res.ok) onSaved();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{coach ? 'Edit Coach' : 'Add Coach'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Full Name</label><input name="name" required defaultValue={coach?.name || ''} /></div>
          <div className="field"><label>Photo URL</label><input name="photo_url" type="url" defaultValue={coach?.photo_url || ''} placeholder="https://..." /><div className="hint">Paste an image URL, or upload to Supabase Storage first and paste the public URL here.</div></div>
          <div className="field"><label>Age</label><input name="age" type="number" defaultValue={coach?.age || ''} /></div>
          <div className="field"><label>Location</label><input name="location" defaultValue={coach?.location || ''} /></div>
          <div className="field"><label>Email</label><input name="email" type="email" required defaultValue={coach?.email || ''} /></div>
          <div className="field"><label>Enagic Rank</label><input name="enagic_rank" defaultValue={coach?.enagic_rank || ''} /></div>
          <div className="field"><label>Time in Enagic</label><input name="time_in_enagic" defaultValue={coach?.time_in_enagic || ''} /></div>
          <div className="field"><label>Sales Results</label><textarea name="sales_results" defaultValue={coach?.sales_results || ''} /></div>
          <div className="field"><label>Sales Experience</label><textarea name="sales_experience" defaultValue={coach?.sales_experience || ''} /></div>
          <div className="field"><label>Sales Style</label><textarea name="sales_style" defaultValue={coach?.sales_style || ''} /></div>
          <div className="field"><label>About</label><textarea name="about" defaultValue={coach?.about || ''} /></div>
          <div className="field"><label>Why You Love This Work</label><textarea name="why_love" defaultValue={coach?.why_love || ''} /></div>
          <div className="field"><label>Calendar / Booking Link</label><input name="calendar_link" type="url" required defaultValue={coach?.calendar_link || ''} placeholder="https://..." /></div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
