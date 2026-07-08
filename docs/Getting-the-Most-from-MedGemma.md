# Getting the most out of MedGemma — an accuracy roadmap for OpenFootLab

_How we go from "it produces plausible observations" to "it produces observations a podiatrist
trusts." Grounded in FL-STUDY-001 (Gemma 3 27B vs MedGemma 27B on 35 real foot photos)._

## Where we actually are

The study told us three things, honestly:
1. **Reliability is solved** — both models return valid closed-schema JSON 100% of the time.
2. **The models disagree on what they see** — near-zero κ on redness, swelling, pressure. The
   specialization changes the observation, not just the wording.
3. **We cannot yet measure accuracy** — there is no ground truth on the box. We know the models
   *differ*; we don't know which is *right*.

So the first move is not a bigger model. It's **building the thing that lets us measure accuracy
at all** — ground truth. Everything else is unfalsifiable without it.

## The levers, in ROI order

### 0. Ground truth first (the unlock)
Accuracy is undefined until we have labels. The **Tier-2 blinded clinician packet is not just a
verdict — it is a label factory.** Every photo a podiatrist adjudicates becomes a golden-set
label. Target: a few hundred clinician-labeled foot photos → the **golden set** and the
regression harness. From then on, "better" means *higher agreement with the golden set*, tracked
per model version. No golden-set movement, no accuracy claim. (Skills: `golden-set`,
`eval-curator`, `local-study`.)

### 1. Capture quality — the biggest cheap win
MedGemma normalizes every image to **896×896, 256 tokens**. A blurry, oblique, badly-lit photo is
information-destroyed *before* the model sees it. Standardize capture and accuracy moves more than
any model swap:
- consistent **white-matte background, even lighting, fixed distance/angle** (already in the
  baseline protocol),
- a **scale/color reference** in frame (a sticker) so size and redness are calibratable,
- **multiple standard views** per session, not one hero shot (SENTINEL 4-view: dorsal, plantar,
  medial, lateral + the site close-up). One angle hides half a foot. (Skill: `sentinel-capture`.)

### 2. Give the model context, not a lone frame
- **Prior image for comparison** (the ComparisonEngine / `vault-longitudinal`) — change detection
  is the whole point, and a model reasons better about "vs. yesterday" than about an absolute.
- **The patient profile** in-context — "diabetic, insensate, post-amputation" vs "marathon
  runner, intact sensation" should change how a red patch is weighted.
- **Multi-view in one call** — feed the standard views together so the model sees the whole foot.

### 3. Prompt + few-shot (cheap, but gated)
MedGemma is prompt-sensitive. In-context **reference exemplars** ("this image = moderate redness,"
"this = an open wound") anchor the closed vocabulary far better than words alone. Every prompt
change is pinned, hashed, and must pass the golden set before it ships (`canary-then-cook`).

### 4. Keep the division of labor (already right)
The model **observes**; deterministic code **tiers and escalates**. Never ask the model to be the
whole system — a hallucinated tier is unbounded, a hallucinated *observation* is caught by the
closed schema and the safety layer. This is why the study showed 0 diagnosis/dosing leaks. Hold
this line as we add capability.

### 5. Fine-tune a foot-specific LoRA (where domain accuracy is won)
MedGemma's SigLIP encoder was pre-trained on dermatology (skin) — a **head start**, but diabetic
foot wounds are out-of-distribution (FL-STUDY-001's whole premise). The durable fix is a
**foot-specific LoRA** on MedGemma, trained on the clinician-labeled golden set + the opt-in
passport-donation flywheel. Cook the 27B for the ceiling; distill/LoRA a **4B** for the edge box.
(Skills: `medgemma-finetune`, `harvest`, `canary-then-cook`.)

### 6. Hybrid: MedSigLIP classifier for the closed fields
For the *categorical* observations (wound present? redness severity?), a fine-tuned **MedSigLIP**
classifier is more measurable and more reliable than generative text — and gives calibrated
probabilities the safety layer can threshold. Best system = **SigLIP classifier for the closed
tags + MedGemma for the human-readable narrative**, cross-checked against each other.

### 7. Ensemble & self-consistency
Sample N times (or run base + specialized) and **majority-vote the categorical fields**; flag
disagreement for human review instead of guessing. Turns the study's low-κ divergence into a
*signal* ("the models disagree here — look closer") instead of a coin flip.

### 8. The flywheel (the compounding lever)
Every clinician correction in the passport becomes a new training label, **locally**. The system
gets more accurate the more it's used — the harvest loop, not a one-time cook. (Skill: `harvest`.)

## How we prove "better" (not vibes)
Golden set + regression harness. Accuracy = **agreement with clinician labels**, per model
version, published as a LocalStudy re-run. Deterministic gates, never a model grading a model.
The number has to move on labeled data, or the change didn't help.

## Edge reality — the NAS is the appliance
- **Cook tier:** 27B BF16 on the rails rig (2× RTX PRO 6000) — training, golden-set eval, the
  ceiling number.
- **Serve/edge tier:** a quantized 4B foot-LoRA on the **NAS / edge box** — the thing that
  actually runs in someone's home, all local. The study's ~21 s/photo on the big rig sets the
  ceiling; the edge number is what we report for the appliance. (Skills: `edge-sku-deploy`,
  `medgemma-ops`.)

## The honest sequence
1. Standardize capture (multi-view, calibrated).
2. Build the clinician-labeled **golden set** (ground truth) from the Tier-2 packets.
3. Add context: prior-image comparison, profile, few-shot exemplars.
4. **Fine-tune the foot LoRA**; add the SigLIP classifier hybrid.
5. Measure every step against the golden set; ship only what moves it.

Bigger model is step 4, not step 1. Accuracy is won on **capture, ground truth, and domain
fine-tuning** — in that order.
