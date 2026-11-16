/* HNS V47 — first visit contact card. Phone OS, not website, confirms saving. */
(() => {
  'use strict';
  const curtain = document.getElementById('hns-contact-welcome');
  const save = document.getElementById('hns-welcome-save');
  const after = document.getElementById('hns-welcome-after');
  const profile = document.getElementById('hns-welcome-profile');
  if (!curtain || !save || !profile) return;
  const flag = 'hns-v46-profile-visited';
  let visited = false;
  try { visited = localStorage.getItem(flag) === '1'; } catch (_) {}
  if (visited) return;
  curtain.hidden = false;
  document.body.classList.add('hns-contact-first-visit');
  document.body.style.overflow = 'hidden';
  const showNext = () => { after.hidden = false; profile.hidden = false; };
  save.addEventListener('click', showNext);
  const showProfile = () => {
    try { localStorage.setItem(flag, '1'); } catch (_) {}
    curtain.hidden = true;
    document.body.classList.remove('hns-contact-first-visit');
    document.body.style.overflow = '';
    window.scrollTo({top:0,behavior:'instant'});
  };
  profile.addEventListener('click', showProfile);
})();
