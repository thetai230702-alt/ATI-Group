# ATI Group — V58 Release Notes

## Quick Command Search 2.0
- Navigate search results with the Up and Down arrow keys.
- Press Enter to open the currently highlighted page.
- Press Escape to clear and close the search field.
- The highlighted result follows mouse hover and has a clearer active state.
- Improved the mobile search results panel with a bounded height, scrolling, and larger tap targets.

## Compatibility
- Built on the V57 source archive.
- No Firebase Storage dependency was added or changed.
- No Firestore schema or security rules changes are required.
- Existing routes, learning data, favorites, notifications, and account settings are preserved.

## Verification
- Source changes were reviewed and the ZIP archive was created.
- A production build was not run in this environment. Run `npm install` and `npm run build` locally before deployment.
