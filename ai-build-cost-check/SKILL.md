---
name: ai-build-cost-check
description: Use before starting any new AI/LLM build, or when the user asks "run the AI cost check" (optionally "for X"), "is this agent-shaped", "what will this cost to run", "do I need an agent for this", or similar. Interviews the user with a short set of questions, classifies the job on a 4-step ladder (one model call / +retrieval / +direct API / agent-shaped), and returns a cost estimate with the arithmetic shown plus one concrete control to apply - not a lecture, a checklist you actually run.
license: MIT
---

# AI Build Cost Check

Run this before the user writes their first prompt on a new AI build. The goal
is a classification and a rough cost estimate they can act on today, not a
research report.

## How to run this

1. Read this whole file before asking anything.
2. Ask the interview questions below. Batch them (e.g. via a single set of
   short questions) where your surface supports it; otherwise ask them
   plainly, one at a time.
3. Apply the classification ladder to their answers.
4. Apply the cost-estimate method.
5. Return the output block. Nothing more, nothing less, unless they ask a
   follow-up.

## The interview

1. In one sentence, what's the job? (If the sentence needs "and" or "or"
   more than once, it's probably not one job - split it first.)
2. Does it need to branch, use several tools, or handle exceptions on its
   own?
3. Does it need answers grounded in the user's own documents or something
   that changes often?
4. Does it need to read or write to a live system - a CRM, an order status,
   a ticketing tool?
5. How often will this run: once or a handful of times to test the idea, or
   continuously in production?
6. If continuous: roughly how many runs per day or month?
7. Do they already have a model in mind, or should you suggest one based on
   the job?

## Classification ladder

- Just understanding, writing, summarizing, or classifying -> **one model
  call. Nothing more.**
- Needs answers grounded in the user's own or frequently-changing documents
  -> **add retrieval, not an agent.**
- Needs to read or write to a real system -> **a direct API call usually
  beats both.**
- Needs to branch, use several tools, and handle exceptions on its own ->
  **this is genuinely agent-shaped.**

If the job lands on "agent-shaped," that's not a verdict to stop - it's a
flag to apply the rest of this checklist harder, not skip it. Agent-shaped
jobs are where the real spend hides.

## Cost estimate method

1. Try a live lookup of current list pricing for the model(s) named or
   implied, if you have web access in this session. Note the date the price
   was checked - prices move.
2. Multiply: tokens per run x price per token x runs per period. Show this
   arithmetic, not just a final number, so it can be re-checked later when a
   price changes.
3. If a live lookup isn't possible, say so explicitly and give a rough
   order-of-magnitude band instead of a fake-precise figure, with an
   explicit "verify on the provider's pricing page" caveat.
4. If the job is agent-shaped (branching, multiple tools, loops), multiply
   the single-call estimate by the expected number of steps/agents per run,
   not just by run count - that's where the real spend hides. A real
   example: a 64-agent, 535,000-line refactor run cost roughly $165,000, not
   because any single call was expensive, but because of that
   multiplication. See `references/sources.md`.

## Output format

End every run with exactly this:

- **Classification:** [one model call / +retrieval / +direct API /
  agent-shaped]
- **Estimated cost:** [range, with the math shown, and a confidence caveat
  if pricing wasn't looked up live]
- **One control worth applying here:** pick the single most relevant
  control for this specific case (smallest-slice-first, cheap-model eval,
  prompt caching, a hard cap in the spec, an account-level spend limit) -
  not all of them at once.

## Notes

- Don't skip the interview and jump to an estimate - the classification is
  what the cost estimate depends on.
- If the user's job is clearly agent-shaped and they seem set on building it
  anyway, that's fine - the point of this skill is pricing it out before the
  keyboard, not talking anyone out of it.
- Pricing goes stale in weeks, not years. Always prefer a live lookup over
  memory, and always say which one you used.
