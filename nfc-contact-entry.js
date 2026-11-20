/*
 * HNS V52 – contact-first NFC entry.
 * iPhone / iPad: native VCF preview as before.
 * Android: open prefilled Google Contacts "create contact" page (no .vcf download
 * prompt on the primary path). Some Android phones may open the Contacts app.
 * If a visitor does not use Google Contacts, offer the native phone dialer as
 * a no-download alternative. A plain website cannot force all Android phones
 * to launch the native add-contact editor; contact save requires confirmation.
 */
(() => {
  'use strict';

  const curtain = document.getElementById('hns-contact-welcome');
  const save = document.getElementById('hns-welcome-save');
  const after = document.getElementById('hns-welcome-after');
  const profile = document.getElementById('hns-welcome-profile');
  const alternative = document.getElementById('hns-android-vcf-fallback');
  if (!curtain || !save || !after || !profile) return;

  const VISITED_KEY = 'hns-v46-profile-visited'; // Keep existing return-visit behavior.
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

  const showProfile = () => {
    after.hidden = false;
    profile.hidden = false;
    if (alternative && isAndroid) alternative.hidden = false;
  };

  if (isIOS) {
    // Preserve the previously working iPhone contact preview.
    save.href = 'Anurajh-Loganathan-HNS.vcf';
    save.removeAttribute('download');
    save.removeAttribute('target');
    save.removeAttribute('rel');
    after.textContent = 'Choose Add Contact / Save in the contact preview, then return here to view Sir’s full profile.';
  } else if (isAndroid) {
    // Android Chrome/Samsung Internet cannot reliably invoke ACTION_INSERT:
    // Chrome requires a BROWSABLE exported Activity, which Contacts may lack.
    // Link to the pre-filled Google Contacts create-contact page instead.
    const url = new URL('https://contacts.google.com/new');
    url.searchParams.set('givenname', 'Anurajh');
    url.searchParams.set('familyname', 'UAE Business Setup');
    url.searchParams.set('phone', '+971506335059');
    url.searchParams.set('email', 'anurajh.raju@helensonsuae.com');
    save.href = url.toString();
    save.target = '_blank';
    save.rel = 'noopener noreferrer';
    save.removeAttribute('download');

    after.textContent = 'Review the contact in Google Contacts and tap Save. Then return here to view Sir’s profile. Google sign-in may be needed.';
    if (alternative) {
      alternative.href = 'tel:+971506335059';
      alternative.textContent = 'No Google Contacts? Open Phone app to add number';
      alternative.removeAttribute('download');
    }
  } else {
    // Desktop / other browsers keep vCard compatibility.
    save.href = 'Anurajh-Loganathan-HNS.vcf';
    save.removeAttribute('download');
    save.removeAttribute('target');
    save.removeAttribute('rel');
    after.textContent = 'Open the contact card and confirm Save, then return to the profile.';
  }

  save.addEventListener('click', showProfile);

  profile.addEventListener('click', () => {
    try { localStorage.setItem(VISITED_KEY, '1'); } catch (_) {}
    curtain.hidden = true;
    document.body.classList.remove('hns-contact-first-visit');
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
})();
