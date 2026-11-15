# ATI Group UI Refresh V49

## Loading screen palette alignment
- Replaced the dark navy full-screen loading background with the same light blue / near-white family used by the signed-in workspace (`#f3f6fb` and white surfaces).
- Changed the loading card from translucent dark glass to a clean white card with a subtle ATI blue top accent.
- Updated title and caption colors to navy/muted blue for contrast.
- Kept the ATI orange accent in the progress bar and orbit marker; the second marker now uses ATI blue.
- Preserved existing loading state logic, animations, reduced-motion support, and layout.

## Validation
- CSS source-level review completed.
- Production build not run because dependencies are not installed in this environment. Run `npm install` and `npm run build` locally before deployment.
