import { useState, type FormEvent } from 'react';
import { ArrowUpRight, AtSign, MapPin, Phone } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function Contact() {
  const [notice, setNotice] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get('name') ?? '').trim();
    const email = String(values.get('email') ?? '').trim();
    const subject = String(values.get('subject') ?? '').trim() || `Portfolio message from ${name}`;
    const message = String(values.get('message') ?? '').trim();
    const body = `${message}\n\n— ${name}\n${email}`;
    const href = `mailto:${portfolio.person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNotice('Your email application should open with this message prepared. It has not been sent from this website.');
    window.location.href = href;
  };
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-panel">
          <div className="contact-intro">
            <span className="section-kicker">07 / Contact</span>
            <h2 id="contact-title">Let’s start<br />a conversation.</h2>
            <p>Have a question or want to connect? Share a note and your email application will open with the message prepared.</p>
            <div className="contact-methods">
              <a className="contact-method" href={`mailto:${portfolio.person.email}`}><span className="contact-method-icon"><AtSign size={15} /></span>{portfolio.person.email}</a>
              <a className="contact-method" href={`tel:${portfolio.person.phone.replaceAll(' ', '')}`}><span className="contact-method-icon"><Phone size={15} /></span>{portfolio.person.phone}</a>
              <span className="contact-method"><span className="contact-method-icon"><MapPin size={15} /></span>{portfolio.person.location}</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <div className="field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Name" /></div>
              <div className="field"><label htmlFor="contact-email">Your email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={180} placeholder="you@example.com" /></div>
            </div>
            <div className="field"><label htmlFor="contact-subject">Subject <span className="muted">(optional)</span></label><input id="contact-subject" name="subject" maxLength={160} placeholder="What would you like to discuss?" /></div>
            <div className="field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" required maxLength={4000} placeholder="Write your message here..." /></div>
            <p className="form-note">This form opens your email application. It does not send or store your message.</p>
            <button className="button button-primary contact-submit" type="submit">Prepare email <ArrowUpRight size={14} /></button>
            <p className="form-status" role="status" aria-live="polite">{notice}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
