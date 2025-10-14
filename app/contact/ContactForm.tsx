// app/contact/ContactForm.tsx
"use client";
import { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  function mailtoHref() {
    const subject = encodeURIComponent("Support request from " + (email || "guest"));
    const body = encodeURIComponent(msg);
    return `mailto:support@mappamou.example?subject=${subject}&body=${body}`;
  }

  return (
    <div className="space-y-2">
      <input className="input" placeholder="Your email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
      <textarea className="input h-32" placeholder="How can we help?" value={msg} onChange={e => setMsg(e.target.value)} />
      <a className="btn" href={mailtoHref()}>Send Email</a>
    </div>
  );
}
