<p align="center"><img src="logo-full.png" alt="WPS Staff Hub" width="220"></p>

# WPS Staff Hub

A phone-first staff app for Winchester Public School (DDSB). Staff sign in with their board Google account to check student attendance, see yard duty and class schedules, look up students and staff, and use classroom tools.

It's built like the [DIAC Staff Hub](https://github.com/adamryan3976-glitch/DIAC26): a single-page web app on GitHub Pages. It reads from and writes to a Google Sheet through a Google Apps Script web app.

## Features

| Section | What it does |
|---|---|
| **Home** | Current bell period, today's yard duty with an "On duty now" flag, the class timetable and bell schedule, and a prompt when an attendance check is due |
| **Attendance** *(admins can switch it off)* | One-tap Student Attendance Verification at each transition, as required by the DDSB Safe Arrivals Procedure (effective Oct 16, 2026). See below. |
| **Yard Duty** | Weekly duty schedule by day, a "Only my duties" filter, and one-day swaps from the Duty Changes tab |
| **Lookup** | Search students (grade, class, teacher) and staff (role, room, extension, current duty). Open any class for its list and timetable. |
| **Tools** | Name wheel, countdown timer with a chime, and a random group maker. Each pulls names from any class or a custom list. |
| **Admin** | Only the emails listed in the Sheet's **App Admins** setting (not the Staff tab's Admin role). Switches for attendance checks, guest sign-in and guest photo access; one-tap day-cycle correction; days off (snow days); one-day duty changes; office extension; and a link to the Sheet. Every change is written to the Sheet. |

### Attendance in detail

- Safe Arrival (AM/PM) sets the expected count. Every later check confirms against it.
- The app pre-selects the right checkpoint at each bell from the **Bells** tab.
- When a count doesn't match, the teacher is walked through the three board steps: recount, explain (office, washroom, early dismissal…), or **Notify office now**.
- Every check is saved to the **Attendance** tab in the Sheet. If Wi-Fi drops, checks wait on the phone and send automatically when it's back.
- Office and Admin staff see a live **All classes** board. Red means an unresolved "notify office"; amber means a class hasn't checked in for 75 minutes.
- **Weekly form** rebuilds the Appendix A Student Attendance Confirmation Tracker from the saved checks, so it can be printed or copied.
- Only counts and times are recorded, never student names.

## How it works

```
Phone (GitHub Pages)  ──Google sign-in──▶  Apps Script web app  ──▶  Google Sheet (DDSB Drive)
```

- **Sign-in:** Google sign-in (OAuth) returns a token. The Apps Script verifies it and checks the email against the **Staff** tab, then issues a signed session (30 days by default).
- **Access:** every request is re-checked against the Staff tab, so removing someone signs them out.
- **Occasional teachers:** with **Allow Board Guests** set to TRUE, any `@ddsb.ca` account can sign in as a Guest.
- **Data storage:** all student and staff data stays in the Sheet in board Drive. This repo holds no student information.
- **Student photos:** these are kept in the **Photos** tab of that Sheet and sent only to signed-in staff. The app holds them in memory while it's open and never saves them on the device or in this repo.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app: HTML, CSS and JavaScript, no build step |
| `manifest.json`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Home-screen app icons for iPhone and Android |
| `favicon-32.png`, `favicon-48.png`, `favicon-96.png` | Browser-tab icons |
| `sw.js` | Passthrough service worker, so iOS keeps people signed in once the app is installed. It doesn't cache anything. |
| `Code.gs` | The Apps Script backend. Kept here for reference; the live copy runs in the Sheet. |

## Updating

- **Schedules, duty, staff or students:** edit the Google Sheet. Staff get the changes the next time the app loads, or from **Refresh data** at the bottom of Home.
- **The app:** edit `index.html` and commit. GitHub Pages updates within a minute or two.
- **The backend:** edit the script in the Sheet, then go to **Deploy > Manage deployments > Edit > New version** so the web app URL stays the same.

## Configuration

At the top of the script in `index.html`:

```js
const CONFIG = {
  SCRIPT_URL: '…/exec',                          // Apps Script web app URL
  GOOGLE_CLIENT_ID: '….apps.googleusercontent.com', // Google Cloud project "Winchester App Auth"
  SHOW_ATTENDANCE: false                          // fallback if the Sheet has no Show Attendance setting
};
```

Leave `SCRIPT_URL` blank to run a demo with invented data.

Attendance is switched on and off by admins in the app's **Admin** tab, which saves **Show Attendance** in the Sheet. `SHOW_ATTENDANCE` in `index.html` is only used if that setting is missing.

The site's address must be listed under **Authorized JavaScript origins** on the OAuth client in Google Cloud Console.

Full setup steps are in `SETUP.md`.
