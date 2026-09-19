const QUESTIONS = [
  {
    id: "task",
    text: "What are you trying to do?",
    options: [
      { value: "writing", label: "Quick everyday writing or drafting" },
      { value: "analysis", label: "Analysis or strategy work" },
      { value: "coding", label: "Coding or technical work" },
      { value: "document", label: "Processing a large document or dataset" },
      { value: "feature", label: "Powering a feature other people will use" },
    ],
  },
  {
    id: "frequency",
    text: "How often will this run?",
    options: [
      { value: "once", label: "Just me, now and then" },
      { value: "automated", label: "Automated, happens constantly (an app, a workflow)" },
      { value: "oneoff", label: "One big one-off task" },
    ],
  },
  {
    id: "priority",
    text: "What matters more right now?",
    options: [
      { value: "cost", label: "Keeping cost low" },
      { value: "balance", label: "Balance of cost and quality" },
      { value: "quality", label: "Best possible answer, cost secondary" },
    ],
  },
  {
    id: "speed",
    text: "Does it need to be fast or real-time?",
    options: [
      { value: "yes", label: "Yes, live or customer-facing" },
      { value: "no", label: "No, it can take its time" },
    ],
  },
  {
    id: "sensitive",
    text: "Any sensitive or regulated data involved?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

const TIER_INFO = {
  cheap: {
    name: "Cheap & fast tier",
    headline: "The cheap, fast tier is enough for this.",
    why: "This is simple, quick work, drafting a message or summarizing something short. A basic, low-cost model handles it just fine, so paying for a more powerful one would not give you a better answer, only a bigger bill for the same result.",
    example: "Drafting a quick message, summarizing a short document, sorting things into categories.",
  },
  balanced: {
    name: "Balanced mid-tier",
    headline: "A balanced mid-tier model is the sweet spot here.",
    why: "This needs a bit more judgment than a quick task, but it is not a complex, high-stakes problem either. A mid-range model is the right fit here, think of it like hiring a solid, experienced generalist instead of either an intern or an expensive specialist. It is built for exactly this kind of everyday work.",
    example: "Writing something customers will actually read, a first pass at analyzing information, everyday coding work.",
  },
  frontier: {
    name: "Frontier tier",
    headline: "This is worth paying for the frontier tier.",
    why: "This involves working through several connected steps, or getting it wrong would actually cost you, in money, time, or trust. That is when it is worth paying for the most capable option available, like calling in a specialist instead of asking your family doctor. Anywhere else, it is more firepower than you need.",
    example: "Complex, multi-step problems, messy strategic decisions, anything where a mistake would be expensive.",
  },
};

// Checked live on the date below (2 search queries + 3 direct provider-page
// fetches). Anthropic names come from Anthropic's own developer docs, high
// confidence. OpenAI's and Google's cheap and balanced tiers converged
// across multiple independent live checks. The one part that stayed
// genuinely unclear, even across the providers' own pages, was which model
// each one currently calls its top "frontier" pick, flagged inline below
// rather than hidden. See the toolkit repo's README for the full story.
const MODEL_CHECK_DATE = "2026-09-19";

const PROVIDER_URLS = {
  Anthropic: "https://www.anthropic.com/pricing",
  OpenAI: "https://openai.com/api/pricing/",
  Google: "https://ai.google.dev/gemini-api/docs/pricing",
};

// No external logo images, tried that, looked bad and added a network
// dependency for something purely decorative. Each provider instead gets a
// small CSS-only accent color (a muted nod to their brand color, not their
// actual logo) as a top border on its card.
const PROVIDER_ACCENTS = { Anthropic: "#c9704f", OpenAI: "#10a37f", Google: "#4285f4" };

const TIER_MODELS = {
  cheap: [
    { provider: "Anthropic", model: "Claude Haiku 4.5" },
    { provider: "OpenAI", model: "GPT-5.6 Luna" },
    { provider: "Google", model: "Gemini 3.5 Flash-Lite" },
  ],
  balanced: [
    { provider: "Anthropic", model: "Claude Sonnet 5" },
    { provider: "OpenAI", model: "GPT-5.6 Terra" },
    { provider: "Google", model: "Gemini 3.8 Flash" },
  ],
  frontier: [
    { provider: "Anthropic", model: "Claude Opus 5", note: "Claude Fable 5.1 is one step up, for the most demanding work" },
    { provider: "OpenAI", model: "GPT-5.6 Sol", note: "or GPT-6 Astra, OpenAI's newest flagship, naming was the least stable part of this check" },
    { provider: "Google", model: "Gemini Pro", note: "their most capable line, the exact current version was unclear even across Google's own pages" },
  ],
};

function renderModels(tier) {
  const cards = TIER_MODELS[tier].map(function (row) {
    const url = PROVIDER_URLS[row.provider];
    const accent = PROVIDER_ACCENTS[row.provider];
    const note = row.note ? '<p class="provider-note">' + row.note + "</p>" : "";
    return (
      '<div class="provider-card" style="border-top-color: ' + accent + '">' +
      '<p class="provider-name">' + row.provider + "</p>" +
      '<p class="provider-model">' + row.model + "</p>" +
      note +
      '<a class="provider-link" href="' + url + '" target="_blank" rel="noopener">Check current pricing</a>' +
      "</div>"
    );
  }).join("");

  return (
    '<p class="models-label">Best-fit model at this tier, checked ' + MODEL_CHECK_DATE + "</p>" +
    '<div class="models-grid">' + cards + "</div>" +
    '<p class="models-caveat">Provider lineups shift every few months, sometimes faster. Click through to confirm before you commit to one, especially for the frontier tier, where naming was the least stable part of this check.</p>'
  );
}

const TIER_ORDER = ["cheap", "balanced", "frontier"];

const state = { step: 0, answers: {} };

function computeTier(answers) {
  let tier = "cheap";
  if (["analysis", "coding", "document", "feature"].includes(answers.task)) {
    tier = "balanced";
  }

  // High-volume automation pushes the tier down a notch, unless quality is non-negotiable.
  if (answers.frequency === "automated" && answers.priority !== "quality") {
    tier = TIER_ORDER[Math.max(0, TIER_ORDER.indexOf(tier) - 1)];
  }

  // "Keep cost low" caps at balanced. "Best answer, cost secondary" floors at balanced,
  // and bumps analysis/strategy work all the way to frontier.
  if (answers.priority === "cost") {
    tier = TIER_ORDER[Math.min(TIER_ORDER.indexOf(tier), TIER_ORDER.indexOf("balanced"))];
  } else if (answers.priority === "quality") {
    tier = TIER_ORDER[Math.max(TIER_ORDER.indexOf(tier), TIER_ORDER.indexOf("balanced"))];
    if (answers.task === "analysis") tier = "frontier";
  }

  return tier;
}

function render() {
  const questionsEl = document.getElementById("questions");
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = (state.step / QUESTIONS.length) * 100 + "%";

  if (state.step >= QUESTIONS.length) {
    showResult();
    return;
  }

  const q = QUESTIONS[state.step];
  questionsEl.innerHTML =
    '<p class="step-count">Question ' + (state.step + 1) + " of " + QUESTIONS.length + '</p>' +
    "<h2>" + q.text + "</h2>" +
    '<div class="options" role="group" aria-label="' + q.text + '">' +
    q.options.map(function (opt) {
      return '<button class="option" type="button" data-value="' + opt.value + '">' + opt.label + "</button>";
    }).join("") +
    "</div>";

  questionsEl.querySelectorAll(".option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.answers[q.id] = btn.dataset.value;
      state.step += 1;
      render();
    });
  });
}

function showResult() {
  document.getElementById("quiz").classList.add("hidden");
  const resultEl = document.getElementById("result");
  resultEl.classList.remove("hidden");

  const tier = computeTier(state.answers);
  const info = TIER_INFO[tier];

  document.getElementById("resultTier").textContent = info.name;
  document.getElementById("resultHeadline").textContent = info.headline;
  document.getElementById("resultWhy").textContent = info.why;
  document.getElementById("resultExample").textContent = info.example;
  document.getElementById("resultModels").innerHTML = renderModels(tier);

  const latencyEl = document.getElementById("resultLatency");
  latencyEl.textContent = state.answers.speed === "yes"
    ? "Since you said this needs to feel instant, like a live chat with a customer, also check how quickly this tier actually responds, not just what it costs. A cheaper model that replies slowly can feel worse than a pricier one that answers right away."
    : "";

  const complianceEl = document.getElementById("resultCompliance");
  complianceEl.textContent = state.answers.sensitive === "yes"
    ? "You flagged sensitive or private information, things like health, financial, or legal details. Before using this for anything real, check how the AI provider stores and protects that data. Paying for a better tier does not automatically make that safe, that is a separate thing to check."
    : "";
}

document.getElementById("restartBtn").addEventListener("click", function () {
  state.step = 0;
  state.answers = {};
  document.getElementById("result").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  render();
});

render();
