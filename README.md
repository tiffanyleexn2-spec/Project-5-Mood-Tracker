# Project 05 — Mood Tracker

> **🛠️ Stack for this lesson** — SvelteKit · Vite · Firebase v10 (Auth + Firestore).
> 📥 Template: [/learn/w3/template/project-05-mood-tracker](/learn/w3/template/project-05-mood-tracker)

A two-phase capstone. Phase 1 already runs against a writable Svelte store with mock data so you can see the UX flow in 30 seconds. Phase 2 swaps the mock store for Firestore, builds a real auth store, and locks moods to the signed-in user.

**Time:** ~120 minutes (Phase 1 ~15, Firebase Console ~15, Phase 2 ~90) · **Concept:** Concepts 10–11 · Project 05

---

## What You'll Build

| Phase | TODO | Where |
|-------|------|-------|
| 0 | Run the app once with mock data; confirm the UI flow before touching Firebase | — |
| Console | Create Firebase project · enable Email/Password sign-in · create Firestore in test mode | console.firebase.google.com |
| 1 | Copy `.env.example` to `.env` and fill the six `VITE_FIREBASE_*` keys | project root |
| 2 | Finish `src/stores/authStore.js` — a writable that exposes `subscribe`, `setUser`, `clearUser`, plus a global `onAuthStateChanged` listener that drives it | `src/stores/authStore.js` |
| 3 | Implement `signup.svelte` and `login.svelte` to call Firebase Auth and redirect home on success | `src/routes/login.svelte`, `src/routes/signup.svelte` |
| 4 | Replace the mock `moodStore.js` body — `moods` should subscribe to a `query(collection(db,'moods'), where('userId','==',uid), orderBy('timestamp','desc'))` and `onSnapshot` updates | `src/lib/stores/moodStore.js` |
| 5 | Update `addMood` to write a doc with `{ userId, mood, note, timestamp: serverTimestamp() }` and `deleteMood` to call `deleteDoc` | `src/lib/stores/moodStore.js` |
| 6 | In `index.svelte`, redirect to `/login` if `$authStore.isLoggedIn === false` | `src/routes/index.svelte` |

The mock-data UX (mood selector, note field, history list with relative timestamps, delete confirm) is fully built and stays useful as a regression target after the Firestore swap.

## Run It

```bash
npm install
npm run dev                              # Phase 1: mock data flow
cp .env.example .env                     # Phase 2: fill VITE_FIREBASE_* values
# restart the dev server after editing .env
```

Open `http://localhost:5173`. Add `localhost` to *Firebase Console → Authentication → Settings → Authorized domains* before signing in.

## Verify

**Phase 1 (mock)**
- [ ] Selecting a mood and submitting prepends a card to the history with relative timestamp.
- [ ] Delete confirms then removes the card.

**Phase 2 (Firebase)**
- [ ] No "Firebase not configured" error appears in the console after the dev server restart.
- [ ] Signing up via `/signup` lands on `/`; signing out flips back to `/login`.
- [ ] Adding a mood writes a doc to `moods/<random-id>` with `userId`, `mood`, `note`, `timestamp`.
- [ ] A second tab signed in as the same user sees new moods appear without a refresh (proof `onSnapshot` is wired).
- [ ] Signing in as a different user shows a separate, isolated history (proof `where('userId','==',uid)` is in the query).
- [ ] Deleting a mood removes the doc both in the UI and in Firestore.

## Stretch

- Add an Edit modal that uses `updateDoc()` to change the note.
- Render a 7-day mood chart (e.g. `Chart.js` or hand-rolled SVG) from the same store.
- Tighten Firestore rules from test mode: `allow read, write: if request.auth.uid == request.resource.data.userId`.

## 🪞 Reflect on Your Work

Answer in 2-3 sentences each, in this README under your TODO commits. Your tutor reads these as part of grading.

1. **What did you learn that you didn't know before?** Name the most surprising thing — `onAuthStateChanged` driving a store, the cost of `serverTimestamp()` vs `new Date()`, anything that bit you.
2. **How did you collaborate with AI?** If you used Claude / ChatGPT / Cursor / Copilot, what part of the work did *you* contribute — the prompt, the verification, the design decision, the bug-fix? If you didn't use AI, what was the hardest thing to figure out alone?
3. **How do you know your code works?** Describe one specific thing you did to confirm — a Firestore screenshot, two-tab sync, a test you ran.

> AI is a great collaborator. Owning your thinking, verifying the output, and explaining your design choices is what *learning* looks like in this course.

## Grading Rubric

| Criterion | Weight | What we look for |
|-----------|--------|------------------|
| Auth flow | 30% | Signup, login, logout work end-to-end and the auth store reflects state across pages. |
| Firestore swap | 30% | Mock arrays gone; query filters by user; real-time updates work. |
| Protected routing | 15% | Unauthenticated users can't see the dashboard. |
| Code hygiene | 15% | No leftover mock data; `.env` not committed; queries use `serverTimestamp()`. |
| Polish | 10% | Verify list passes, README's reflection answered. |

## Submit

When the Verify checklist is green, head to **[/learn/w3/certification](/learn/w3/certification)** and submit your repo URL or zipped project (exclude `node_modules/` and `.env`). Include a Firestore screenshot of the `moods` collection and the Auth users list.

<!-- claude-template-fix: readme-v3 -->
