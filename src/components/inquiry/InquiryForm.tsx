import React, { useState } from 'react';

// Replace with your Formspree form ID from formspree.io/forms
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

type Step = 'initial' | 'details' | 'submitting' | 'success' | 'error';

export default function InquiryForm() {
  const [step, setStep] = useState<Step>('initial');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    notes: '',
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitting');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contact: formData.contact,
          location: formData.location,
          notes: formData.notes,
          _subject: `Production inquiry from ${formData.name} — ${formData.location}`,
        }),
      });

      if (res.ok) {
        setStep('success');
      } else {
        setStep('error');
      }
    } catch {
      setStep('error');
    }
  };

  if (step === 'success') {
    return (
      <div className="text-center py-20 reveal-in">
        <h3 className="serif text-[var(--text-3xl)] mb-4 text-paper">Request Received.</h3>
        <p className="text-paper-dim text-[var(--text-base)] max-w-[40ch] mx-auto font-body">
          A director will review your property details and contact you within 24 hours to discuss production availability.
        </p>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="text-center py-20">
        <p className="text-paper-dim text-[var(--text-base)] max-w-[40ch] mx-auto font-body mb-8">
          Something went wrong. Please email us directly at{' '}
          <a href="mailto:hello@skywyo.com" className="text-paper underline">hello@skywyo.com</a>
        </p>
        <button
          onClick={() => setStep('details')}
          className="font-display text-[var(--text-xs)] tracking-plate uppercase text-paper-mute hover:text-paper transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[540px] mx-auto transition-all duration-700 ease-soft">
      {/* Honeypot — hidden from humans, catches bots */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {step === 'initial' && (
        <form onSubmit={handleNext} className="space-y-12">
          <div className="space-y-4">
            <label className="font-display text-[var(--text-xs)] tracking-plate text-paper-mute block">
              Primary Contact Name
            </label>
            <input
              required
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border-b border-white/20 pb-4 font-body text-[var(--text-lg)] text-paper placeholder:text-paper-mute focus:outline-none focus:border-paper transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="font-display text-[var(--text-xs)] tracking-plate text-paper-mute block">
              Email or Telephone
            </label>
            <input
              required
              type="text"
              placeholder="Preferred Contact"
              className="w-full bg-transparent border-b border-white/20 pb-4 font-body text-[var(--text-lg)] text-paper placeholder:text-paper-mute focus:outline-none focus:border-paper transition-colors"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="group w-full inline-flex items-center justify-center gap-3.5 bg-paper text-ink px-7 py-5 rounded-full font-display text-[var(--text-xs)] font-semibold tracking-plate uppercase hover:bg-white hover:gap-5.5 transition-all duration-400 ease-soft"
          >
            Continue to Property Details
            <svg className="w-3.5 h-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      )}

      {(step === 'details' || step === 'submitting') && (
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <label className="font-display text-[var(--text-xs)] tracking-plate text-paper-mute block">
              Property Location / Market
            </label>
            <input
              required
              autoFocus
              type="text"
              placeholder="e.g. Casper, Laramie, or statewide"
              className="w-full bg-transparent border-b border-white/20 pb-4 font-body text-[var(--text-lg)] text-paper placeholder:text-paper-mute focus:outline-none focus:border-paper transition-colors"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={step === 'submitting'}
            />
          </div>

          <div className="space-y-4">
            <label className="font-display text-[var(--text-xs)] tracking-plate text-paper-mute block">
              Notes <span className="opacity-50 normal-case tracking-normal font-normal">— optional</span>
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about the property, the shoot goals, or anything else we should know."
              className="w-full bg-transparent border-b border-white/20 pb-4 font-body text-[var(--text-lg)] text-paper placeholder:text-paper-mute focus:outline-none focus:border-paper transition-colors resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={step === 'submitting'}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setStep('initial')}
              disabled={step === 'submitting'}
              className="flex-1 px-7 py-5 rounded-full font-display text-[var(--text-xs)] font-semibold tracking-plate uppercase border border-white/20 text-paper-mute hover:text-paper hover:border-paper transition-all disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={step === 'submitting'}
              className="flex-[2] inline-flex items-center justify-center gap-3.5 bg-paper text-ink px-7 py-5 rounded-full font-display text-[var(--text-xs)] font-semibold tracking-plate uppercase hover:bg-white hover:gap-5.5 transition-all duration-400 ease-soft disabled:opacity-60"
            >
              {step === 'submitting' ? 'Sending…' : 'Inquire About Production Availability'}
              {step !== 'submitting' && (
                <svg className="w-3.5 h-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
