import React, { useState } from 'react';

// Booking form for the landing page. Posts to the Cloudflare Pages Function at
// /api/book, which emails the lead to the owner via Resend. See functions/api/book.ts
// for the required environment variables.
export default function BookForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      contact: String(fd.get('contact') || ''),
      address: String(fd.get('address') || ''),
      company: String(fd.get('company') || ''), // honeypot
    };
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="success" role="status">
        <h3>Got it. Talk soon.</h3>
        <p>We'll reply within one business day to lock in a flight window for your listing.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="bk-name">Your name</label>
        <input id="bk-name" name="name" required placeholder="Full name" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="bk-contact">Email or phone</label>
        <input id="bk-contact" name="contact" required placeholder="Where we should reply" autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="bk-address">Listing address or area</label>
        <input id="bk-address" name="address" required placeholder="e.g. 40 acres off Happy Jack Rd, Cheyenne" />
      </div>
      {/* Honeypot: hidden from people, tempting to bots. Leave it empty. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />
      <button className="btn btn--lg" type="submit" disabled={sending}>
        {sending ? 'Sending...' : 'Book your free first shoot'}
      </button>
      {error && (
        <p className="under-cta" role="alert" style={{ textAlign: 'center', margin: '6px 0 0', color: '#b4452e' }}>
          {error}
        </p>
      )}
      <p className="under-cta" style={{ textAlign: 'center', margin: '6px 0 0' }}>Free means free. No card, no contract, no catch.</p>
    </form>
  );
}
