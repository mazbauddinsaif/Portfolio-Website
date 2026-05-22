'use client';
import { useState } from 'react';

export default function ContactSection({ data, active }) {
  const [form, setForm] = useState({ fullname: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isValid = form.fullname.trim() && form.email.trim() && form.message.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending) return;
    setSending(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.fullname, email: form.email, message: form.message }),
      });
      if (res.ok) {
        setSent(true);
        setForm({ fullname: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4000);
      }
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  return (
    <article className={`contact${active ? ' active' : ''}`} data-page="contact">
      <header><h2 className="h2 article-title">Contact</h2></header>

      {data?.currentStatus && (
        <div id="contact-status-badge">
          <div className={`current-status-badge ${data.currentStatus.available ? 'status-available' : 'status-busy'}`}>
            <span className="status-dot"></span> {data.currentStatus.label}
          </div>
        </div>
      )}

      {data?.mapSrc && (
        <section className="mapbox">
          <figure>
            <iframe src={data.mapSrc} width="400" height="300" loading="lazy"></iframe>
          </figure>
        </section>
      )}

      <section className="contact-form">
        <h3 className="h3 form-title">Contact Form</h3>
        {sent && (
          <div style={{ padding: '12px', background: 'hsl(142, 50%, 20%)', borderRadius: '8px', marginBottom: '16px', color: '#4ade80', fontSize: '14px' }}>
            ✓ Message sent successfully!
          </div>
        )}
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input type="text" className="form-input" placeholder="Full name" required
              value={form.fullname} onChange={e => setForm({ ...form, fullname: e.target.value })} />
            <input type="email" className="form-input" placeholder="Email address" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <textarea className="form-input" placeholder="Your Message" required
            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          <button className="form-btn" type="submit" disabled={!isValid || sending} data-track-click="submit_contact_form">
            <ion-icon name="paper-plane"></ion-icon>
            <span>{sending ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </section>
    </article>
  );
}
