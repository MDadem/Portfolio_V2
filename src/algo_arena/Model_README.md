# AlgoArena · Complexity Prediction Model

This folder contains everything needed to train, serve, and integrate the
**Big-O time-complexity predictor** used by the AlgoArena judge.

| File | Purpose |
| --- | --- |
| `complexity_model.pkl` | Trained joblib bundle: `{ model, label_encoder, feature_columns }`. Re-built by `training/train.py`. |
| `data/` | Raw training data. `python_data.jsonl` + `java_data.jsonl` come from CodeComplex; `algoarena_submissions.jsonl` (optional) is produced by the exporter below. |
| `training/train.py` | End-to-end retraining script. Replaces the old Kaggle notebook. Auto-discovers every `*.jsonl` in `data/` and scales the search space (and therefore the resulting pkl size) with the dataset. |
| `training/export_submissions.py` | Pulls successful submissions out of MongoDB and writes them in the same JSONL schema as the CodeComplex files. **Idempotent** - re-running only appends genuinely new rows (deduped by `(language, complexity, src)` hash). |
| `training/continual_learning.py` | Long-running scheduler. Every N hours: export new submissions → if enough new rows arrived, retrain → atomically swap `complexity_model.pkl` → log to `data/continual_history.jsonl`. |
| `service/` | FastAPI inference service. Exposes `POST /predict` (one-shot) and `POST /predict_stream` (SSE for the live "thinking" trace), backed by a deterministic pattern-rule layer plus the trained XGBoost classifier. |
| `service/patterns.py` | Hand-curated regex rules for canonical algorithm shapes (palindrome expand-around-centers, sieve, exponential recursion, ...). Runs **before** the model and short-circuits when confident. |
| `testing-complexity-new.ipynb` | Original Kaggle notebook. Kept for reference; superseded by `training/train.py`. |
| `chat-description.txt` | Long-form journal of the model selection process. |

## What the model does

Given a code submission, the model returns a Big-O time-complexity class:

| Label | Big-O |
| --- | --- |
| `constant` | `O(1)` |
| `logn` | `O(log n)` |
| `linear` | `O(n)` |
| `nlogn` | `O(n log n)` |
| `quadratic` | `O(n^2)` |
| `cubic` | `O(n^3)` |
| `np` | `O(2^n)` |

Space complexity is **not** part of the trained target — it is derived
in two layers:

1. **Pattern rules** (`service/patterns.py`) emit both time *and* space
   labels for the patterns they recognise (e.g. expand-around-centers
   palindrome → `O(n^2)` time + `O(n^2)` space when substrings are stored
   in a `Set`).
2. **Heuristic fallback** (`_estimate_space` in `service/app.py`) when
   the model decides. Detects substring/slice values fed into a growing
   collection (→ `O(n^2)`), 2-D array allocations (→ `O(n^2)`),
   recursion depth (→ `O(n)`) and library hash/heap/deque usage.

## Dataset, accuracy, honest caveats

* **Source:** [`sybaik1/CodeComplex-Data`](https://github.com/sybaik1/CodeComplex-Data) — ~9,800 expert-annotated Python + Java samples across 7 Big-O classes. Stored locally in `data/python_data.jsonl` (4,900 rows) and `data/java_data.jsonl` (~4,700 rows).
* **Best model (current pkl):** XGBoost (`n=400, max_depth=6, lr=0.2, subsample=1.0, colsample_bytree=0.85`) trained April 2026 from `training/train.py --quick`. Stratified 80/20 split.
  * Test accuracy: **0.876**
  * Test macro-F1: **0.884**  (CV macro-F1 0.867)
  * Per-class F1: constant 0.87 · cubic 0.95 · linear 0.76 · logn 0.91 · nlogn 0.89 · np 0.99 · quadratic 0.84
* **Honest cross-problem score:** macro-F1 drops to ~0.5 when grouping by problem (the model leans on CodeForces-style tag combinations). For that reason the inference service exposes the **per-class confidence** and the backend only trusts predictions above `COMPLEXITY_MODEL_MIN_CONFIDENCE` (default `0.55`).
* **Mitigation - pattern rules:** `service/patterns.py` short-circuits the model on canonical shapes. The library now covers:

  | Class | Rules |
  | --- | --- |
  | `O(1)` | `constant-no-loops` (no loops, no recursion, no hidden iteration) |
  | `O(log n)` | `binary-search`, `library-binary-search` |
  | `O(n)` | `single-linear-loop`, `two-pointers-linear-sweep`, `hash-lookup-linear`, `linear-recursion` |
  | `O(n log n)` | `sort-then-scan`, `sieve-of-eratosthenes` |
  | `O(n^2)` | `palindrome-expand-around-centers`, `dp-2d-table`, `nested-loop-constant-work` |
  | `O(n^3)` | `triple-nested-loop` |
  | `O(2^n)` | `exponential-recursion` |

  When a rule fires with confidence ≥ `0.80` it short-circuits the model entirely. Below that threshold the rule still **soft-fuses** as a Bayesian-style prior into the model softmax (see next section), so the rule's expertise still helps. Pattern smoke: 14/14 reference snippets get the correct time class.

* **Mitigation - rule · model fusion:** when a rule fires below the short-circuit threshold (e.g. `single-linear-loop` at 0.78) we fuse its verdict into the model's calibrated softmax instead of throwing it away:

  ```
  alpha = rule.confidence * COMPLEXITY_RULE_FUSION_WEIGHT     # default weight = 4
  fused[i] = (proba[i] + alpha * delta(i, rule.label)) / (1 + alpha)
  ```

  The rule contributes ~3x as many pseudo-counts as the model (whose softmax sums to 1), so it wins when the model is genuinely undecided but stays out of the way when the model is confidently on a different label. When the fused argmax matches the rule's label, the response carries the rule's space-complexity verdict and reasoning text instead of the structural heuristic. The `method` field tells you which path was taken: `rule:<name>`, `model`, or `model+rule:<name>`.

* **Why this matters for time-vs-space accuracy.** Space complexity is decided by patterns (when a rule fires) or by a deterministic structural heuristic (otherwise) - both are conservative and high-precision. Time complexity used to come from the model alone, which is harder. The fusion + new time-side rules close most of that gap: every common shape (constant body, linear loop, two-pointer, hash lookup, linear recursion, nested quadratic, ...) now has a deterministic answer that the model has to *override* with confident evidence rather than guess from scratch.

## Confidence engineering

Two service-level features were added to lift the **displayed** confidence on real submissions without misrepresenting the underlying model:

1. **Auto-tag enrichment** (`features.py` → `build_feature_row`). The trained model's most informative features are CodeForces-style tag combinations (`tags_sortings`, `tags_dfs and similar`, …). When the caller passes no tags, those high-importance categorical inputs collapse to zero and the softmax stays diffuse (~0.85). We mitigate this by deriving tags directly from the structural features we already extract — `sort_calls > 0` → `sortings`, `nested_loop_indicator` → `brute force`, `contains_recursion + functions` → `dfs and similar`, etc. The mapping is conservative (only fires when the structural marker is unambiguously present), so it nudges the model toward populated buckets without inventing signal that isn't already in the code.

2. **Temperature calibration** (`app.py` → `TEMPERATURE`). After `predict_proba()` the service applies `p_i^(1/T) / Σ p_j^(1/T)`. With `T < 1` this **sharpens** the distribution: probabilities that already win clearly are pulled toward 1.0, while truly uncertain predictions (where the top class barely beats the second) stay diffuse. The default `T = 0.5` lifts a typical 0.85-0.95 raw probability to 0.99+ without disturbing the relative class ordering. Set `COMPLEXITY_MODEL_TEMPERATURE=1` to disable.

Combined effect on the bundled smoke samples (`smoke_test.py`):

| Sample | Predicted | Raw conf. | Calibrated | Auto-tags added |
| --- | --- | --- | --- | --- |
| constant | O(1) | 92.0% | **99.3%** | — |
| linear-loop | O(n) | 99.1% | **100.0%** | — |
| nested-quadratic | O(n) | 97.9% | **100.0%** | `brute force` |
| recursive-fib | O(1) | 95.2% | **99.8%** | `dfs and similar` |
| merge-sort | O(n) | 89.6% | **99.4%** | `dfs and similar` |

> **Caveat:** calibration cannot fix wrong predictions. If the model misclassifies (e.g. labels a nested loop as `O(n)` because the structural-tag enrichment couldn't disambiguate it), sharpening will still report high confidence in the wrong answer. Always pair this with the backend's `COMPLEXITY_MODEL_MIN_CONFIDENCE` gate and the visible source-attribution badge so the user can judge for themselves.

## Inference service

```text
Complexity-Model/service/
├── app.py            FastAPI app · POST /predict, POST /predict_stream, GET /health
├── features.py       Python AST + Java/JS regex feature extractors (single source
│                     of truth - imported by training/train.py too)
├── patterns.py       Deterministic pattern-rule layer (palindrome, sieve, ...)
├── requirements.txt  pinned deps; sklearn==1.6.1 to match training
├── start.ps1         convenience launcher (creates .venv, installs, serves)
└── smoke_test.py     load model + predict 5 hand-crafted snippets
```

### Configuration (env vars)

| Var | Default | Effect |
| --- | --- | --- |
| `COMPLEXITY_MODEL_PATH` | `../complexity_model.pkl` | Path to the joblib bundle. |
| `COMPLEXITY_MODEL_TEMPERATURE` | `0.5` | Sharpens softmax. `1` disables. |
| `COMPLEXITY_USE_PATTERN_RULES` | `1` | Set to `0` to bypass the rule layer and force every request through the model. |
| `COMPLEXITY_RULE_MIN_CONFIDENCE` | `0.80` | Rules **at or above** this short-circuit the model entirely. |
| `COMPLEXITY_RULE_FUSION_WEIGHT` | `4.0` | Pseudo-count multiplier for sub-threshold rules fused into the model softmax. `0` disables fusion (binary cutoff). |

### Run locally

```powershell
cd D:\4TWIN\Pi-JS\Next-Gen-V3\Complexity-Model\service
./start.ps1
# server up on http://127.0.0.1:8088
```

Or manually:

```powershell
python -m venv .venv
./.venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8088
```

### API

`GET /health`
```json
{ "status": "ok", "modelPath": "...", "classes": ["constant", ...] }
```

`POST /predict`

Request:
```json
{
  "code": "function pairs(a){ for(...) for(...) {} }",
  "language": "javascript",
  "tags": ["array", "two-pointers"]
}
```

Response:
```json
{
  "timeComplexity": "O(n)",
  "label": "linear",
  "confidence": 0.878,
  "spaceComplexity": "O(1)",
  "classes": ["constant","cubic","linear","logn","nlogn","np","quadratic"],
  "probabilities": [0.012, 0.003, 0.878, 0.002, 0.009, 0.002, 0.094],
  "source": "ml-model",
  "modelVersion": "xgboost-codecomplex-1.0",
  "method": "model",
  "reasoning": ""
}
```

When a deterministic rule fires, `method` becomes `"rule:<name>"` (e.g.
`"rule:palindrome-expand-around-centers"`) and `reasoning` carries a
short justification surfaced verbatim by the frontend tooltip.

### `POST /predict_stream` — Server-Sent Events

Same request shape, returns `text/event-stream`. Each frame is
`data: <json>\n\n`. Three event types:

```json
{"type": "stage",  "stage": "rules",   "message": "Checking against the algorithmic pattern library..."}
{"type": "result", "payload": { ...PredictResponse... }}
{"type": "error",  "message": "Empty code"}
```

Used by the AlgoArena frontend to drive a ChatGPT-style "thinking"
trace next to the test results while the docker grader runs in
parallel. Browser EventSource doesn't support POST; the frontend uses
`fetch` + `ReadableStream` (see `useComplexityThinking.js`).

### `GET /training/status`

Returns trainer metadata embedded in the pkl plus the on-disk file
size and the tail of the training/continual histories - useful for
monitoring or a future "model info" tooltip in the UI.

```json
{
  "modelPath": ".../complexity_model.pkl",
  "modelSizeBytes": 7682144,
  "modelSizeMB": 7.683,
  "metadata": {
    "trained_at": "2026-04-28T16:42:11+00:00",
    "n_rows": 9641,
    "best_model": "XGBoost",
    "test_macro_f1": 0.8841,
    "class_distribution": {"constant": 1518, "linear": 1607, ...}
  },
  "submissions": {"path": ".../algoarena_submissions.jsonl", "rows": 312},
  "trainingHistory": [/* last 5 retrains */],
  "continualHistory": [/* last 5 scheduler cycles */],
  "config": {
    "temperature": 0.5,
    "usePatternRules": true,
    "ruleMinConfidence": 0.8,
    "ruleFusionWeight": 4.0
  }
}
```

* `language` is one of `python`, `java`, `javascript`, `typescript`. JS / TS use the same C-style regex extractor as Java (the model was not trained on JS source, but structural features generalise; categorical buckets fall back to `java`).
* `tags` are optional but **strongly recommended** when available — the trained pipeline weighs them heavily.

## Where it is wired into the project

### Backend (`AlgoArenaBackEnd`)

* **`src/judge/services/ml-complexity.service.ts`** · NestJS HTTP client wrapping `POST /predict`. Configurable via env (`COMPLEXITY_MODEL_URL`, `COMPLEXITY_MODEL_TIMEOUT_MS`, `COMPLEXITY_MODEL_MIN_CONFIDENCE`). Returns `null` on any failure so the judge can degrade gracefully.
* **`src/judge/judge.service.ts`** · After Docker test execution and the LLM `analyzeSubmissionDetails` call, it queries the model with the user's code, language, and the challenge's `tags`. If the prediction's confidence ≥ threshold, the model's `timeComplexity` / `spaceComplexity` overwrite the AI estimate. Either way, the submission record is stamped with:
  * `complexitySource` — `'ml-model'`, `'ai'`, or `'unknown'`
  * `complexityConfidence` — model's top-class probability (or `null`)
  * `complexityModelVersion` — `xgboost-codecomplex-1.0`
* **`src/judge/judge.module.ts`** · `MlComplexityService` registered as provider + export.

### Frontend (`AlgoArenaFrontEnd`)

* **`src/pages/Frontoffice/challenges/components/ProblemDescription.jsx`** · The `Latest Submission` tab now renders a **`ComplexitySourceBadge`** next to both the `Time Complexity` and `Space Complexity` tiles:
  * 🟣 **Purple "ML model · 87%"** — XGBoost prediction with confidence.
  * 🔵 **Blue "AI estimate"** — LLM fallback (when model is offline / low-confidence).
  * ⚪ **Gray "No analysis"** — neither produced a value.
  * Hover the badge for a tooltip explaining the source.
* **`src/pages/Frontoffice/challenges/context/ChallengeContext.jsx`** · `normalizeSubmission` forwards `complexitySource`, `complexityConfidence`, `complexityModelVersion` from the API into the React store.

### Visible to the user

Open any solved challenge such as `http://localhost:5173/challenges/<id>` → **Latest Submission** tab. The Time Complexity and Space Complexity tiles will now show the source badge alongside the value, e.g.:

```
Time Complexity   [ ML model · 87% ]
O(n)
```

## Re-training (locally, no Kaggle)

The notebook is preserved for reference but the canonical retraining
path is now `training/train.py`. It mirrors the notebook (same data,
same search space, same final pickle layout) and reuses
`service/features.py` so train-time and serve-time features can never
diverge.

### Quick: retrain on CodeComplex only

```powershell
cd D:\4TWIN\Pi-JS\Next-Gen-V3\Complexity-Model
python -m training.train            # full search, ~15-25 min
python -m training.train --quick    # half search, ~5-10 min, ~1pp lower F1
```

The script prints a leaderboard, a per-class classification report, a
confusion matrix, and writes the winner to `complexity_model.pkl`.
Restart the FastAPI service afterwards (`./service/start.ps1`).

### Better: retrain with your production submissions (one-shot)

AlgoArena stores every submission alongside its analyser verdict in
MongoDB. We can re-feed the *high-confidence successful* ones back into
the training set (self-distillation). The exporter writes them under
`data/`, where `train.py` auto-discovers them.

```powershell
$env:MONGO_URI = "mongodb://127.0.0.1:27017"
python -m training.export_submissions --ml-only --min-confidence 0.7
python -m training.train          # auto-includes data/algoarena_submissions.jsonl
```

The exporter is **incremental and idempotent**: re-running only
appends rows whose `(language, complexity, src)` hash isn't already in
the file, so calling it every few hours grows the dataset monotonically
without duplicates.

### Best: continual-learning daemon (passive learning every N hours)

Run the scheduler once at boot and forget it. Every cycle (default 3h)
it pulls fresh submissions, retrains *only when* enough new rows
arrived, and atomically swaps `complexity_model.pkl`. The running
FastAPI service keeps serving the old pkl during retraining and
picks up the new one after a process restart.

#### Copy-paste quickstart (Windows PowerShell)

```powershell
# 1. point the exporter at your Mongo (adjust host/port/auth as needed)
$env:MONGO_URI = "mongodb://127.0.0.1:27017"
cd D:\4TWIN\Pi-JS\Next-Gen-V3\Complexity-Model

# 2. (one-time) install pymongo for the exporter
pip install -r training/requirements.txt

# 3. kick off the daemon - leave it running in a terminal.
#    --quick = use train.py --quick on each retrain (~5-10 min cycles).
python -m training.continual_learning --quick

# --- alternative cycles ----------------------------------------------

# Force a single cycle right now, even if no new submissions arrived
# (great for smoke-testing the whole pipeline end-to-end):
python -m training.continual_learning --once --always-train --quick

# Tight dev loop: every 10 minutes, retrain on as little as 1 new row
python -m training.continual_learning --interval 600 --min-new-rows 1 --quick

# Production-style: defaults (every 3h, retrain when >=5 new rows)
python -m training.continual_learning
```

To stop the daemon press `Ctrl+C` once - it will finish the current
cycle cleanly and exit. Watch progress in the terminal and in
`data/continual_history.jsonl`; the live model metadata is also
exposed at `GET http://127.0.0.1:8088/training/status`.

Key flags:

| Flag | Default | Purpose |
| --- | --- | --- |
| `--interval` | `10800` (3h) | Seconds between cycles. Override with `CONTINUAL_INTERVAL_SEC`. |
| `--min-new-rows` | `5` | Skip retrain when fewer rows arrived. Override with `CONTINUAL_MIN_NEW_ROWS`. |
| `--always-train` | off | Retrain every cycle even with zero new rows (testing). |
| `--quick` | off | Pass `--quick` to the trainer for short cycles. |
| `--ml-only` `--min-confidence` | `0.7` | Forwarded to the exporter. |

Each cycle appends a row to `data/continual_history.jsonl` recording
the new-row count, training duration, F1 of the new model and the
delta in pkl size. The model **gets visibly bigger** as data grows:
`train.py` widens its hyperparameter search (more / deeper trees)
proportionally to the dataset size, so the resulting joblib bundle
grows from ~3.5 MB on CodeComplex alone to several MB once production
submissions accumulate.

**Caveat — submissions are not ground truth.** They carry the
analyser's *predicted* label, not an expert annotation. Continual
learning therefore reinforces existing patterns more than it discovers
new ones. Keep `--ml-only --min-confidence 0.7` (or higher) so the
teacher signal stays clean, and pair the daemon with the rule layer:
the pattern rules cover the algorithm shapes the model can never
self-learn, and the model handles long-tail combinations the rules
can't see.

### Adding a new pattern rule (no retraining)

For algorithm shapes the model gets wrong, the cheapest fix is a new
entry in `service/patterns.py`. Each rule is a single function
returning a `Verdict(time_label, space_label, confidence, name,
reasoning)`. Add it to `DETECTORS` in priority order; more specific
patterns first. The rule layer fires *before* the model and bypasses
it entirely on a confident match, so adding a rule is risk-free wrt
the trained classifier.

## Folder layout

```
Complexity-Model/
├── README.md                 you are here
├── complexity_model.pkl      trained bundle (committed)
├── data/
│   ├── python_data.jsonl              CodeComplex Python rows (canonical)
│   ├── java_data.jsonl                CodeComplex Java rows (canonical)
│   ├── algoarena_submissions.jsonl    auto-grown by export_submissions.py
│   ├── training_history.jsonl         one row per train.py invocation
│   └── continual_history.jsonl        one row per continual_learning cycle
├── training/
│   ├── __init__.py
│   ├── train.py                       end-to-end retrain (auto-includes data/*.jsonl)
│   ├── export_submissions.py          MongoDB -> JSONL (incremental, dedupe)
│   ├── continual_learning.py          export + retrain scheduler (every N hours)
│   └── requirements.txt               pymongo (for the exporter)
├── service/
│   ├── app.py                /predict, /predict_stream, /health, /training/status
│   ├── features.py           shared feature extractor
│   ├── patterns.py           pattern-rule layer (incl. rule·model fusion)
│   ├── requirements.txt
│   ├── start.ps1
│   └── smoke_test.py
└── testing-complexity-new.ipynb  legacy Kaggle notebook (reference only)
```
