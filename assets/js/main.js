/**
 * PARABOARDS.COM — main.js
 * v1.0 — May 2026
 *
 * Responsibilities:
 *   - Mobile nav drawer (toggle, close on Escape, close on outside click)
 *   - aria-expanded state management
 *   - Notify form submission (Track A — email capture)
 *   - No var. No inline event handlers. No sensitive data.
 */

'use strict';

/* ============================================================
   MOBILE NAV
============================================================ */

const navToggle = document.getElementById('nav-toggle');
const navDrawer = document.getElementById('nav-drawer');
const navDrawerLinks = navDrawer ? navDrawer.querySelectorAll('a') : [];

function openDrawer() {
  navDrawer.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation');
  // Move focus to first link in drawer
  const firstLink = navDrawer.querySelector('a');
  if (firstLink) firstLink.focus();
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  navDrawer.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  navToggle.focus();
  document.body.style.overflow = '';
}

function toggleDrawer() {
  const isOpen = navDrawer.classList.contains('is-open');
  isOpen ? closeDrawer() : openDrawer();
}

if (navToggle && navDrawer) {
  navToggle.addEventListener('click', toggleDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Close when a nav link is clicked
  navDrawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      navDrawer.classList.contains('is-open') &&
      !navDrawer.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeDrawer();
    }
  });
}


/* ============================================================
   NOTIFY FORM — Track A (email capture, no deposit)
   Replace action URL with your form backend (Formspree, etc.)
   when ready. Currently shows success state in-page.
============================================================ */

const notifyForms = document.querySelectorAll('[data-form="notify"]');

notifyForms.forEach((form) => {
  const input    = form.querySelector('[data-field="email"]');
  const errorEl  = form.querySelector('[data-error="email"]');
  const successEl = form.querySelector('[data-success]');

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorEl.id);
    }
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.hidden = true;
    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }

  function showSuccess() {
    if (!successEl) return;
    successEl.hidden = false;
    form.hidden = true;
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email = input ? input.value.trim() : '';

    // Client-side validation (UX only — server validates too)
    if (!email) {
      showError('Email address is required.');
      input && input.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError('Please enter a valid email address.');
      input && input.focus();
      return;
    }

    // TODO: Replace with your form backend endpoint
    // Example with Formspree:
    //   const response = await fetch('https://formspree.io/f/YOUR_ID', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //
    // For now, simulate success:
    showSuccess();
  });
});


/* ============================================================
   ACTIVE NAV LINK — mark current page
   Sets aria-current="page" on matching nav links
============================================================ */

(function markActiveNav() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.nav__links a, .nav__drawer-links a');

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
