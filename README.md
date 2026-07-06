# Islam International Stocks — Setup Guide

A live stock-tracking app for your 4 shops (Old, Saiful, Rakib, Liwa). Everyone
who has the app open sees changes the moment anyone else makes them — like a
shared live Excel, but built for daily stock counting on a phone.

You already deploy apps this way (Fustan AI, your inventory PWA) — this
follows the exact same GitHub Pages pattern. Total setup time: ~10 minutes,
one time only.

---

## What you're setting up

- **Firebase** (free, made by Google) — this is the "backend." It stores
  every item and syncs changes to every phone in real time.
- **Google Sign-In** — staff log in with their Gmail. No passwords to manage.
- **GitHub Pages** — hosts the app so it has a real link, installable on
  Android like a normal app.

---

## Step 1 — Create a free Firebase project

1. Go to https://console.firebase.google.com on your phone or any browser.
2. Sign in with your Google account, tap **Add project**.
3. Name it `islam-international-stocks` (or anything), continue through the
   prompts (you can turn off Google Analytics, you don't need it).
4. Once created, tap the **web icon (`</>`)** to register a web app.
   Name it `II Stocks`, no need to check "Firebase Hosting."
5. Firebase will show you a `firebaseConfig` object with keys like
   `apiKey`, `authDomain`, `projectId`, etc. **Copy all of it.**

## Step 2 — Turn on Google Sign-In

1. In the Firebase console, left menu → **Build → Authentication**.
2. Tap **Get started** → under "Sign-in providers" choose **Google** →
   enable it → save.

## Step 3 — Turn on the database (Firestore)

1. Left menu → **Build → Firestore Database** → **Create database**.
2. Choose **Start in production mode** → pick a region close to Oman
   (e.g. `europe-west` or `me-central1` if offered) → Enable.
3. Go to the **Rules** tab and paste the contents of `firestore.rules`
   (included in this folder) over what's there, then **Publish**.
   - The default version lets any signed-in Google account read/write.
   - There's a stricter, commented-out version in that same file that
     locks it to only your staff's Gmail addresses — recommended once
     you actually hand this to your team. Just edit the email list.

## Step 4 — Paste your keys into the app

1. Open `config.js` in this folder.
2. Replace the `PASTE_YOUR_...` placeholders with the real values Firebase
   showed you in Step 1.
3. (Recommended) Fill in `ALLOWED_STAFF_EMAILS` with your staff's Gmail
   addresses, so the app itself also refuses anyone else — matches the
   stricter Firestore rule in Step 3.

## Step 5 — Put it online (GitHub Pages — same as your other apps)

1. Create a new GitHub repo, e.g. `islam-international-stocks`.
2. Upload all the files in this folder: `index.html`, `config.js`,
   `manifest.json`, `sw.js`, `firestore.rules`, and the `icons` folder.
3. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` → Save.
4. GitHub gives you a live link like:
   `https://yourusername.github.io/islam-international-stocks/`

## Step 6 — Install it on your Android phone

1. Open that link in Chrome on your phone.
2. Tap the **⋮** menu → **Add to Home screen** / **Install app**.
3. It now opens full-screen like a real app, with your logo as the icon.
4. Share the same link with Saiful, Rakib, and your other staff — they
   install it the same way on their own phones.

---

## How the app works day-to-day

- Everyone signs in once with their Google account.
- Tap a shop (Old / Saiful / Rakib / Liwa) to see its stock list.
- Tap **+** to add a new item — give it a name, starting quantity, and
  unit (Rolls / Box / Meter / Yard).
- Use **+ / –** on any item to update stock. It saves instantly and every
  other phone with the app open updates within a second or two.
- The **"Recent changes"** list on the shop-picker screen shows who
  changed what, in every shop, so you always know what staff have been
  doing without needing to ask.
- The app also works briefly offline (it caches what it last saw) and
  syncs again once the phone reconnects.

## Cost

Firebase's free tier ("Spark plan") comfortably covers a shop like yours —
thousands of reads/writes a day, well beyond normal daily stock updates.
You won't be asked to pay unless usage grows far beyond that.

## If something breaks

- **"App not configured yet" on login screen** → you haven't pasted your
  keys into `config.js` yet (Step 4).
- **Google sign-in fails** → double check Step 2, and that your GitHub
  Pages domain is added under Firebase → Authentication → Settings →
  Authorized domains (GitHub Pages domains are usually auto-allowed, but
  check here if sign-in errors mention "unauthorized domain").
- **A staff member can't sign in** → check `ALLOWED_STAFF_EMAILS` in
  `config.js` and the Firestore rules in Step 3 both include their Gmail.

---
Made by Ehshan.
