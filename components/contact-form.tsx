"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

type ContactFormState = { name: string; email: string; msg: string };

const EMPTY_FORM: ContactFormState = { name: "", email: "", msg: "" };

// Visual-only contact form: validates, then simulates success. No network request, nothing persisted.
export function ContactForm() {
  const uid = useId();
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [sent, setSent] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    };
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.msg.trim()) {
      setShake(true);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
      shakeTimer.current = setTimeout(() => setShake(false), 400);
      return;
    }
    setSent(form.name.trim());
  };

  const reset = () => {
    setSent(null);
    setForm(EMPTY_FORM);
  };

  return (
    <form className={"contact-form" + (shake ? " shake" : "")} onSubmit={onSubmit} noValidate>
      {sent === null ? (
        <>
          <div className="field">
            <label htmlFor={`${uid}-name`}>NAME</label>
            <input
              id={`${uid}-name`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="px_kai"
            />
          </div>
          <div className="field">
            <label htmlFor={`${uid}-email`}>EMAIL</label>
            <input
              id={`${uid}-email`}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="player@vault.gg"
            />
          </div>
          <div className="field">
            <label htmlFor={`${uid}-msg`}>MESSAGE</label>
            <textarea
              id={`${uid}-msg`}
              rows={5}
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              placeholder="Tell us what's on your mind…"
            />
          </div>
          <button className="btn xl press" type="submit" style={{ width: "100%" }}>
            ▶&nbsp;&nbsp;SEND MESSAGE
          </button>
        </>
      ) : (
        <div className="terminal-success">
          <div className="term-bar">
            <span className="dot r" />
            <span className="dot y" />
            <span className="dot g" />
            <span className="term-title">VAULT-OS // TERMINAL</span>
          </div>
          <div className="term-body">
            <div className="line">
              <span className="prompt">vault@arcade:~$</span> ./send_message --to=team
            </div>
            <div className="line dim">[OK] Connecting to server…</div>
            <div className="line dim">[OK] Validating content…</div>
            <div className="line dim">[OK] Transmitting packet…</div>
            <div className="line success">
              &gt; MESSAGE RECEIVED. WE&apos;LL GET BACK TO YOU SOON. THANKS, {sent.toUpperCase()}.
              <span className="caret">_</span>
            </div>
            <div style={{ marginTop: 18 }}>
              <button className="btn ghost" type="button" onClick={reset}>
                SEND ANOTHER MESSAGE
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
