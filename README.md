# AI Cost Toolkit

Two small, honest tools for the question nobody prices out before they start building: what is this actually going to cost to run?

Both grew out of a 3-part LinkedIn series on AI build costs, covering a real $165,000-to-run-once agent example, a one-sentence scoping test, and three changes that cut a bill without cutting the build. Full source list and the numbers behind every rule: [`ai-build-cost-check/references/sources.md`](./ai-build-cost-check/references/sources.md).

## The two tools

### 1. [`ai-build-cost-check/`](./ai-build-cost-check) - a Claude Skill

An interactive checklist Claude runs with you before you write your first prompt on a new AI build. Interviews you with a handful of questions, classifies the job (one model call, plus retrieval, plus direct API, or genuinely agent-shaped), and produces a cost estimate with the arithmetic shown, not a made-up number.

Say "run the AI cost check" (or "run the AI cost check for [idea]") once it's installed. See that folder's own README for install steps.

### 2. [`model-tier-picker/`](./model-tier-picker) - a free web tool

A 5-question quiz that recommends which model tier (cheap and fast, balanced, or frontier) actually fits the job in front of you, with plain-English reasoning. No login, no backend, nothing tracked, nothing stored. Open `model-tier-picker/index.html` in a browser, or host the folder as a static site.

## Why two tools, not one

They answer two different moments:
- **Before you scope the build** - the skill classifies the job and ballparks the total cost.
- **Once you know you need a model** - the web tool picks the right tier for this specific call.

## Honesty note

Neither tool is AI under the hood. The skill is a checklist wired into instructions. The web tool is a small rules engine, if/else logic mapping your answers to a tier. That's deliberate. The whole point of the series behind this toolkit is that most AI-shaped problems don't need an agent, and these tools practice what they preach rather than dressing up simple logic as something smarter.

## Credits

- The $165,000-to-run-once example, the hard-cap pattern, and prompt-caching mechanics: [Anatoli Kopadze](https://x.com/AnatoliKopadze), "Graph Engineering explained" and "Claude Can Do All of This."
- The 25x model-cost-gap example and "cost optimization requires evals": Ankit Chukla and Aakash Gupta, Product Growth podcast (AI evals masterclass).
- The one-sentence scoping test and the 4-step classification ladder: an unattributed LinkedIn scoping post. Source untraceable, credited honestly as such rather than inventing a name.

Full detail, including every dollar figure and where it came from: [`ai-build-cost-check/references/sources.md`](./ai-build-cost-check/references/sources.md).

## License

MIT, see [`LICENSE`](./LICENSE). Use it, fork it, adapt it for your own team.
