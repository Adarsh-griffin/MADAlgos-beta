# MADAlgos Pipeline Data Map

This file documents the core pipelines, entry points, storage, and integrations.

## Blogs Pipeline

**Entry points**
- Admin UI: `src/app/admin/blogs/page.tsx`, `src/app/admin/blogs/new/page.tsx`, `src/app/admin/blogs/[id]/edit/page.tsx`
- Mentor UI: `src/app/mentor/MentorDashboardClient.tsx`
- APIs: `src/app/api/admin/blogs/create/route.ts`, `src/app/api/admin/blogs/[id]/route.ts`, `src/app/api/admin/blogs/status/route.ts`, `src/app/api/admin/blogs/approve/route.ts`, `src/app/api/admin/blogs/reject/route.ts`, `src/app/api/admin/blogs/remove/route.ts`, `src/app/api/mentor/blogs/route.ts`
- Upload API: `src/app/api/uploads/blog-banner/route.ts`

**Flow**
1. Admin/Mentor submits blog data.
2. Payload is validated/sanitized.
3. Blog is saved with moderation status.
4. Admin approves/rejects.
5. Public blog pages render approved/published content.

**Storage**
- Model: `src/models/Blog.ts`
- Collection: `blogs`

**Media integration**
- Azure Blob via `src/app/api/uploads/blog-banner/route.ts`
- Container: `blog-banners`

## Testimonials Pipeline

**Entry points**
- Admin UI: `src/app/admin/testimonials/page.tsx`
- APIs: `src/app/api/testimonials/route.ts`, `src/app/api/admin/testimonials/update/route.ts`, `src/app/api/admin/testimonials/status/route.ts`, `src/app/api/admin/testimonials/approve/route.ts`, `src/app/api/admin/testimonials/reject/route.ts`

**Flow**
1. Admin creates/updates testimonial.
2. Moderation state is updated (approve/reject).
3. Public API returns approved records.
4. Homepage testimonials consumes the public API.

**Storage**
- Model: `src/models/Testimonial.ts`
- Collection: `testimonials`

## Free Test (Practice Test) Pipeline

**Entry points**
- Admin UI: `src/app/admin/practice-tests/page.tsx`, `src/app/admin/practice-tests/create/page.tsx`, `src/app/admin/practice-tests/[id]/edit/page.tsx`, `src/components/admin/practice-tests/PracticeTestEditor.tsx`
- Super Admin controls: `src/app/admin/super/site-settings/page.tsx`
- Public UI: `src/app/available-tests/page.tsx`, `src/app/available-tests/[slug]/page.tsx`, `src/components/assessment/PublicDemoStartButton.tsx`

**APIs**
- Practice CRUD: `src/app/api/admin/practice-tests/route.ts`, `src/app/api/admin/practice-tests/[id]/route.ts`
- Visibility toggle: `src/app/api/admin/practice-tests/[id]/visibility/route.ts`
- Weekly free limit: `src/app/api/admin/site-settings/route.ts`
- Start/resume token: `src/app/api/assessment/public-demo/start/route.ts`
- Practice media upload: `src/app/api/uploads/practice-media/route.ts`

**Flow**
1. Admin creates/edits practice test using same MCQ/coding builders as assessments.
2. Slug uniqueness is checked against both practice and platform tests.
3. Content is synced to question bank.
4. Super admin sets `freePracticeStartsPerWeek` and toggles `showOnHomepage`.
5. Public user clicks Start test -> token minted/resumed for `practiceTestId`.
6. User goes through shared test runtime and submit flow.

**Storage**
- Practice tests: model `src/models/PracticeTest.ts`, collection `practice_test`
- Site settings: model `src/models/SiteSettings.ts`, collection `site_settings`
- Tokens: model `src/models/TestToken.ts`, collection `test_tokens`
- Results: model `src/models/TestResult.ts`, collection `test_results`
- Question bank: model `src/models/QuestionBankItem.ts`, collection `assessment_question_bank`

**Media integration**
- Azure Blob upload in `src/app/api/uploads/practice-media/route.ts`
- Container: `practice-media`
- Saved fields in practice test: `demoCardImageUrl`, `demoBannerImageUrl`, `demoBrandLogoUrl`

## Assessments Pipeline (Admin-dispatched)

**Entry points**
- Admin UI: `src/app/admin/assessment/page.tsx`, `src/app/admin/assessment/create/page.tsx`, `src/app/admin/assessment/view/[id]/page.tsx`, `src/app/admin/assessment/results/page.tsx`
- Candidate UI: `src/app/test/[token]/page.tsx`, `src/components/assessment/TestRoom.tsx`

**APIs**
- Create/dispatch/test data: `src/app/api/assessment/create/route.ts`, `src/app/api/assessment/dispatch/route.ts`, `src/app/api/assessment/test/[id]/route.ts`, `src/app/api/assessment/invite-actions/route.ts`
- Candidate flow: `src/app/api/assessment/profile/route.ts`, `src/app/api/assessment/start/route.ts`, `src/app/api/assessment/save/route.ts`, `src/app/api/assessment/run/route.ts`, `src/app/api/assessment/submit/route.ts`
- Reporting: `src/app/api/assessment/report/export/route.ts`, `src/app/api/assessment/feedback/route.ts`

**Flow**
1. Admin creates test in `tests` with MCQs/coding.
2. Invite tokens are generated and sent by email.
3. Candidate opens token link, submits profile, starts session.
4. During test: autosave + Judge0 code runs.
5. On submit/auto-submit: grading is persisted as `TestResult`.
6. Completion score email is sent.

**Storage**
- Test definitions: model `src/models/Test.ts`, collection `tests`
- Tokens/sessions: model `src/models/TestToken.ts`, collection `test_tokens`
- Results: model `src/models/TestResult.ts`, collection `test_results`

**Integrations**
- Email: SendGrid via `src/lib/assessment-emails.ts`
- Code execution: Judge0 via `src/lib/judge0.ts`

## Shared Auth + Session Layer

- Auth helpers: `src/lib/auth.ts`
- Session cookie: `madalgos_session`
- Roles used across pipelines: `SUPER_ADMIN`, `ADMIN`, `MENTOR`, `STUDENT`

