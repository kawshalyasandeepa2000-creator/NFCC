(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const cfg=window.HNS_BOOKING||{};
  const root=(cfg.supabaseUrl||'').replace(/\/$/,'');
  const key=cfg.publishableKey||'';
  // Password reset links contain short-lived Supabase tokens in the URL fragment.
  // Read and erase the fragment immediately, before the page makes any network calls.
  const rawHash=location.hash.startsWith('#') ? location.hash.slice(1) : '';
  const authFragment=new URLSearchParams(rawHash);
  const authQuery=new URLSearchParams(location.search);
  const initialRecoveryToken=authFragment.get('type')==='recovery' ? authFragment.get('access_token') : '';
  const initialAuthError=authFragment.get('error_description') || authQuery.get('error_description') || '';
  if(rawHash || authQuery.has('error') || authQuery.has('code')) {
    history.replaceState(null,'',location.pathname); // scrub sensitive fragments and one-use codes
  }
  let recoveryToken=initialRecoveryToken;
  const showAuth=(name)=>{
    for(const id of ['login','forgot','recovery']) $(id).hidden=id!==name;
  };
  const emailRequest=async(path,email)=>{
    const response=await fetch(root+path,{
      method:'POST',headers:{'apikey':key,'Content-Type':'application/json'},
      body:JSON.stringify({email})
    });
    if(!response.ok){
      let error='Request failed. Try again later.';
      try {const data=await response.json();error=data.msg||data.error_description||data.message||error;}catch{}
      throw Error(error);
    }
  };
  $('forgot-open').addEventListener('click',()=>{
    $('forgot-email').value=$('email').value;
    $('forgot-message').textContent='';showAuth('forgot');
  });
  $('forgot-back').addEventListener('click',()=>showAuth('login'));
  $('recovery-back').addEventListener('click',()=>{recoveryToken='';showAuth('login');});
  $('forgot-form').addEventListener('submit',async(e)=>{
    e.preventDefault();const btn=$('forgot-submit');btn.disabled=true;
    $('forgot-message').textContent='Sending recovery email…';
    try{
      // redirect_to MUST be in Supabase Authentication > URL Configuration allowlist.
      const redirect=location.origin+location.pathname;
      await emailRequest('/auth/v1/recover?redirect_to='+encodeURIComponent(redirect),$('forgot-email').value.trim());
      $('forgot-message').textContent='If this email is registered, a recovery link will be sent. Check Inbox, Junk and your company mail quarantine. Use the newest link only.';
    }catch(error){$('forgot-message').textContent='Could not request recovery: '+error.message;}
    finally{btn.disabled=false;}
  });
  $('recovery-form').addEventListener('submit',async(e)=>{
    e.preventDefault();const btn=$('recovery-submit');const status=$('recovery-message');
    status.classList.remove('error');
    const password=$('new-password').value;
    if(password.length<12 || password!==$('confirm-password').value){
      status.textContent=password.length<12?'Please use at least 12 characters.':'The passwords do not match.';
      status.classList.add('error');return;
    }
    if(!recoveryToken){status.textContent='Recovery link is missing or expired. Request a new one.';status.classList.add('error');return;}
    btn.disabled=true;status.textContent='Saving new password…';
    try{
      const resp=await fetch(root+'/auth/v1/user',{
        method:'PUT',headers:{'apikey':key,'Authorization':'Bearer '+recoveryToken,'Content-Type':'application/json'},
        body:JSON.stringify({password})
      });
      if(!resp.ok){let reason='The link might have expired.';try{const data=await resp.json();reason=data.msg||data.message||data.error_description||reason;}catch{}throw Error(reason);}
      recoveryToken='';$('new-password').value='';$('confirm-password').value='';
      $('login-error').textContent='Password updated successfully. Sign in with your new password.';
      showAuth('login');
    }catch(error){status.classList.add('error');status.textContent='Password update failed: '+error.message;}
    finally{btn.disabled=false;}
  });
  const statuses=['new','contacted','confirmed','completed','cancelled'];
  let token='',bookings=[];
  const message=(m)=>{$('dashboard-message').textContent=m;};
  const api=async(path,opts={})=>{
    const r=await fetch(root+path,{...opts,headers:{'apikey':key,'Authorization':`Bearer ${token}`,'Content-Type':'application/json',...(opts.headers||{})}});
    if(!r.ok) { let msg='Request failed ('+r.status+')';try{const e=await r.json();msg=e.message||e.error_description||msg;}catch{}throw Error(msg); }
    if(r.status===204)return null;
    return r.json();
  };
  const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
  const td=()=>document.createElement('td');
  const render=()=>{
    const term=$('search').value.toLowerCase(),filter=$('filter').value;
    $('total').textContent=bookings.length;
    $('new').textContent=bookings.filter(b=>b.status==='new').length;
    $('confirmed').textContent=bookings.filter(b=>b.status==='confirmed').length;
    const list=bookings.filter(b=>(!filter||b.status===filter) && [b.name,b.email,b.phone,b.service].join(' ').toLowerCase().includes(term));
    const tbody=$('rows');tbody.replaceChildren();
    for(const b of list){
      const tr=el('tr');let c=td();c.textContent=new Date(b.created_at).toLocaleString();tr.append(c);
      c=td();c.textContent=b.name;tr.append(c);
      c=td();const mail=el('a',b.email);mail.href='mailto:'+b.email;c.append(mail,el('span',b.phone));tr.append(c);
      c=td();c.textContent=b.service;tr.append(c);
      c=td();c.textContent=b.appointment_date+' • '+b.appointment_day;c.append(el('span',b.appointment_time));tr.append(c);
      c=td();c.textContent=b.email_status;tr.append(c);
      c=td();const select=el('select');select.setAttribute('aria-label','Status for '+b.name);for(const st of statuses){const opt=el('option',st);opt.value=st;select.append(opt);}select.value=b.status;
      select.addEventListener('change',async()=>{const val=select.value;select.disabled=true;try{await api('/rest/v1/hns_appointments?id=eq.'+encodeURIComponent(b.id),{method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({status:val})});b.status=val;message('Status updated.');render();}catch(e){select.value=b.status;message(e.message);}finally{select.disabled=false;}});c.append(select);tr.append(c);tbody.append(tr);
    }
    if(!list.length){const tr=el('tr'),cell=el('td','No matching bookings');cell.colSpan=7;tr.append(cell);tbody.append(tr);}
  };
  const refresh=async()=>{message('Loading inquiries…');try{bookings=await api('/rest/v1/hns_appointments?select=id,created_at,name,email,phone,service,appointment_date,appointment_day,appointment_time,status,email_status&order=created_at.desc&limit=1000');render();message(bookings.length===1000?'Showing latest 1,000 bookings. Filter in dashboard or paginate via API for older records.':'Bookings loaded.');}catch(e){message(e.message);if(/401|403|jwt|permission/i.test(e.message))logout();}};
  const login=async(event)=>{event.preventDefault();$('login-error').textContent='';try{const r=await fetch(root+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'apikey':key,'Content-Type':'application/json'},body:JSON.stringify({email:$('email').value,password:$('password').value})});const obj=await r.json();if(!r.ok||!obj.access_token)throw Error('Unable to sign in. Check staff credentials.');token=obj.access_token; // dashboard token stays in memory; not persisted to disk
      const test=await api('/rest/v1/hns_admin_users?select=user_id&limit=1');if(!test.length)throw Error('This user is not authorized for the HNS dashboard.');$('login').hidden=true;$('main').hidden=false;$('logout').hidden=false;$('password').value='';await refresh();}catch(e){token='';$('login-error').textContent=e.message;}};
  const logout=()=>{token='';bookings=[];$('login').hidden=false;$('main').hidden=true;$('logout').hidden=true;$('rows').replaceChildren();};
  $('logout').addEventListener('click',logout);$('login-form').addEventListener('submit',login);$('refresh').addEventListener('click',refresh);$('search').addEventListener('input',render);$('filter').addEventListener('change',render);
  $('export').addEventListener('click',()=>{const fields=['created_at','name','email','phone','service','appointment_date','appointment_day','appointment_time','status','email_status'];const csv=[fields.join(','),...bookings.map(b=>fields.map(f=>'"'+String(b[f]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n');const file=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(file);const a=el('a');a.href=url;a.download='HNS-bookings-'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  const configured=root.startsWith('https://') && key.startsWith('sb_publishable_') && !key.includes('PASTE_');
  if(!configured){$('setup').hidden=false;showAuth('none');}
  else if(initialRecoveryToken){showAuth('recovery');}
  else if(initialAuthError){$('login-error').textContent='Recovery link error: '+initialAuthError+'. Request a new link and use the latest email.';}

})();
