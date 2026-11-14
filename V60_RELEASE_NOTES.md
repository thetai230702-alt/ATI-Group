# ATI Group — V60 Hotfix

## Fixed
- Fixed `Uncaught ReferenceError: ChartNoAxesCombined is not defined` in `Dashboard.tsx`.
- Added the missing `ChartNoAxesCombined` import from `lucide-react`.
- No UI behavior, data model, Firebase configuration, routes, or existing features were changed.

## Verification
- Confirmed the Dashboard component now imports the icon it renders.
- A production build was not run in this environment. Run `npm run build` locally to complete verification.
