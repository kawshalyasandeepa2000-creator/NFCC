# HNS V45 — Password Recovery Setup

## Upload to AEserver cPanel
1. Back up the live website files.
2. In cPanel > Domains, confirm the Document Root of `anurajh.helensons.ae`.
3. Upload this ZIP into that Document Root and **Extract**. `index.html`, `booking-config.js`, `dashboard/` and `assets/` must be directly under the Document Root — do not nest inside another project folder.
4. Important: `booking-config.js` in this ZIP contains a **placeholder** publishable key. **Back up your existing working live `booking-config.js` before extracting**, then preserve/restore that configured file OR paste your existing `sb_publishable_...` key back into the new file. The public project URL is already set. Do not upload a service-role key, Resend API secret or SMTP password to the website.
5. Open `https://anurajh.helensons.ae/dashboard/` and hard refresh.

## Supabase Authentication
- Authentication > URL Configuration > Site URL: `https://anurajh.helensons.ae`
- Add Redirect URL: `https://anurajh.helensons.ae/dashboard/`
- Save changes.
- Authentication > Emails > SMTP Settings: verify your custom SMTP is enabled and email delivery actually works. `Delivered` means accepted by the receiving mail server; check spam/quarantine.
- Dashboard > Staff sign in > **Forgot password?** > send recovery link to Sir's registered email.
- Use the newest link; clicking it should open `/dashboard/#access_token=...&type=recovery`, and the browser will immediately clear the fragment and show **Choose a new password**.
- Create a 12+ character password, then sign in.
- Existing `hns_admin_users` permission and RLS policies remain required.

## If the email URL opens the dashboard but does not show reset form
Make sure the URL has a recovery `access_token` fragment (do NOT share the fragment). If a custom email template changed the flow to PKCE code exchange, this static recovery handler expects an implicit recovery token; restore the standard Supabase recovery template or contact the developer for PKCE exchange support.

## Security
- No admin or service-role secrets are included.
- Never send recovery tokens or passwords in screenshots.
- Public booking endpoint security (bot checks, per-IP rate limiting) still needs its own production verification before enabling anonymous requests.
- An SMTP sender verified in Resend still needs recipient-level delivery testing, especially with pre-existing company mail DNS records.
