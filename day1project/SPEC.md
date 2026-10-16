# SPEC — Past Questions → N-Day Study Plan (day1project V1)

## Problem Statement

Secondary school students preparing for WAEC/NECO/JAMB have piles of past
questions but no way to turn them into a realistic study plan that fits the
days they actually have (e.g. 5 days vs 30 days). They either study randomly
or run out of time before covering high-frequency topics.

## Solution

A mobile-first web app where the student picks subject(s), enters N days +
hours/day (+ optional exam date), optionally pastes/uploads past questions,
and gets exactly N days of topic(s) + specific past questions to solve + time
estimate per day, with check-off progress saved offline and a Rebalance button
for missed days.

## User Stories

1. As a student, I want to select Mathematics and/or English, so that my plan covers the subjects I'm writing.
2. As a student, I want to enter N days (1–90), so that the plan fits my available time.
3. As a student, I want to enter hours-per-day, so that each day's workload is sized to what I can do.
4. As a student, I want to optionally enter my exam date, so that I see countdown context.
5. As a student, I want the last ~20% of days auto-reserved for revision/mocks, so that I don't enter the exam without review.
6. As a student, I want topics ordered by syllabus prerequisites (e.g. Algebra before Trig), so that I don't study hard topics without basics.
7. As a student, I want high-frequency topics to get more days than low-frequency ones, so that scarce days focus on what's most repeated.
8. As a student, I want exactly N days always (merge when N < topics, expand with deep-practice when N > topics), so that I trust the plan matches my input.
9. As a student, I want each day sized to ~5 Math Qs/hr or ~1 passage + 10 Qs/hr English, so that daily load fits my hours.
10. As a student, I want each day to show topic(s) + questions + time + done-checkbox, so that I know what to do and can track it.
11. As a student, I want progress saved in the browser offline, so that I don't lose it without internet/login.
12. As a student, I want a Rebalance button to push unfinished work forward without regenerating, so that missed days don't break the plan.
13. As a student, I want a Today focus view showing the first undone day's full question list, so that I can start quickly on my phone.
14. As a student, I want to use pre-loaded sample questions without uploading anything, so that I can try it immediately.
15. As a student, I want to paste past-question text, so that missing years/topics are included via auto-tagging.
16. As a student, I want to load a .txt / PDF-text file, so that I don't have to retype.
17. As a student, I want unmatched uploads to land in Untagged / General Review on the last study day instead of erroring, so that nothing is silently dropped.
18. As a student, I want photo/image uploads to show "coming soon" clearly, so that I'm not surprised by missing OCR in V1.

## Implementation Decisions

- Greenfield in single folder, plain HTML/CSS/JS, no build step, runs by
  opening `index.html`; `localStorage` key `bwaiw-plan-v1` for plan + done
  flags; no login/backend/payments.
- Multi-subject framework, V1 seeds Math (15 topics) + English (10 topics)
  from official WAEC syllabus breakdown; every bank question tagged to exactly
  one topic.
- Thin sample bank (~15 Math + ~15 English real-style questions) proves
  frequency + scheduler; full 5-year verbatim bank explicitly post-MVP.
- 100% local rule-based scheduler, no AI API: frequency weight decides time
  share, prerequisite order decides sequence, `generatePlan` is the single
  pure core.
- Day-count contract: `revisionDays = N>=5 ? floor(N*0.2) : N>=3 ? 1 : 0`;
  `studyDays = N - revisionDays`; squeeze distributes topics proportionally
  preserving order into exactly `studyDays` slots; stretch gives 1 day/topic
  then round-robins extras to highest-weight topics as Deep practice; custom
  tagged/untagged appended to last study day; final trim/merge guarantees
  `plan.length === N`.
- Upload V1 = paste-text + .txt + PDF-text via PDF.js CDN with graceful
  fallback; image OCR deferred.
- Exactly 3 views: Setup form / N-day grid / Today focus; English-only UI.
- Test seams: primary `generatePlan({useMath, useEng, days, hours,
  customQuestions}) -> Day[]` (pure, already exported); secondary
  `tagText(text)`; DOM/localStorage rendering excluded from V1 tests.

## Testing Decisions

- Good tests assert external scheduler behavior (day count, revision count,
  ordering, merge/expand, trim sizes, untagged fallback), not keyword-list
  internals or DOM strings.
- Test `generatePlan` as the primary seam; `tagText` secondary. No prior
  scheduler tests in codebase; Node `require('./app.js')` smoke check used
  during build is the template.
- Browser-only code (`render`, localStorage, Rebalance handler, PDF.js)
  excluded from V1 tests.

## Out of Scope

- Full 5-year WAEC bank, photo/image OCR, native app, backend/sync/accounts,
  AI tagging/scheduling, additional subjects beyond Math+English, non-English
  UI, exam-date auto-scheduling to calendar dates.

## Further Notes

- Root `GLOSSARY.md` belongs to the movie-recommender domain; this feature's
  terms (Study Plan, Study Day, Topic, Past Question, Revision Day, Rebalance)
  are defined here to avoid overloading Emotion/Catalogue vocabulary.
- No ADRs exist in the repo for this area.
