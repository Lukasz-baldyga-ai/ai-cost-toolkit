# ai-build-cost-check

A [Claude Agent Skill](https://www.anthropic.com/news/agent-skills) that
turns a pre-build cost checklist into something you actually run, instead of
just reading. Say "run the AI cost check" (or "run the AI cost check for
[idea]") and Claude interviews you with a handful of questions, classifies
the job on a 4-step ladder, and hands back a cost estimate with the
arithmetic shown, plus one concrete control worth applying.

Grew out of a 3-part LinkedIn series on AI build costs. See
[`references/sources.md`](./references/sources.md) for the full source list
and the numbers behind the rules: the $165,000 example, the 25x model-cost
gap, the 90% prompt-caching saving.

## What it does

1. Asks 7 short questions about the job you're about to build.
2. Classifies it: one model call, add retrieval, a direct API call, or
   genuinely agent-shaped.
3. Estimates the cost - live pricing lookup if available, an honest
   order-of-magnitude band with a "verify before you rely on this" caveat if
   not.
4. Hands back one control worth applying, not a six-item lecture.

## Install

### Claude.ai (Skills / Cowork)
1. Download or clone this folder (`ai-build-cost-check/`, including the
   `references/` subfolder and `SKILL.md`).
2. In Claude, go to wherever Skills are managed for your surface (e.g.
   Settings -> Capabilities -> Skills, or Cowork -> Customize -> Skills ->
   upload) and add this folder as a skill.

### Claude Code
Copy the whole `ai-build-cost-check/` folder into your skills directory:
```bash
cp -r ai-build-cost-check ~/.claude/skills/
# or, for a single project only:
cp -r ai-build-cost-check .claude/skills/
```

### Just want the checklist, no skill install?
Everything is plain Markdown. Open `SKILL.md`, the interview, the
classification ladder, the cost method, and the output format all work fine
copy-pasted by hand into any chat.

## Usage

Once installed, just ask naturally:

> "Run the AI cost check for a customer-support bot idea I have."
> "Is this agent-shaped, or am I overbuilding it?"
> "What's this going to cost to run at 10,000 calls a month?"

Claude will interview you for what it doesn't already know, then return a
classification, a cost estimate with the math shown, and one control worth
applying.

## Notes

- Pricing moves. The skill prefers a live lookup over memory and always
  says which one it used - treat any number without a "checked live on
  [date]" note as a rough band, not a quote.
- This is a checklist wired into instructions, not a model doing anything
  clever. That's intentional, see the toolkit-level README for why.

## License

MIT, see the toolkit-level [`LICENSE`](../LICENSE). Use it, fork it, adapt
the questions for your own team's stack.
