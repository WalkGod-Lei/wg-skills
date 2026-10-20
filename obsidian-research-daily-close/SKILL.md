---
name: obsidian-research-daily-close
description: Consolidate a user's end-of-day research work into their Obsidian vault, synchronize every affected research-status page, and maintain a plan for the next group meeting. Use only when explicitly invoked for a daily closeout.
---

# Obsidian Research Daily Close

Use this skill only when the user explicitly invokes `$obsidian-research-daily-close` or explicitly asks to perform their end-of-day Obsidian research closeout. It is not for live note-taking during troubleshooting or for ordinary explanations.

## Scope and authority

The vault is `C:\workspace\Obsidian\Lei`.

An explicit invocation authorizes a single, consolidated daily update of the relevant vault pages. Do not edit the vault earlier in the day merely because the user reports an observation. During the day, retain distinctions between a raw observation, a hypothesis, and an established conclusion; write them only during this closeout unless the user expressly requests an earlier update.

Do not delete historical records. When new evidence invalidates a prior result, preserve the historical fact only where useful and label it clearly as `已撤销` or `历史记录，不作为当前结论`, with the reason for supersession.

## Canonical planning horizon: next group meeting

Planning is organized around the next group meeting, not calendar weeks.

- The canonical planning page is `01-阶段计划/下次组会前任务.md`. Create it on the first invocation if absent; maintain it thereafter.
- A group meeting is normally expected about two weeks after the current date. If no exact date is recorded, use a **tentative** two-week planning horizon and label the date as `暂定，待用户调整`; never present it as confirmed.
- If the user supplies, corrects, postpones, or cancels a group-meeting date, that explicit instruction overrides the tentative date everywhere.
- Do not create or maintain `YYYY-Www-本周科研.md` files. The user has retired weekly planning in favor of the next-group-meeting plan. If any legacy weekly-plan file remains, treat it as a migration issue: replace its live links with the canonical meeting-plan link, then delete it only when the user has authorized that migration.

The next-group-meeting page must contain:

1. Meeting date and status: confirmed or tentative.
2. Up to three `必须完成` outcomes, each framed as a deliverable or a decision-ready result.
3. Up to two `如进展顺利` outcomes.
4. The current technical blocker and its single next discriminating test.
5. The next working session's smallest concrete action.
6. Required evidence for the meeting: data, waveform, photo, table, source code, or decision record.
7. Questions requiring the supervisor, senior student, or another external party.
8. A branch plan: what is delivered if the main test passes, and what evidence/questions are delivered if it fails.

## Read before writing

Before updating, read these pages in this order when present:

1. `01-阶段计划/课题长期记忆.md`
2. `00-科研首页.md`
3. `01-阶段计划/下次组会前任务.md`; if absent, derive the initial plan from the research home, long-term memory, roadmap, progress log, and latest experiment record.
4. `01-阶段计划/科研推进日志.md`
5. The current day's or most recent related experiment record.
6. Any relevant teacher-discussion or group-meeting note.
7. `01-阶段计划/科研路线图.md` when the new result changes a phase gate, milestone, risk, or research direction.

## Evidence discipline

Classify every new statement before writing:

| Class | Required wording |
|---|---|
| Confirmed fact | State the conditions, instrument/source, measurement point, value or direct observation. |
| Superseded fact | Preserve only as needed; state why it is invalid and that it cannot support current conclusions. |
| Current inference | Use `当前推断` / `可能` / `待验证`; state the supporting evidence. |
| Task | State purpose, operation, expected observation, branch decision, and stop condition. |

Never promote a chat hypothesis, a one-off unverified measurement, or a corrected instrument reading into a confirmed vault conclusion. If evidence conflicts and cannot be resolved, write `待确认` rather than silently selecting one version.

## Full-vault synchronization

After a corrected result, changed technical conclusion, completed task, changed blocker, or changed next step, search the vault for every affected old value, component name, risk statement, and conclusion. Then update only the pages genuinely affected.

At minimum, assess and synchronize:

| Change | Pages to check |
|---|---|
| Experiment fact, measurement, exclusion, or blocker | Relevant experiment record, progress log, long-term memory, research home, next-group-meeting tasks |
| Stage gate, important risk, milestone, or research direction | Long-term memory, research home, next-group-meeting tasks, roadmap |
| Today's result and next action | Progress log, research home, next-group-meeting tasks |
| Meeting date, expected deliverable, or supervisor request | Next-group-meeting tasks, research home, relevant meeting note, roadmap if milestones move |
| Literature or supervisor feedback changing a technical parameter or plan | Relevant literature/discussion note, linked experiment record, long-term memory, research home, next-group-meeting tasks, roadmap if needed |

Use full-text search to find stale references. Do not update only the file the user happened to mention. Conversely, do not mechanically rewrite stable notes or duplicate the same record in multiple places.

## Required outputs in the vault

On each invocation:

1. Create or update the daily experiment record only when the user supplied experimental or reproducible debugging work. Separate `实测记录`, `已确认结论`, `当前推断`, `已排除项`, and `下一步`.
2. Add one concise entry at the top of `科研推进日志.md`: completed result, evidence, blocker, status/reason, next discriminating step, and link to the detailed record.
3. Update `课题长期记忆.md` only for durable state: actual stage, durable evidence, current blocker, next criterion, or changed long-term plan. Add a dated memory-update entry when it changes.
4. Update `科研首页.md` so it contains only current state, one highest-priority next action, current blocker, and the correct link to the next-group-meeting plan.
5. Create or revise `下次组会前任务.md` as the planning authority. It replaces routine weekly-plan maintenance.
6. Update `科研路线图.md` only if the monthly/stage objective, major risk, phase gate, or expected timeline actually changed.
7. Update a group-meeting note only when there is a real meeting result, supplied date, or concrete meeting preparation material; do not fabricate a meeting record.

## End-of-day validation

Before responding, verify all of the following:

1. The detailed experiment record, progress log, long-term memory, research home, and next-group-meeting page agree on the current blocker and next test.
2. A vault-wide search finds no old corrected fact still presented as a current conclusion.
3. The research home has one executable next action, not a vague task such as “continue debugging”.
4. The next-group-meeting page has no more than three required outcomes and includes a pass/fail branch.
5. If a meeting date is not supplied, it is visibly marked tentative rather than invented.
6. All links added or changed point to existing vault notes.
7. Unresolved conflicts are explicitly marked `待确认` and listed for the user.

## User-facing handoff

End with a concise report containing:

- Today’s confirmed result and any conclusion that was corrected or withdrawn.
- Every vault page updated.
- Tomorrow’s most important concrete action.
- The required outcomes before the next group meeting, including the tentative or confirmed meeting date.
- Any item requiring the user, a senior student, or a supervisor to decide.
