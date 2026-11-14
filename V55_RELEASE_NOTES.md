# ATI Group UI Refresh V55

## ATI Settings Center
- Added a dedicated Settings page at `/tai-khoan/cai-dat`.
- Added navigation entry under the sidebar's customization section and a shortcut in the account popover.
- Added Light / Dark theme selection with browser persistence.
- Added persisted Sidebar collapsed preference.
- Added in-app notification enable/disable preference; when disabled, new learning-sync status notifications are not generated.
- Dark theme styles cover the app shell, sidebar, topbar, search, account menu, notification panel, and the new settings/dashboard surfaces.
- Existing routes, Firebase authentication, learning progress sync, and notification actions are retained.

## Scope and limitations
- Preferences are stored in localStorage on the current browser/device, not synchronized through Firestore.
- Language switching is not included because the app's pages are not yet fully localized; a language toggle would otherwise give a misleading partial experience.
- Dark styling for specialized learning feature pages may need follow-up refinement after visual testing.

## Validation
- Source-level consistency review completed for App.tsx, Sidebar.tsx, Settings.tsx, and related CSS.
- Production build not run because dependencies are not installed in this environment. Run `npm install` and `npm run build` locally before deployment.
