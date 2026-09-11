# Populate Every Course and Merge Resources

## What will change

- Populate ACCT 311, BUSN 100, PHIL 100, and ACCT 314 with realistic student discussions and course chats.
- Add useful starter posts that appear in Saved for every student by default, while preserving each student’s ability to save or unsave posts.
- Remove the separate Notes tab.
- Turn Resources into one place for shared links and uploaded notes/files, with clear link and file labels.
- Update ACCT 314’s title to **Tax Accounting** and keep ACCT 311 as **Intermediate Accounting I**.

## Content approach

Each course will receive subject-specific sample activity:

- **ACCT 311:** adjusting entries, revenue recognition, financial statements, exam review.
- **BUSN 100:** ethics, stakeholder analysis, group projects, social enterprise.
- **PHIL 100:** argument structure, Plato, ethics, reading discussions.
- **ACCT 314:** tax basis, deductions, filing rules, practice problems.

Content will read like genuine student activity rather than generic placeholders. Starter resources will use stable, reputable educational links; uploaded files remain student-managed.

## Technical details

- Add persisted per-student saved-post records and mark selected starter posts as default saves.
- Keep enrollment checks on all course content; saved records are private to their owner.
- Seed discussions and chats idempotently so the same starter content is not duplicated.
- Build the combined Resources view from links shared in live discussion posts plus uploaded course files.
- Remove obsolete separate Notes navigation while retaining upload, download, and owner-only delete behavior inside Resources.
- Update focused tests for course names, default saves, and the combined resource display.

## Validation

- Verify all four courses show populated Discussion, Chat, Saved, and Resources sections.
- Verify uploaded notes appear in Resources and the Notes tab no longer exists.
- Verify saving and unsaving posts persists after refresh.
- Check desktop and mobile layouts, then run relevant tests.
