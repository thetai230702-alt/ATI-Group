# ATI Group UI Refresh V51

## Account experience
- Replaced the always-visible text-heavy user block and separate logout button with a compact account trigger.
- Added a branded account popover with Firebase display name, email, and profile photo when available; otherwise shows an initial.
- Added links to the existing Profile and Information pages.
- Added a secure-session indicator as a UI status label; it does not claim any new security feature.
- Moved sign-out into the popover and retained the existing confirmation and Firebase signOut flow.
- Popover closes on outside click, Escape, and after selecting a destination.
- Added responsive mobile treatment with avatar-only trigger.

## Validation
- Source-level review completed for App.tsx and App.css.
- Production build not run because dependencies are not installed in this environment. Run `npm install` and `npm run build` locally before deployment.
