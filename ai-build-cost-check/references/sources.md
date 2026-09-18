# Sources behind the AI cost check

Every rule in `SKILL.md` traces back to one of these. Numbers move, treat
anything with a specific dollar figure as needing a re-check, not gospel.

## Primary sources

| Source | What it contributed |
|---|---|
| Anatoli Kopadze, ["Graph Engineering explained: what it is, when to use it and when not to"](https://x.com/AnatoliKopadze/status/2080668775796314331) (X, 2026-07-24) | The $165,000-to-run-once example (64 agents, 535,000 lines translated, ~11 days). The "20 files on this first run" hard-cap pattern. "It can also quietly spend your money in the background if you point it at the wrong task." |
| Anatoli Kopadze, ["Claude Can Do All of This. Most People Have No Idea."](https://x.com/AnatoliKopadze/status/2057813254617858078) (X, 2026-05-22) | Prompt-caching mechanics: up to 90% cost reduction on repeated context tokens. |
| Ankit Chukla and Aakash Gupta, AI evals masterclass, Product Growth podcast | The 25x price gap between a frontier model and its cheapest sibling in the same family. "Cost optimization requires evals, you'll never confidently switch to a cheaper model unless your evals prove the quality holds." |
| Unattributed LinkedIn scoping post (source untraceable) | "The fastest way to make an AI project expensive is to start by saying: let's build an agent." The 4-step classification ladder (LLM call -> +retrieval -> +direct API/MCP -> agent-shaped). |

## The receipts

| Number / fact | Context |
|---|---|
| $165,000 | Real usage cost for one job, run once: ~50 workflows, up to 64 agents at a time, 535,000 lines of code translated, ~11 days |
| 25x | Price gap between a frontier model's output pricing and its cheapest same-family sibling, per million tokens |
| Up to 90% | Cost cut on repeated context tokens (system prompt, long doc, codebase) via prompt caching |
| ~10x | Typical spread between the cheapest and priciest tier in a single provider's current lineup, both input and output pricing |
| "20 files on this first run" | A concrete hard cap written into the spec itself, not a mental note |

## Honesty notes

- The classification ladder's original author couldn't be traced. It's
  credited honestly as an unattributed post rather than inventing a name for
  it.
- Anthropic's own per-tier pricing (used as the ~10x example above) was
  accurate as of a specific check date in mid-2026 and has almost certainly
  moved since. Don't quote it without re-checking the provider's current
  pricing page.
