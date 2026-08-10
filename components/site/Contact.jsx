'use client';
import { useState } from 'react';
import { FiSend, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import RollIcon from './ui/RollIcon';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const inputCls =
  'w-full rounded border border-line bg-bg-1 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-accent-text focus:outline-none';

export default function Contact({ contact, sidebar }) {
  const [form, setForm] = useState({ fullname: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isValid = form.fullname.trim() && form.email.trim() && form.message.trim();
  const status = contact?.currentStatus;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
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
    <Section id="contact" title="Let's Talk" eyebrow="Contact">
      <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <Reveal className="flex flex-col gap-7">
          {status?.label && (
            <div className="flex items-center gap-2.5">
              <span className={`size-2.5 rounded-full ${status.available ? 'bg-accent' : 'bg-ink-faint'}`} />
              <span className="eyebrow">{status.label}</span>
            </div>
          )}

          <p className="display max-w-sm text-3xl leading-tight sm:text-4xl">
            Have a project in mind? Let&apos;s build it together.
          </p>

          <ul className="flex flex-col gap-4 text-sm">
            {sidebar?.email && (
              <li>
                <a
                  href={`mailto:${sidebar.email}`}
                  className="inline-flex items-center gap-3 text-ink-muted transition-colors hover:text-accent-text"
                >
                  <FiMail size={15} className="shrink-0" /> {sidebar.email}
                </a>
              </li>
            )}
            {sidebar?.phone && (
              <li>
                <a
                  href={`tel:${sidebar.phone}`}
                  className="inline-flex items-center gap-3 text-ink-muted transition-colors hover:text-accent-text"
                >
                  <FiPhone size={15} className="shrink-0" /> {sidebar.phoneDisplay || sidebar.phone}
                </a>
              </li>
            )}
            {sidebar?.location && (
              <li className="inline-flex items-center gap-3 text-ink-muted">
                <FiMapPin size={15} className="shrink-0" /> {sidebar.location}
              </li>
            )}
          </ul>

          {(sidebar?.socials || []).length > 0 && (
            <ul className="flex items-center gap-4">
              {sidebar.socials.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label || s.icon}
                    className="group/roll grid size-10 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-accent-text hover:text-accent-text"
                  >
                    <RollIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          {sent && (
            <div className="mb-5 rounded border border-accent bg-accent-soft px-4 py-3 text-sm text-accent-text">
              ✓ Message sent. I&apos;ll get back to you soon.
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full name"
                required
                className={inputCls}
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email address"
                required
                className={inputCls}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Your message"
              required
              rows={6}
              className={`${inputCls} resize-y`}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              disabled={!isValid || sending}
              className="btn-accent self-start disabled:cursor-not-allowed disabled:opacity-40"
              data-track-click="submit_contact_form"
            >
              <FiSend size={13} /> {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
