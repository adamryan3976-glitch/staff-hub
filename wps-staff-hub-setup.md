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

## Day 1–5 cycle and days off

Duty and class timetables can use **Day 1** to **Day 5** in the Day column, as well as weekday names or *Every day*.

- The app works out today's cycle day from three settings: **Cycle Days** (5), **Cycle Anchor Date** and **Cycle Anchor Day**. Oct 27, 2026 was Day 4.
- It counts school days forward and back from that date, skipping weekends and every date on the **No School Days** tab, so the cycle pauses over PA days and breaks.
- **No School Days** lists only dates when *neither* calendar has classes. Winchester is dual-calendar, so the modified-calendar breaks (Oct 13–23, Mar 5–12, May 14–21) are regular school days for the cycle. Add any extra closures there, such as a snow day. The 2026–27 list was checked date by date against both board calendars.
- If the cycle ever gets out of step, change **Cycle Anchor Date** and **Cycle Anchor Day** to today and today's day number.

To load a new duty schedule:
1. Open the **Duty** tab.
2. Go to **File > Import > Upload**, choose the CSV, and pick **Replace current sheet**.

"Your duty" matches by last name ("Adams"), by initial and last name ("S. Wright"), or by full name, so Staff tab names should include each person's first and last name.

## Student list and photos (from the PowerSchool Photo Report)

1. Paste in the latest `Code.gs` and run `setupSheet()` again. This adds a **Photo Key** column to Students and a new **Photos** tab.
2. Open **Students** and go to **File > Import > Upload**. Choose `Students.csv`, then **Replace current sheet**. Homerooms come in as "Room 206" and so on, so use the same format in the Staff tab's Homeroom column.
3. Open **Photos** and import `Photos.csv` the same way. It's about 4 MB, so give it a minute.
4. **Deploy > Manage deployments > Edit > New version**. The first time, Google will ask you to approve the script again.

Only signed-in staff can load photos, and only for the students on screen. The first load after a deploy takes a few seconds while the script caches them; after that it's quick. Gender and birth date from the report are not imported.

To update for a new school year, export a new Photo Report and ask Claude to rebuild both CSVs.

## Timetables

- The **Schedules** tab uses **Day 1–Day 5** in the Day column. These match the Horarium Mon–Fri columns: Mon = Day 1 … Fri = Day 5.
- The period layout (P1–P10, two recesses and lunch) is `DAY_PLAN` near the top of `index.html`. Edit it there if bell times change.

## News tab (Winchester announcements)

The News tab reads the **Winchester Announcements** Sheet directly. Staff still post on the announcements site.

1. Paste in the latest `Code.gs` and run `setupSheet()` again. This adds two settings: **Announcements Sheet** and **Announcements Site**.
2. Paste the link to the Winchester Announcements Google Sheet into **Announcements Sheet**. The account that deploys the Staff Hub script needs at least view access to it, and to the lunchroom monitor sheet.
3. **Deploy > Manage deployments > Edit > New version**. Google asks for approval again, because the script now reads other Sheets and the announcement photos in Drive.

The News tab shows up for everyone once the setting is filled in. Changes on the announcements site appear within about 2 minutes.
