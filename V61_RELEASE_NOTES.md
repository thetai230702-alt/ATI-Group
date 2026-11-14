# ATI Group — V61 Language Switch

## Added
- Added a horizontal language selector in the top bar with Vietnam and United States flags.
- Vietnamese (VI) and English (EN) can be selected instantly.
- Language preference is saved in localStorage and restored on the next visit.
- Updated page titles, global search prompts, notification header, key sidebar labels, and ATI main dashboard/activity summary for English mode.
- The selector adapts to mobile widths by showing the flags without the text codes.

## Scope
- This is the first bilingual UI pass. Learning content and some specialized feature screens may still contain their original language; these need a separate translation pass to ensure accurate terminology and preserve learning materials.

## Compatibility
- Based on V60. No Firebase Storage, Firestore schema, or security-rule changes.
- Existing routes, account features, and learning data remain unchanged.

## Verification
- Source archive created. Production build not run in this environment; run `npm run build` before deployment.
