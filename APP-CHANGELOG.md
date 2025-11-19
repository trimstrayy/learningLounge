#+ Mock Tests — Detailed internal behavior (per-test)

This file documents, for each of the four mock tests (Listening, Reading, Writing, Speaking), exactly what exists right now in the app, whether interactive questions are implemented, and what happens when a user clicks Submit / Exit. Use this as a quick developer reference.

---

## Summary (one-liner)
- Listening, Reading, Speaking: mock environments with regulated timing, sample content and timers — but no interactive question UI or answer submission is implemented yet.
- Writing: a working answer input area exists (typed answer + handwritten image upload) and Submit is implemented client-side; on successful submit the user is redirected back to the Mock Tests listing with a completion flag.

---

## Per-test details

1) Listening Test (`src/pages/ListeningTest.tsx`)

- What exists now:
	- An overview and section breakdown (4 sections) matching IELTS Listening.
	- A themed audio placeholder area (visual waveform box) where the real audio player will be added later.
	- A countdown timer (default 30 minutes) and Begin Test / Exit Test controls.
	- A small, static list of placeholder question descriptions (e.g., "Section 1 — Questions 1-10 ...").

- Are there interactive questions or inputs?
	- No. There is no interactive question UI (no inputs, no answer fields, no selection controls) for listening questions yet — only placeholder text describing the question types.

- What happens when the user clicks Submit / End test?
	- There is no Submit button on the Listening page currently. The only exit path is the Exit Test flow which opens a confirmation modal. Confirming exit resets the timer and navigates back to `/mock-tests`.

- Notes / next steps:
	- Add an audio player component (with playback controls and section-sync) and a UI for per-question inputs (short answer, multiple choice, form completion, etc.).
	- Wire answer state and a Submit flow that collects answers and either saves to localStorage or posts to a backend.

2) Reading Test (`src/pages/ReadingTest.tsx`)

- What exists now:
	- An overview and three-section breakdown matching IELTS Reading.
	- A countdown timer (default 60 minutes) and Begin Test / Exit Test controls.
	- A description of question types (multiple choice, matching headings, sentence completion) as placeholder content.

- Are there interactive questions or inputs?
	- No. There is no interactive reading question UI implemented yet — only descriptive placeholders.

- What happens when the user clicks Submit / End test?
	- There is no Submit button implemented for Reading. The Exit Test button opens the exit confirmation modal; confirming resets the timer and navigates to `/mock-tests`.

- Notes / next steps:
	- Implement passage rendering, question components (e.g., MCQ, matching, fill-in), per-question state, and a Submit flow.
	- Consider pagination per section and a clear way to review answers before final submit.

3) Speaking Test (`src/pages/SpeakingTest.tsx`)

- What exists now:
	- An overview describing the 3 parts of the speaking test and sample prompts.
	- A timer (default ~14 minutes), Begin Test / Exit Test controls.
	- A sample Task Card for the Long Turn (Part 2) and practice prompts.

- Are there interactive questions or inputs?
	- No. There is no audio recording UI or answer-submission UI. The page only presents prompts/instructions and a timer.

- What happens when the user clicks Submit / End test?
	- There is no Submit button and no local recording storage. Exit Test opens confirmation modal; confirming resets the timer and navigates back to `/mock-tests`.

- Notes / next steps:
	- Add a simple in-browser recorder (MediaRecorder) with permission handling, local temporary storage and optional upload to a back end.
	- Provide a review screen showing recorded attempts before final submit.

4) Writing Test (`src/pages/WritingTest.tsx`)

- What exists now:
	- Full UI for the writing test with Task 1 and Task 2 placeholder prompts and suggested timing.
	- An editable typed answer area (large `Textarea`) and an upload control to submit an image of a handwritten answer.
	- A countdown timer (default 60 minutes) visible in the top bar.
	- A Submit Answer button and a Back to Tests button.

- Are there interactive questions or inputs?
	- Yes — the writing page contains the actual input fields where a user can type their answers and optionally upload an image file.

- What happens when a user clicks Submit Answer?
	- Validation: The submit handler checks whether the user provided a typed answer (non-empty `Textarea`) or uploaded an image. If neither is present, it shows a destructive toast asking the user to provide an answer.
	- If an answer (typed or uploaded) exists:
		- The UI shows a success toast: "Answer submitted! Your writing test has been submitted for evaluation.".
		- After a short delay (~1.5 seconds) the app navigates back to `/mock-tests?completed=writing`.
		- There is no server-side submission or persistence implemented in the current code — the behavior is entirely client-side and only simulates submission by showing a toast and redirecting.

- What happens to the user's typed answer / uploaded image after submit?
	- Currently: nothing persistent. The app does not save the typed answer nor upload the image to a server. After redirect, the in-memory state is lost. The uploaded image is not persisted beyond the page session.

- Notes / next steps:
	- Implement a backend endpoint (or cloud storage) to store uploaded images and answers, or persist temporarily in localStorage until a confirmed upload occurs.
	- Add a confirmation/summary page showing the final answers and optionally allow the user to download a copy.

---

## Cross-test notes

- Timers: all test pages use client-side countdown timers. They do not persist across page reloads (unless you implement localStorage persistence).
- Completion tracking: the only completion flow implemented is the WritingTest redirect which includes a query param `?completed=writing`. The rest of the tests have no submit/complete tracking yet.
- UX expectations: currently these pages are mock/test-environment placeholders that need question rendering, answer inputs, storage, and scoring to become full exam simulators.

---

If you want, I can now implement any of the following (pick one or more):
- Add per-test question UI and a Submit flow that saves answers to localStorage.
- Add server upload stubs (mock API) for Writing uploads and implement real persistence.
- Add a simple in-browser recorder for Speaking and save recordings temporarily.
- Persist timers and in-progress answers so the user can resume after accidental navigation.

Tell me which you'd like first and I'll implement it.
