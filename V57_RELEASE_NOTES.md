# ATI Group UI Refresh V57

## ATI Cloud Profile
- Added Firebase Storage initialization and export.
- Profile page loads the user's private Firestore profile document at `users/{uid}/private/profile`.
- Profile save uploads a locally selected avatar to `avatars/{uid}/profile.jpg`, obtains its download URL, and writes profile fields to Firestore.
- Added cloud loading/saving/synced/error status UI.
- Retains the existing per-device local cache as a fallback.
- Added avatar removal behavior and a Firebase rules setup guide.

## Firebase setup required
- Enable Firebase Storage in the project and verify `VITE_FIREBASE_STORAGE_BUCKET`.
- Add the Firestore and Storage rules snippets from `FIREBASE_PROFILE_RULES_V57.md` into existing rules without overwriting unrelated application rules.
- Cloud profile features will show an error until the services and rules are configured.

## Scope and privacy
- Profile document is scoped to the signed-in user's UID.
- Storage image is scoped to `avatars/{uid}/profile.jpg`.
- No broad public read access is introduced by the provided rules snippets.

## Validation
- Source-level review completed.
- Production build not run because dependencies are not installed in this environment. Run `npm install` and `npm run build` locally before deployment.
