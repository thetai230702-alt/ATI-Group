# ATI Group — V59 Release Notes

## ATI Dashboard 2.0 — Activity Pulse
- Added an ecosystem-level activity summary to the main ATI dashboard.
- Shows today's checked-sentence count, current study streak, and total checked sentences over the last seven days.
- Added a compact seven-day activity bar chart.
- Refreshes when learning activity changes, when another tab updates local storage, and when the user returns to the page.
- Reuses the existing study activity data model; no new Firestore collections, Storage setup, or Firebase Rules are required.
- The dashboard clearly labels this activity as device-local data; it does not imply cloud synchronization.

## Compatibility
- Based on V58; existing routes, favorites, notification center, account profile, settings, and learning features remain intact.

## Verification
- Source files were updated and the release archive was created.
- A production build was not run in this environment. Run `npm install` and `npm run build` locally before deployment.
