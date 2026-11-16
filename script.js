'use strict';
(() => {
  const c = window.HNS_CARD || {};
  const $ = (id) => document.getElementById(id);
  const safe = (s) => String(s || '').trim();
  const url = (s) => { const v = safe(s); if (!v) return ''; try { const u = new URL(v); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const local = ['file:', 'http:'].includes(location.protocol) && (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname));
  const publicUrl = url(c.publicUrl) || (local ? '' : location.origin + location.pathname);
  const shareUrl = publicUrl || url(c.currentCardUrl);
  let toastTimeout;
  const toast = (message) => { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('show'), 3600); };
  document.title = `${safe(c.name) || 'Digital Card'} | HNS`;
  $('person-name').innerHTML = (safe(c.name) || 'Anurajh Loganathan').split(/\s+/).map((part, idx, parts) => idx === parts.length - 1 ? `<em>${escapeHtml(part)}</em>` : escapeHtml(part)).join(' ');
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline && safe(c.tagline)) heroHeadline.textContent = safe(c.tagline);
  const consultation = $('consultation-button');
  const waContact = safe(c.whatsapp).replace(/\D/g,'');
  // Homepage free consultation CTA opens WhatsApp directly, not the appointment modal.
  if (consultation && waContact) {
    consultation.href = `https://wa.me/${waContact}?text=${encodeURIComponent('Hello, I would like a free consultation about business setup in the UAE.')}`;
    consultation.target = '_blank';
    consultation.rel = 'noopener noreferrer';
  }
  // About Me now has bespoke paragraphs; only use legacy field when the element exists.
  if ($('about-text')) $('about-text').textContent = safe(c.about);
  $('year').textContent = new Date().getFullYear();
  if (safe(c.role)) { $('person-role').hidden = false; $('person-role').textContent = c.role; }
  const companyUrl = url(c.website);
  if (companyUrl) { const a = $('company-link'); a.hidden = false; a.href = companyUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  // Compact, icon-only social row at the bottom of the mobile site.
  const links = [];
  const phone = safe(c.phone);
  const wa = safe(c.whatsapp).replace(/\D/g,'');
  if (wa) links.push(['WhatsApp','assets/icon-whatsapp.svg',`https://wa.me/${wa}`]);
  if (url(c.linkedin)) links.push(['LinkedIn','assets/icon-linkedin.svg',url(c.linkedin)]);
  if (url(c.instagram)) links.push(['Instagram','assets/icon-instagram.svg',url(c.instagram)]);
  if (url(c.facebook)) links.push(['Facebook','assets/icon-facebook.svg',url(c.facebook)]);
  if (url(c.threads)) links.push(['Threads','assets/icon-threads.svg',url(c.threads)]);
  const grid = $('contact-grid');
  for (const [label, icon, href] of links) {
    const a = document.createElement('a');
    a.className = 'social-icon-link';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', label);
    a.title = label;
    const img = document.createElement('img');
    img.src = icon;
    img.alt = '';
    img.width = 29;
    img.height = 29;
    img.loading = 'lazy';
    a.append(img);
    grid.append(a);
  }
  if(!links.length){$('setup-hint').hidden=false;grid.hidden=true;}
  const gallery = Array.isArray(c.gallery) ? c.gallery.filter(item => typeof item.src === 'string' && /^(images\/|assets\/)/.test(item.src) && !item.src.includes('..')) : [];
  if(gallery.length){ $('gallery').hidden=false; for(const item of gallery){const figure=document.createElement('div');figure.className='gallery-item'; const img=document.createElement('img');img.src=item.src;img.alt=safe(item.title)||'HNS gallery photo';img.loading='lazy';figure.append(img);if(safe(item.title)){const p=document.createElement('p');p.textContent=item.title;figure.append(p);}$('gallery-grid').append(figure);} }
  else $('gallery-nav').hidden=true;
  const vcard = () => {
    const clean = (v) => safe(v).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/[;,]/g, '\\$&');
    const lines=['BEGIN:VCARD','VERSION:3.0',`FN:${clean(c.name)}`,`ORG:${clean(c.company)}`];
    if(safe(c.role))lines.push(`TITLE:${clean(c.role)}`);
    if(phone)lines.push(`TEL;TYPE=CELL:${clean(phone)}`);
    if(safe(c.email))lines.push(`EMAIL;TYPE=INTERNET:${clean(c.email)}`);
    if(companyUrl)lines.push(`URL:${clean(companyUrl)}`);
    else if(shareUrl)lines.push(`URL:${clean(shareUrl)}`);
    if(safe(c.address))lines.push(`ADR;TYPE=WORK:;;${clean(c.address)};;;;`);
    lines.push('END:VCARD');return lines.join('\r\n');
  };
  $('save-contact')?.addEventListener('click',()=>{const a=document.createElement('a');a.href='Anurajh-Loganathan-HNS.vcf';a.download='Anurajh-Loganathan-HNS.vcf';document.body.append(a);a.click();a.remove();toast('Open the contact file and tap Add Contact / Save.');});
  async function copyLink(){if(!shareUrl){toast('Publish your website first, or set publicUrl in config.js.');return;}try{await navigator.clipboard.writeText(shareUrl);toast('Website link copied!');}catch{window.prompt('Copy this link:',shareUrl);}}
  function share(){if(!shareUrl){toast('Publish your site to get its own share link.');return;} if(navigator.share){navigator.share({title:`${c.name} | HNS`,url:shareUrl}).catch(()=>{});}else {copyLink();}}
  $('share-card')?.addEventListener('click',share);$('copy-link')?.addEventListener('click',copyLink);// Dock contact-info dialog — all labels use the editable config values.
  const contactModal = $('contact-info-modal');
  $('dock-contact-info')?.addEventListener('click', () => { if(contactModal && !contactModal.open) contactModal.showModal(); });
  contactModal?.addEventListener('click', (event) => { if (event.target === contactModal) contactModal.close(); });
  const ph = safe(c.phone), em = safe(c.email), web = url(c.website), loc = safe(c.address);
  if(ph) { $('contact-phone-value').textContent = ph; $('contact-modal-phone').href = `tel:${ph.replace(/[^+\d]/g,'')}`; }
  if(em) { $('contact-email-value').textContent = em; $('contact-modal-email').href = `mailto:${em}`; }
  if(web) { $('contact-web-value').textContent = new URL(web).hostname.replace(/^www\./,''); $('contact-modal-website').href = web; }
  if(loc) $('contact-location-value').textContent = loc;
  // Appointment inquiry: client-side only; opens WhatsApp with user-provided details.
  const appointmentModal = $('appointment-modal');
  const appointmentForm = $('appointment-form');
  const openAppointment = () => {
    if(appointmentModal && !appointmentModal.open) appointmentModal.showModal();
  };
  $('dock-appointment')?.addEventListener('click', openAppointment);
  $('close-appointment')?.addEventListener('click', () => appointmentModal?.close());
  appointmentModal?.addEventListener('click', event => { if (event.target === appointmentModal) appointmentModal.close(); });
  // UAE calendar booking preference. A requested slot is not a confirmed reservation.
  const bookingDate = $('appointment-date');
  const bookingDay = $('appointment-day');
  const bookingTime = $('appointment-time');
  const bookingToggle = $('booking-date-toggle');
  const bookingPanel = $('booking-date-panel');
  const setBookingExpanded = (expanded) => {
    if (!bookingPanel || !bookingToggle) return;
    bookingPanel.hidden = !expanded;
    bookingToggle.setAttribute('aria-expanded', String(expanded));
    bookingToggle.classList.toggle('expanded', expanded);
  };
  bookingToggle?.addEventListener('click', () => setBookingExpanded(bookingPanel.hidden));
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // Read Dubai's current calendar day, not the visitor's browser timezone.
  const todayDubai = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type,p.value]));
    return `${values.year}-${values.month}-${values.day}`;
  };
  const parseCalendarDay = value => {
    const [year,month,day] = value.split('-').map(Number);
    return new Date(Date.UTC(year,month - 1,day));
  };
  const isoCalendarDay = date => date.toISOString().slice(0,10);
  if(bookingDate && bookingDay){
    bookingDate.min = todayDubai();
    bookingDate.addEventListener('change', () => {
      if(!bookingDate.value) return;
      bookingDay.value = dayNames[parseCalendarDay(bookingDate.value).getUTCDay()];
      bookingDate.setCustomValidity('');
    });
    bookingDay.addEventListener('change', () => {
      const selectedDay = dayNames.indexOf(bookingDay.value);
      if(selectedDay === -1) return;
      const today = parseCalendarDay(todayDubai());
      const offset = (selectedDay - today.getUTCDay() + 7) % 7;
      today.setUTCDate(today.getUTCDate() + offset);
      bookingDate.value = isoCalendarDay(today);
      bookingDate.setCustomValidity('');
    });
  }
  appointmentForm?.addEventListener('submit', async event => {
    event.preventDefault();
    setBookingExpanded(true);
    const status = $('booking-status');
    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const showStatus = (message, kind='error') => {
      if (status) { status.textContent = message; status.dataset.kind = kind; status.hidden = false; }
    };
    if(!appointmentForm.reportValidity()) return;
    const payload = {
      name: $('appointment-name').value.trim(),
      email: $('appointment-email').value.trim(),
      phone: $('appointment-phone').value.trim(),
      service: $('appointment-service').value,
      date: bookingDate?.value || '',
      day: bookingDay?.value || '',
      time: bookingTime?.value || '',
      website: $('appointment-company-website')?.value || '',
      consent: Boolean($('appointment-consent')?.checked)
    };
    if(payload.day !== dayNames[parseCalendarDay(payload.date).getUTCDay()]){
      bookingDate.setCustomValidity('Please select a date matching your preferred day.');
      bookingDate.reportValidity(); return;
    }
    const settings = window.HNS_BOOKING || {};
    if(!settings.supabaseUrl || !settings.publishableKey){
      showStatus('Booking system setup is not complete. Please contact us using the consultation WhatsApp button.');
      return;
    }
    if(submitButton) submitButton.disabled=true;
    showStatus('Submitting your request…','pending');
    try {
      const root = settings.supabaseUrl.replace(/\/$/, '');
      const controller = new AbortController();
      const timeout = setTimeout(()=>controller.abort(),15000);
      let response;
      try {
        response = await fetch(`${root}/functions/v1/submit-booking`,{
          method:'POST',
          headers:{'Content-Type':'application/json','apikey':settings.publishableKey},
          body:JSON.stringify(payload), signal:controller.signal
        });
      } finally { clearTimeout(timeout); }
      const result = await response.json().catch(()=>({}));
      if(!response.ok || !result.ok) throw new Error(result.error || 'Unable to submit the request. Please try again.');
      showStatus('Your request was received! Our team will contact you to confirm the appointment.','success');
      appointmentForm.reset();
      setBookingExpanded(false);
      setTimeout(()=>{ if(appointmentModal?.open) appointmentModal.close(); },2200);
    } catch (err) {
      showStatus(err.name==='AbortError'?'The request timed out. Please retry or contact us on WhatsApp.':(err.message||'An error occurred. Please try again.'));
    } finally { if(submitButton) submitButton.disabled=false; }
  });
  // Decorative hero video: silent, inline playback with no on-screen control.
  // Safari/iOS may block autoplay in Low Power Mode; keep the poster as a clean fallback.
  const heroVideo = $('hero-background-video');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');
    const tryHeroPlay = () => {
      if (document.hidden) {
        heroVideo.pause();
        return;
      }
      if (!heroVideo.paused) return;
      const attempt = heroVideo.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {
        // No manual playback badge: the background poster remains visible.
      });
    };
    // A silent retry on the visitor's first tap can unlock playback where permitted.
    const tryAfterInteraction = () => tryHeroPlay();
    document.addEventListener('touchstart', tryAfterInteraction, { once: true, passive: true });
    document.addEventListener('pointerdown', tryAfterInteraction, { once: true, passive: true });
    heroVideo.addEventListener('canplay', tryHeroPlay);
    heroVideo.addEventListener('loadedmetadata', tryHeroPlay);
    document.addEventListener('visibilitychange', tryHeroPlay);
    window.addEventListener('pageshow', tryHeroPlay);
    if (typeof reduceMotion.addEventListener === 'function') reduceMotion.addEventListener('change', tryHeroPlay);
    tryHeroPlay();
  }
  // Reveal lower sections as the visitor scrolls through the mobile card.
  const sections = document.querySelectorAll('.lower-grid, .share-section, .gallery-section');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }, { threshold: 0.1 });
    sections.forEach(el => {if (!el.hidden) {el.classList.add('reveal-on-scroll');observer.observe(el);}});
  }
  const menu=$('menu-toggle'), side=$('sidebar'),backdrop=$('sidebar-backdrop');
  function menuSet(open){side.classList.toggle('open',open);backdrop.hidden=!open;menu.setAttribute('aria-expanded',String(open));}
  menu.addEventListener('click',()=>menuSet(!side.classList.contains('open')));backdrop.addEventListener('click',()=>menuSet(false));
  document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('active'));a.classList.add('active');menuSet(false);}));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')menuSet(false)});
})();


/* V9: About section video — autoplay muted for mobile browser compatibility. */
(() => {
  const video = document.getElementById('about-appreciation-video');
  const button = document.getElementById('about-video-control');
  if (!video || !button) return;
  const setIcon = () => {button.textContent = video.paused ? '▶' : 'Ⅱ';button.setAttribute('aria-label', video.paused ? 'Play About Me video' : 'Pause About Me video');};
  const attemptPlay = () => { const promise = video.play(); if (promise && promise.catch) promise.catch(setIcon); };
  button.addEventListener('click', () => {if (video.paused) attemptPlay(); else video.pause();setIcon();});
  video.addEventListener('play',setIcon);video.addEventListener('pause',setIcon);
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', attemptPlay, {once:true});else attemptPlay();
  setIcon();
})();
