'use client';

import type { AboutLang } from './render-about';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

const T = {
  th: {
    sending: 'กำลังส่งข้อความ…',
    sent: 'ส่งข้อความเรียบร้อยแล้ว ขอบคุณที่ติดต่อเรา เราจะตอบกลับไปยังอีเมลที่คุณให้ไว้',
    failed: 'ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือ',
    notReady: 'แบบฟอร์มยังไม่ได้เชื่อมต่อกับระบบส่งอีเมล กรุณา',
    fallback: 'ส่งอีเมลถึงเราโดยตรง',
  },
  en: {
    sending: 'Sending…',
    sent: "Message sent. Thanks for getting in touch — we'll reply to the address you gave us.",
    failed: "That didn't go through. Please try again, or ",
    notReady: "This form isn't connected to a mail service yet. Please ",
    fallback: 'email us directly',
  },
};

const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/**
 * Behaviour for the server-rendered about page markup (ported from the design's script.js):
 * language toggle, mobile nav, scroll reveal, active nav link, contact form.
 * The markup is replaced when the language changes, so everything re-binds per `lang`.
 */
export function AboutScript({ lang }: { lang: AboutLang }) {
  const router = useRouter();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.tem-about');
    if (!root) return undefined;
    const t = T[lang];
    const cleanups: Array<() => void> = [];
    const on = (el: EventTarget, type: string, fn: EventListener) => {
      el.addEventListener(type, fn);
      cleanups.push(() => el.removeEventListener(type, fn));
    };

    // language toggle
    root.querySelectorAll<HTMLButtonElement>('.lang button').forEach((b) => {
      on(b, 'click', () => router.replace(`?lang=${b.dataset.lang}`, { scroll: false }));
    });

    // mobile nav
    const toggle = root.querySelector('#navToggle');
    const nav = root.querySelector('#nav');
    if (toggle && nav) {
      on(toggle, 'click', () => toggle.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
      on(nav, 'click', (e) => {
        if ((e.target as HTMLElement).tagName !== 'A') return;
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    // scroll reveal
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // active nav link
    const links = new Map<string, Element>();
    root.querySelectorAll('.nav a[href^="#"]').forEach((a) => links.set(a.getAttribute('href')!.slice(1), a));
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const link = links.get(entry.target.id);
          if (!link || !entry.isIntersecting) return;
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    root.querySelectorAll('section[id]').forEach((s) => spy.observe(s));
    cleanups.push(() => spy.disconnect());

    // contact form — posts to a form-to-email endpoint once one is configured, otherwise offers mailto
    const form = root.querySelector<HTMLFormElement>('#contactForm');
    const statusBox = root.querySelector<HTMLElement>('#formStatus');
    const emailField = root.querySelector<HTMLInputElement>('#f-email');
    const emailError = root.querySelector<HTMLElement>('#f-email-error');
    if (form && statusBox && emailField && emailError) {
      const subjectField = root.querySelector<HTMLInputElement>('#f-subject');
      const messageField = root.querySelector<HTMLTextAreaElement>('#f-message');
      const submitBtn = form.querySelector<HTMLButtonElement>('.btn-submit');
      const endpoint = form.dataset.endpoint || '';
      const address = form.dataset.mailto || '';
      const configured = !endpoint.includes('YOUR_FORM_ID') && /^https?:\/\//.test(endpoint);

      const mailtoLink = () => {
        const subject = subjectField?.value.trim() || 'ThaiEconoMap';
        let body = messageField?.value.trim() || '';
        const from = emailField.value.trim();
        if (from) body += `\n\n— ${from}`;
        return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      };
      const say = (kind: string, text: string, withFallback = false) => {
        statusBox.className = `form-status ${kind}`;
        statusBox.textContent = text;
        if (!withFallback) return;
        const a = document.createElement('a');
        a.href = mailtoLink();
        a.textContent = t.fallback;
        statusBox.append(a, '.');
      };
      const clearEmailError = () => {
        emailField.removeAttribute('aria-invalid');
        emailError.hidden = true;
      };

      on(emailField, 'input', () => {
        if (emailField.getAttribute('aria-invalid') === 'true' && validEmail(emailField.value)) clearEmailError();
      });

      on(form, 'submit', (e) => {
        e.preventDefault();
        if (!validEmail(emailField.value)) {
          emailField.setAttribute('aria-invalid', 'true');
          emailError.hidden = false;
          emailField.focus();
          say('', '');
          return;
        }
        clearEmailError();
        if (!configured) {
          say('warn', t.notReady, true);
          return;
        }
        if (submitBtn) submitBtn.disabled = true;
        say('', t.sending);
        fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            say('ok', t.sent);
            form.reset();
          })
          .catch(() => say('err', t.failed, true))
          .finally(() => {
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [lang, router]);

  return null;
}
