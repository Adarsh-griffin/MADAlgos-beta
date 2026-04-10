# MADAlgos Assessment Platform Architecture

This document outlines the end-to-end flow, data architecture, and integration points for the new Assessment Platform (Test Portal). This system allows admins to dispatch unique, tokenized test links to students seamlessly, without requiring the students to hold an active site account.

---

## 1. Admin Workflow: Test Creation & Management

1. **Admin logs into the Admin Panel**.
2. **Creates a Test Session**:
   - Assigns a name (e.g., *"TCS DSA Round - Batch 7"*).
   - Sets a **time limit** for the test (e.g., 90 minutes).
   - Sets **link validity** (e.g., 1 day, 10 hours, custom date).
   - **Adds MCQ Questions**: Question text, 4 options, the correct answer, and allocated marks.
   - **Adds Coding Problems**: Title, description, input/output formats, sample test cases (visible), hidden test cases (for grading), and allocated marks.
3. **Clicks "Generate & Send Links"**:
   - The system creates **one unique token per student**.
   - Stores the token in the Database with: `studentId` (or email), `testId`, `expiresAt`, and `usedAt = null`.
   - **SendGrid** fires an email to each student with their unique link.
4. **Live Dashboard Monitoring**:
   - Tracks who opened the link.
   - Tracks who is currently taking the test.
   - Tracks who submitted.
   - Views scores in real-time.

---

## 2. Student Workflow: Taking the Test

1. **Student Receives Email**:
   - Email contains their unique link, e.g., `https://madalgos.in/test?token=abc123xyz`.
2. **Student Clicks the Link**:
   - The server validates the token against the Database:
     1. Does this token exist in the DB?
     2. Has it expired? *(checks `expiresAt`)*
     3. Has it already been used? *(checks `usedAt`)*
   - **If any check fails** → Show *"Link invalid or expired"* page.
   - **If all pass** → Mark `usedAt = [current timestamp]`, and lock the session to their IP.
3. **Student Enters the Test Room directly**:
   - **NO login needed.** 
   - **NO signup needed.** 
   - The token itself acts as their identity. The test loads with their name already populated from the Database.
4. **Test Interface Loads**:
   - The MCQ section and Coding section appear side-by-side or stacked.
   - The **Timer** begins (controlled and validated server-side, not client-side).
   - The Coding section features the **Monaco Editor** with a language selector (C, C++, Java, JS, Python).
5. **Student Completes Test**:
   - MCQs are auto-scored instantly.
   - Code runs against hidden test cases via **Judge0**.
   - Results are shown on the screen immediately.
   - A Result email is triggered via **SendGrid**.
   - The Admin panel updates in real time.

---

## 3. UI/UX: Admin Test Creation Form

The Admin UI will require the following structured fields:
- **Test Name** (String)
- **Duration** (Numbers, in minutes)
- **Link Validity** (Dropdown: 1 hour / 12 hours / 1 day / 3 days / custom)

### MCQ Section:
- `+ Add Question` button.
- Fields per question: `Text`, `Option A`, `Option B`, `Option C`, `Option D`, `Correct Answer`, `Marks`.

### Coding Section:
- `+ Add Problem` button.
- Fields per problem: `Title`, `Description`, `Input Format`, `Output Format`, `Sample Test Cases (public)`, `Hidden Test Cases (private scoring)`, `Marks`.

### Student List & Dispatch:
- **Input Method**: Paste emails (one per line) OR upload a CSV.
- `Send Links` button → Generates tokens and fires SendGrid emails instantly.

---

## 4. System Connections & Data Flow

This is the technical data flow sequence:

1. **Initialization:**
   - Admin creates a test in the admin panel.
   - **Action:** Saves payload to the `Tests` MongoDB collection.
2. **Dispatch:**
   - Admin adds student emails and clicks Send.
   - **Action:** Creates one `TestToken` document per student.
   - **Action:** SendGrid API dispatches each student their unique URL.
3. **Authentication via Token:**
   - Student opens URL → Token validated securely on the backend.
   - **Action:** `TestSession` is created.
   - **Action:** Test UI loads (MCQ + Monaco Editor side-by-side).
4. **Execution during Test:**
   - Student answers MCQ → Auto-saved as they go (debounced API calls or local state synced periodically).
   - Student writes code → clicks **Run** → Calls `/api/assessment/run-code` → **Judge0 API** → Results rendered.
5. **Submission & Grading:**
   - Timer hits zero OR Student clicks **Submit**.
   - **Action:** `/api/assessment/submit-code` is called.
   - **Action:** All hidden test cases run securely via backend Judge0.
   - **Action:** MCQ score + Coding score calculated.
   - **Action:** `TestResult` stored in MongoDB.
   - **Action:** Result shown on screen.
   - **Action:** SendGrid automatically sends the final result email to the student.
   - **Action:** Admin panel dashboard updates in real-time (via polling or WebSockets).
