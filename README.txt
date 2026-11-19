SURAKSHA SETU - WEBSITE PROJECT (HTML, CSS, BOOTSTRAP + JAVASCRIPT)

WHAT IS INCLUDED
- Existing 8 pages and original visual layout are retained.
- Firebase email/password registration and login.
- Sign-up collects full name, mobile number, email, password and confirm password.
- Phone OTP is verified first, then the email/password credential is linked to that phone account.
- Phone OTP login.
- Google sign-in.
- Apple sign-in.
- Firebase password reset.
- Dashboard sign-in status and sign-out.
- Add/remove trusted contacts in browser storage.
- Save Share & Receive preferences in browser storage.
- Add/delete reminders in browser storage.
- Contact form prepares an email in the user's default mail application.

FILES
HTML: index.html, login.html, dashboard.html, emergency.html, family.html,
      safety.html, about.html, contact.html
CSS: style.css
JavaScript: auth.js, dashboard-auth.js, app.js
Firebase config: firebase-config.js

FIREBASE SETUP REQUIRED BEFORE AUTHENTICATION WILL WORK
1. Open https://console.firebase.google.com/
2. Select project: sumit-web-16cd2
3. Go to Authentication > Sign-in method.
4. Enable Email/Password.
5. Enable Phone.
6. Enable Google and select a support email.
7. Enable Apple. Apple sign-in also requires Apple Developer configuration:
   Services ID, Team ID, Key ID and private key in Firebase provider settings.
8. Authentication > Settings > Authorized domains:
   add localhost and the exact GitHub Pages/custom domain where this site runs.
9. For Phone Authentication, Firebase uses reCAPTCHA and SMS verification.
   Use a real phone number or configure Firebase test phone numbers for testing.

HOW TO RUN
- Do not open the HTML file using file:// for Firebase modules.
- Open the folder in VS Code and run it with Live Server (localhost).
- For GitHub Pages, publish the files at the repository root and add that domain
  to Firebase Authentication authorized domains.
- Internet access is required for Bootstrap and Firebase CDN modules.

IMPORTANT BEHAVIOUR / LIMITATIONS
- Email/password and phone OTP use Firebase Authentication.
- Phone OTP is linked to the email account during sign-up. Phone sign-in is also
  available as a separate sign-in option.
- Google and Apple buttons call Firebase OAuth providers, but they work only
  after enabling and configuring those providers in Firebase Console.
- Contacts and Share & Receive preferences are stored in this browser only.
  They are NOT shared with family members or synced between devices.
- Reminders are stored in this browser only. They do not create background
  notifications or alarms.
- Contact form opens the user's email app; it does not submit to a server.
- Emergency tel: links open the device dialler where supported. This website
  does not automatically call, track location or dispatch emergency teams.
- This is a student prototype, not an official emergency response service.

SECURITY
- Never add Firebase service-account private keys to this website.
- Configure Firebase Authentication and appropriate security controls.
- Do not collect real medical or emergency data until a secure backend,
  privacy policy, consent controls and access rules are implemented.
