V26: Seamless hero shading + HNS gold WhatsApp consultation button.
All other V25 features retained.

V24: Fixed excessive empty space above fixed bottom dock by eliminating duplicated app-shell bottom padding and reducing content/footer padding. All V23 content and functions retained.

V22 update: Social Links buttons are approximately 30% smaller and all have a unified dark-blue gradient. All links and other features preserved.

HNS Digital Business Card — V21

Updated multilingual greeting: தமிழ் / മലയാളം / हिन्दी / සිංහල / Welcome.
All previous V20 features and mobile-only design preserved.

V20: Header share icon and its click handler removed. All other features retained.

# HNS Digital Business Card — V19

Updates:
- **Get a Free Consultation** opens a prefilled WhatsApp chat directly to +971 50 633 5059.
- Appointment date/day/time inputs are collapsed behind a **Book a Date for the Appointment** toggle button inside the appointment modal.
- When submitting the appointment form, the date panel opens for validation and the selected preferences are included in the prepared WhatsApp inquiry.
- All existing features, videos, images, logo, social icons, and mobile layout remain.

Note: This is an inquiry, not an automatic booking/availability confirmation.

V18 — Social links refreshed with HNS navy panel and platform-inspired colour gradients. All existing links and functionality remain unchanged.

# HNS Digital Business Card — V17

Updates from V16:
- Added the uploaded **Helen and Sons — Since 2007** logo (assets/hns-logo-v17.png).
- Added **Welcome** to the multilingual homepage greeting.
- Added a date, Sunday–Saturday preferred-day selection, and 8 one-hour time slots (10 AM–6 PM UAE/GST) to Book an Appointment.
- The chosen date, day, and time are included in the WhatsApp inquiry.
- This does **not** check real availability or confirm an appointment; Sir's team must reply.

Run with VS Code Live Server on index.html. No build step required.

HNS Digital Business Card V16

Updated portrait image asset to anurajh-v16.png using the newly supplied transparent image.

# HNS Digital Business Card — V15 Appointment Edition

Run locally: extract this ZIP, open the folder in Visual Studio Code, then right-click `index.html` and choose **Open with Live Server**.

## V15 changes
- Smooth navy-to-black shading between hero portrait and name (no visible hard horizontal line).
- Fixed center dock button replaced from QR Code to **Book Appointment**.
- Gold/blue appointment dialog: Name, Email, Contact Number, and all 14 services in a native dropdown.
- Form validation; submit opens a pre-filled WhatsApp inquiry for +971 50 633 5059. **This is an inquiry, not a confirmed booking.** You must tap Send in WhatsApp. No server/database currently stores submissions.
- Contact Info, Save Contact, portrait, original HNS logo, About video, hero video, social media links, and mobile-only layout are maintained.

## Configuration
Edit `config.js` for Sir's contact details and social links. All assets are bundled under `assets/`.

## Hosting
Upload the contents to any static web hosting provider. The website works without a Node build process. When live, remember the previously discussed NFC BusinessBay URL / printed QR code considerations.

## Notes
The hero background video attempts silent inline autoplay. Some mobile browsers and iOS Low Power Mode can still block autoplay; in that case the poster is shown without a Play Background button. Confirm the "15 years" experience statement with Sir before publication.


## V23
Reduced fixed bottom navigation height and gold appointment button approximately 20–25%, retained all click behavior, fixed positioning and accessible touch targets.

## V25 phone polish
- Removed the optional hero “Play background” overlay entirely.
- Mobile-friendly H.264 silent video (`assets/hero-background-mobile-v25.mp4`) is used in the hero, with `autoplay muted loop playsinline` and a clean poster fallback.
- An unobtrusive playback retry runs on the first tap if the browser permits it; autoplay cannot be forced on every iOS device setting.
- Get a Free Consultation now shows a WhatsApp icon instead of the arrow. The link still opens the WhatsApp message to Sir.
- All other sections, contact actions, booking form, About Me video, and fixed dock remain as in V24.
