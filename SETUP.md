# WPS Staff Hub – setup

About 20 minutes. It's the same setup as the DIAC Staff Hub.

## What's in this folder

| File | Where it goes |
|---|---|
| `index.html`, `manifest.json`, `sw.js`, `icon.svg` | A new GitHub repo, published with GitHub Pages |
| `Code.gs` | The Apps Script attached to the WPS Staff Hub Google Sheet |

## 1. Make the Sheet (do this in your DDSB account)

1. Create a new Google Sheet called **WPS Staff Hub** in your DDSB Drive. Student names stay in board Drive.
2. Open **Extensions > Apps Script**, delete what's there, and paste in all of `Code.gs`. Save.
3. Pick **setupSheet** from the function menu and press **Run**, then approve the permissions. This creates every tab with headers and sample bell times.

## 2. Fill in the tabs

| Tab | What to enter |
|---|---|
| **Settings** | School name, office extension. Leave **OAuth Client ID** until step 3. |
| **Staff** | One row per person: board email, display name (e.g. *Ms. Kaur*), Role (Teacher, ECE, EA, Office, Admin), Homeroom (e.g. *Room 106*), room, extension, assignment. **Admin and Office roles see the live "All classes" attendance board.** Two people can share a homeroom (teacher + ECE). |
| **Students** | First name, last name, grade, homeroom. Homerooms must match the Staff tab exactly. A class list export pasted in works fine. Enrolment counts come from this tab automatically. |
| **Bells** | The bell schedule. In **Attendance Checkpoint**, pick which bells should prompt a check. The app pre-selects that checkpoint 10 minutes before through 25 minutes after the bell. |
| **Duty** | Day (Monday…Friday, or *Every day*), Time Block (e.g. *Recess 1*), Start, End, Location, Staff (the staff member's name exactly as on the Staff tab; use commas for two people). |
| **Duty Changes** | One-day swaps: date, time block, location, who's covering, who they're replacing. These only show on that date. |
| **Schedules** | Class timetables: homeroom, day, start, end, subject, teacher, room. Add rows for French, Phys. Ed., prep coverage and so on. |
| **Attendance** | Leave empty. The app writes every check here, with the time, count, staff name and any note. This tab is the school's record. |

Times can be typed as `8:50`, `13:30` or `1:30 PM`.

## 3. Google sign-in (OAuth Client ID)

You can reuse the DIAC project in Google Cloud Console:

1. Go to **APIs & Services > Credentials**, then open the DIAC OAuth client (or make a new *Web application* client).
2. Under **Authorized JavaScript origins**, add your new site address, e.g. `https://adamryan3976-glitch.github.io`.
3. Copy the **Client ID** into **Settings > OAuth Client ID** in the Sheet.

## 4. Deploy the script

1. In Apps Script: **Deploy > New deployment > Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**. The URL is public, but every request is checked against the Staff tab, so data only goes to signed-in staff.
3. Copy the web app URL (it ends in `/exec`).

## 5. Publish the app

1. Open `index.html`, find `CONFIG` near the top of the script, and paste in:
   ```js
   SCRIPT_URL: 'https://script.google.com/macros/s/…/exec',
   GOOGLE_CLIENT_ID: '…apps.googleusercontent.com'
   ```
2. Create a new GitHub repo (e.g. `WPS-Hub`), upload the four files, and turn on **Settings > Pages** (main branch, root).
3. Open the Pages address on a phone and choose **Add to Home Screen**.

## Occasional teachers

When **Allow Board Guests** is TRUE, anyone signing in with an `@ddsb.ca` account who isn't on the Staff tab gets in as a **Guest**. They pick the class they're covering on the Attendance screen. Set it to FALSE to allow only people on the Staff tab.

## Good to know

- **Taking someone off the Staff tab** signs them out at their next request.
- **Lost Wi-Fi:** checks save on the phone and send automatically when the connection is back. The Attendance screen shows "*n* waiting to send" until they're delivered.
- **Updating the script:** after editing `Code.gs`, use **Deploy > Manage deployments > Edit > New version** so the URL stays the same.
- **Shared devices:** the app caches the staff and student lists on the device for fast loading. **Sign out** (bottom of Home) clears them.
