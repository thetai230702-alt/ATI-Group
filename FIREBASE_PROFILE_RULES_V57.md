# ATI V57 — Firebase Rules for Cloud Profile

V57 uses:
- Firestore document: `users/{uid}/private/profile`
- Storage object: `avatars/{uid}/profile.jpg`

Deploy these rules in Firebase Console only after reviewing them against your existing app rules. Do not blindly replace broader rules used by other ATI features.

## Firestore Rules snippet

```javascript
match /users/{userId}/private/profile {
  allow read, create, update: if request.auth != null
    && request.auth.uid == userId;
  allow delete: if request.auth != null
    && request.auth.uid == userId;
}
```

Place this match inside your existing `service cloud.firestore { match /databases/{database}/documents { ... } }` block.

## Firebase Storage Rules snippet

```javascript
match /avatars/{userId}/profile.jpg {
  allow read: if request.auth != null
    && request.auth.uid == userId;
  allow write: if request.auth != null
    && request.auth.uid == userId
    && request.resource.size < 5 * 1024 * 1024
    && request.resource.contentType.matches('image/.*');
}
```

Place this match inside your existing `service firebase.storage { match /b/{bucket}/o { ... } }` block.

## Important
- The app must have Firebase Storage enabled and `VITE_FIREBASE_STORAGE_BUCKET` configured correctly.
- These rules are snippets, not a complete replacement for existing rules.
- The existing project may have other `users/{uid}` data paths; preserve their current access rules.
- Profile fields include personal and emergency-contact details. Keep the profile document private to its owner.
