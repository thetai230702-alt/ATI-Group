# ATI Group UI Refresh V50

## Global quick search
- Added an app-wide search field to the authenticated top bar.
- Search indexes the existing page titles and tab identifiers only; it does not fabricate module content or require a backend.
- Selecting a result navigates to the existing route and closes the result panel.
- Enter opens the first matching result; Escape closes the panel.
- Added Ctrl+K / Cmd+K shortcut to focus search.
- Added responsive compact search trigger behavior on mobile.
- Preserved existing authentication, route identifiers, Firebase integration, and learning data behavior.

## Validation
- Reviewed modified JSX, hook placement, route mapping and CSS.
- Production build not run: dependencies are not installed in this environment. Run `npm install` and `npm run build` locally before deployment.
