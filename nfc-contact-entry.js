/*
 * HNS V53 — Contact-first landing.
 * Android: opens Phone/dialer through a normal tel: link, with the number filled in.
 * DOES NOT open Google Contacts or download a .vcf on Android.
 * Visitor must choose Add to Contacts / Create contact in their Phone app,
 * enter any additional details, and confirm Save. Phone app behavior varies.
 * iPhone: unchanged .vcf contact preview.
 */
(() => {
  'use strict';

  const curtain = document.getElementById('hns-contact-welcome');
  const save = document.getElementById('hns-welcome-save');
  const after = document.getElementById('hns-welcome-after');
  const profile = document.getElementById('hns-welcome-profile');
  const alternative = document.getElementById('hns-android-vcf-fallback');
  const note = curtain?.querySelector('.hns-welcome-note');
  if (!curtain || !save || !after || !profile) return;

  const VISITED_KEY = 'hns-v46-profile-visited';
  try {
    if (localStorage.getItem(VISITED_KEY) === '1') return;
  } catch (_) {}

  curtain.hidden = false;
  document.body.classList.add('hns-contact-first-visit');
  document.body.style.overflow = 'hidden';

  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (alternative) alternative.hidden = true;

  if (isAndroid) {
    save.href = 'tel:+971506335059';
    save.removeAttribute('download');
    save.removeAttribute('target');
    save.removeAttribute('rel');
    after.textContent = 'In your Phone app, tap Add to Contacts / Create Contact, then confirm Save. Return here to view Sir’s profile.';
    if (note) note.textContent = 'Phone app opens with Sir’s number. The contact is not saved automatically.';
  } else {
    save.href = 'Anurajh-Loganathan-HNS.vcf';
    save.removeAttribute('download');
    save.removeAttribute('target');
    save.removeAttribute('rel');
    after.textContent = isIOS
      ? 'In the contact preview, choose Add Contact / Save, then return here to view Sir’s full profile.'
      : 'Open the contact card and confirm Save, then return to view the profile.';
    if (note) note.textContent = 'Your phone requires your confirmation to save a contact.';
  }

  save.addEventListener('click', () => {
    // Do not pretend the user already saved: opening the Phone app is only step one.
    after.hidden = false;
    profile.hidden = false;
  });

  profile.addEventListener('click', () => {
    try { localStorage.setItem(VISITED_KEY, '1'); } catch (_) {}
    curtain.hidden = true;
    document.body.classList.remove('hns-contact-first-visit');
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
})();
