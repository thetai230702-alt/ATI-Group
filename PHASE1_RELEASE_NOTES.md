# ATI Group — Phase 1: Unified UI & Connected Learning

## What changed

### Shared UI foundation
- Added `src/ATIUnifiedSystem.css` and loaded it after the existing app styles.
- Established shared ATI blue/white design tokens, consistent panel borders/radii/shadows, unified form focus states, responsive page gutters, and shared focus-visible behavior.
- Preserved feature-specific component styles and the existing navigation structure.

### Connected learning activity
- Added `src/services/learningActivity.ts` as a shared activity recorder.
- Learning activity is recorded locally per signed-in account (or guest) and synced to the existing Firestore document `users/{uid}/learningProgress/main` using `merge: true`.
- Existing `checklist` and `practice` fields are not replaced. Activity totals and per-day totals are additional fields.
- Offline activity is queued locally and flushed when the device reconnects.
- Recorded actions from: 1,500-sentence practice, listening, Flashcards, CEFR, My Vocabulary, Irregular Verbs, and 12 English Tenses.
- The English learning dashboard now displays a connected cross-module activity overview and recent on-device activity. Module cards navigate directly to the relevant learning area.

## Existing data and Firebase
- No existing Firestore collection names, document paths, vocabulary topic structure, or checklist/practice localStorage keys were renamed or deleted.
- No Firebase security rules or environment secrets are included or modified.
- New aggregate activity fields are merged into the existing per-user learning progress document.

## Environment setup
1. Copy `.env.example` to `.env.local`.
2. Fill in the same Firebase environment values used by your current ATI Group project.
3. Run `npm install` if dependencies are not installed.
4. Run `npm run build` and `npm run dev`.

## Validation
- TypeScript project build (`tsc -b`) passed in the preparation environment.
- Vite bundling could not be completed in this Linux environment because the uploaded `node_modules` does not contain the platform-specific Rolldown native binding. Run `npm install` on Windows (or reinstall dependencies with optional packages enabled), then run `npm run build` locally.
