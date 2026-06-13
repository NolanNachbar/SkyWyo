import React, { useState } from 'react';

// Booking form for the landing page. Local success state matches the design.
// To send real leads, point handleSubmit at a Formspree endpoint or the Resend
// API route — see the commented fetch below.
export default function BookForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const data = new FormData(e.currentTarget as HTMLFormElement);
    // await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { Accept: 'application/json' },
    //   body: data,
    // });
    setSent(true);
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
      <button className="btn btn--lg" type="submit">Book your free first shoot</button>
      <p className="under-cta" style={{ textAlign: 'center', margin: '6px 0 0' }}>Free means free. No card, no contract, no catch.</p>
    </form>
  );
}
