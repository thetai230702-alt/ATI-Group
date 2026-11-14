# ATI Group UI Refresh V56

## ATI Profile 2.0
- Added avatar upload to the account profile page.
- Validates image MIME type and rejects files larger than 5 MB.
- Crops the uploaded image to a centered square and resizes it to 320x320 JPEG before saving to reduce local storage use.
- Persists avatar and profile data in the existing per-user browser storage record.
- Added remove-avatar action to restore the initials avatar.
- Added profile-completion percentage based on 12 basic profile fields.
- Added clear upload/storage error feedback.
- Added dark-theme styling for the profile form and completion panel.
- Preserved existing profile tabs and learning sync status display.

## Compatibility and scope
- Avatar is stored locally in the current browser/device; it is not uploaded to Firebase Storage and does not automatically appear in the account menu on other devices.
- Existing local profile storage key and fields are retained to avoid discarding user-entered profile data.
- No activity timeline is fabricated; an activity history should be connected to real Firestore events in a later release.

## Validation
- Reviewed Profile.tsx, Profile.css, Settings.tsx, App.tsx and Sidebar.tsx for imports and route wiring.
- Removed unused icon imports from Settings.tsx to avoid TypeScript noUnusedLocals errors.
- Production build not run because dependencies are not installed in this environment. Run `npm install` and `npm run build` locally before deployment.
