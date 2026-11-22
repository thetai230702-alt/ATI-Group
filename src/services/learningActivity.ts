import { doc, increment, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export type LearningModule =
  | "sentences"
  | "flashcards"
  | "cefr"
  | "my-vocabulary"
  | "irregular-verbs"
  | "listening"
  | "grammar";

export type LearningAction =
  | "answer-checked"
  | "remembered"
  | "needs-practice"
  | "word-added"
  | "word-reviewed"
  | "listening-started"
  | "lesson-opened";

export type LearningActivityEvent = {
  id: string;
  module: LearningModule;
  action: LearningAction;
  itemId?: string;
  itemLabel?: string;
  unitNumber?: number;
  correct?: boolean;
  createdAt: number;
};

const EVENT_LIMIT = 300;
const eventKey = (uid: string) => `ati-learning-activity-events-${uid}`;
const pendingKey = (uid: string) => `ati-learning-activity-pending-${uid}`;

function localDay(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getLocalLearningActivities(uid = auth.currentUser?.uid ?? "guest"): LearningActivityEvent[] {
  try {
    const raw = localStorage.getItem(eventKey(uid));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is LearningActivityEvent =>
      !!item && typeof item === "object" &&
      typeof (item as LearningActivityEvent).id === "string" &&
      typeof (item as LearningActivityEvent).module === "string" &&
      typeof (item as LearningActivityEvent).action === "string" &&
      typeof (item as LearningActivityEvent).createdAt === "number"
    ) : [];
  } catch {
    return [];
  }
}

function queuePending(uid: string, event: LearningActivityEvent): void {
  try {
    const raw = localStorage.getItem(pendingKey(uid));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const pending = Array.isArray(parsed) ? parsed as LearningActivityEvent[] : [];
    localStorage.setItem(pendingKey(uid), JSON.stringify([...pending, event].slice(-EVENT_LIMIT)));
  } catch { /* The local activity history remains the fallback. */ }
}

async function syncActivityEvent(uid: string, event: LearningActivityEvent): Promise<void> {
  const progressRef = doc(db, "users", uid, "learningProgress", "main");
  const day = localDay(event.createdAt);
  await setDoc(progressRef, {
    activityTotals: { [event.module]: increment(1) },
    activityByDay: { [day]: increment(1) },
    lastActivity: {
      module: event.module,
      action: event.action,
      itemId: event.itemId ?? "",
      itemLabel: event.itemLabel ?? "",
      unitNumber: event.unitNumber ?? null,
      correct: event.correct ?? null,
      at: event.createdAt,
    },
  }, { merge: true });
}

export async function flushPendingLearningActivities(uid = auth.currentUser?.uid): Promise<void> {
  if (!uid || !navigator.onLine) return;
  let pending: LearningActivityEvent[] = [];
  try {
    const raw = localStorage.getItem(pendingKey(uid));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    pending = Array.isArray(parsed) ? parsed as LearningActivityEvent[] : [];
  } catch { return; }
  if (!pending.length) return;

  const remaining: LearningActivityEvent[] = [];
  for (const event of pending) {
    try { await syncActivityEvent(uid, event); }
    catch { remaining.push(event); }
  }
  try { localStorage.setItem(pendingKey(uid), JSON.stringify(remaining)); } catch { /* Ignore unavailable storage. */ }
}

export function recordLearningActivity(
  module: LearningModule,
  action: LearningAction,
  details: Omit<LearningActivityEvent, "id" | "module" | "action" | "createdAt"> = {},
): void {
  const uid = auth.currentUser?.uid ?? "guest";
  const createdAt = Date.now();
  const event: LearningActivityEvent = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
    module,
    action,
    ...details,
    createdAt,
  };

  try {
    const next = [event, ...getLocalLearningActivities(uid)].slice(0, EVENT_LIMIT);
    localStorage.setItem(eventKey(uid), JSON.stringify(next));
  } catch {
    // Learning must continue even when local storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent("ati-learning-activity-updated", { detail: event }));

  if (uid === "guest") return;
  if (!navigator.onLine) {
    queuePending(uid, event);
    return;
  }

  // merge:true preserves checklist/practice fields in the existing per-user progress document.
  void syncActivityEvent(uid, event).catch((error) => {
    queuePending(uid, event);
    console.warn("ATI learning activity queued for later sync:", error);
  });
}
