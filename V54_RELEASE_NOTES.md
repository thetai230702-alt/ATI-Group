# ATI Group UI Refresh V54

## ATI Notification Center
- Added a notification bell to the authenticated Topbar with an unread counter.
- Notification panel supports mark-all-read, mark individual notification read, and clear all.
- Notifications are generated only from observed learning sync state transitions:
  - successful sync
  - sync error
  - offline status
- Empty state explains that learning sync updates appear here; no fake announcements or fabricated course reminders are seeded.
- Notifications persist in localStorage scoped to the Firebase user UID, capped at 30 recent items.
- Handles account changes by loading the corresponding user's notification list.
- Panel closes on outside click and Escape; opening notifications closes the account popover.
- Responsive panel sizing and accessible labels included.

## Scope and limitations
- This is device/browser-local persistence, not cross-device Firestore synchronization.
- No push notifications or background notifications are claimed.

## Validation
- Source-level review completed for App.tsx and App.css.
- Production build not run because dependencies are not installed in this environment. Run `npm install` and `npm run build` locally before deployment.
