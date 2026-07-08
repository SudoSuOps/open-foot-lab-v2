# The defendable data — the clinical core of OpenFootLab

_Defendable data is the core structure of the platform. Every number here traces to primary
literature and is re-checkable. The data justifies the platform — and, more importantly, it
proves why the **owned longitudinal record** is the moat._

## 1. The burden justifies the platform

Diabetic foot ulcers (DFUs) — the strongest initial proof base:

| Fact | Figure | Source |
|---|---|---|
| People with a DFU each year | **~18.6M** global · **~1.6M** US | JAMA 2023 (Armstrong, Tan, Boulton et al.) |
| Lifetime risk of a DFU (person with diabetes) | **19–34%** | JAMA 2023; NEJM 2017 |
| Share of diabetes-related lower-limb amputations preceded by a DFU | **~80%** | JAMA 2023 |
| DFUs ending in lower-extremity amputation | up to **20%** | JAMA 2023 |
| Become infected | ~50% *(per the review)* | JAMA 2023 |
| 5-year mortality after a DFU | **~30%** | JAMA 2023 + multiple |
| 5-year mortality after **major amputation** | **>70%** | JAMA 2023 + multiple |
| US direct treatment cost | **$9–13B / year** | JAMA 2023 + multiple |

> A diabetic foot ulcer carries a 5-year mortality worse than many common cancers, and a
> major amputation worse than most. This is not a cosmetic problem. It is a survival problem.

The burden is **rising** — people live longer with more medical complexity, so lifetime risk
climbs. A larger, older, more-complex diabetic population means more feet at risk for longer.

## 2. Recurrence is the business case for the record

The single most important number for the product:

| After a DFU heals, share who recur | | Source |
|---|---|---|
| within **1 year** | **~40%** | 2024 systematic review + meta-analysis |
| within **3 years** | **~60%** | 〃 (corroborated, prospective cohort) |
| within **5 years** | **~65%** | 〃; Feb 2025 meta-analysis (42% @1y, 65% @5y); NEJM 2017 |

**A healed wound is not the end of the story — it is the beginning of a higher-risk timeline.**
Two-thirds recur within five years. The clinically-correct model of a foot is not "healthy vs
ulcer" — it is **remission**, a state that must be *watched*, indefinitely, because it reverts.

A one-time photo check cannot hold remission. A **longitudinal record can.** That is the product.

## 3. The secret sauce — compare to *this* person's own baseline

A generic model answers a weak question: *"does this photo look bad?"* The longitudinal record
answers the strong one:

> **"What changed — compared with this same person, same foot, same wound site, same surgery,
> same shoe history, same risk profile?"**

Foot risk is **temporal**. The signal is not the image; the signal is the **delta**. Change
detection against a personal baseline is where the owned record beats any generic classifier —
and it *compounds*: the record is worth more every week because there is more history to compare
against. That is defensible in a way a model checkpoint never is.

## 4. What the record must preserve

The Foot Passport is the **owned longitudinal foot record** — not "upload a photo and let AI
check it," but *"build and own a portable record of your foot health over time."* It preserves:

- **Visual timeline** — L/R photos, angles, timestamps; wound & healing progression; skin
  changes, swelling, redness, callus, pressure marks, nail changes, surgical sites.
- **Risk history** — prior ulcer, prior amputation, PAD, neuropathy, surgery, deformity,
  offloading history, wound history, vascular workup, infection history.
- **Footwear / offloading record** — shoes, inserts, braces, custom orthotics, walkers, post-op
  shoes, pressure-relief devices, fit changes, wear patterns, clinician recommendations.
- **Signals & observations** — temperature differences, pain, numbness, drainage, odor, redness,
  swelling, pressure, walking tolerance, caregiver notes.
- **Care continuity** — who saw the foot, when, what changed, what was recommended, what device
  was prescribed, what wound care was used, what improved, **what came back.**

## 5. Why storage is not the business, and the model is not the business

- **Storage is commodity.** A NAS, phone, cloud bucket, health-store, or clinic EHR can all hold
  files. The moat is the **schema · habit · continuity · portability · interpretability ·
  receipts** — not the disk. So OpenFootLab is *not* "secure storage"; it is a **foot-risk record
  system that helps people, caregivers, and care teams see change earlier and communicate better.**
- **The model is one lane.** MedGemma, a GPT model, a Claude workflow, a local vision model, a
  podiatry classifier, a future FDA-cleared model — all swappable inside the system. Models get
  cheaper and better and get replaced. The **record remains.** (See `Getting-the-Most-from-MedGemma.md`
  — the model's job is to read the delta against the baseline, not to be the whole system.)

> The model can change. The storage vendor can change. The phone can change. **The record remains.**

## 6. Strategic conclusion

The bigger, more defendable company is **a longitudinal foot-risk platform with an owned portable
record at the center** — not a "diabetes app" (that box is too small).

- **Diabetes** gives the strongest initial proof base (the data above).
- **The founder's story** gives it authenticity (lives the at-risk foot).
- **The data** gives it clinical gravity.
- But the **category is bigger than diabetes** (see `Foot-Risk-Beyond-Diabetes.md`).

**The moat is not the NAS. Not the model. Not even the app. The moat is the trusted foot
timeline — owned by the person, structured enough for care, portable enough for life, and useful
*before* the crisis.**

---

## Sources
- Armstrong DG, Tan T-W, Boulton AJM, Bus SA. **Diabetic Foot Ulcers: A Review.** *JAMA*. 2023;330(1):62–75. doi:10.1001/jama.2023.10578 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10723802/
- Armstrong DG, Boulton AJM, Bus SA. **Diabetic Foot Ulcers and Their Recurrence.** *NEJM*. 2017;376:2367–2375 — https://podimetrics.com/wp-content/uploads/2022/12/Armstrong-2017-Diabetic-foot-ulcers-and-their-recurrence.pdf
- **Predictors of post-healing recurrence in patients with diabetic foot ulcers: a systematic review and meta-analysis** (2024) — https://www.sciencedirect.com/science/article/abs/pii/S0965206X24001086
- **Risk factors associated with the recurrence of diabetic foot ulcers: a meta-analysis** *PLOS One* (2025) — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0318216
- **Etiology, Epidemiology, and Disparities in the Burden of Diabetic Foot Ulcers.** *Diabetes Care*. 2023;46(1):209 — https://diabetesjournals.org/care/article/46/1/209/148198/

_Not medical advice. Figures cited from the linked peer-reviewed literature; they vary by
population and method. Where a figure is stated in the JAMA 2023 review but not independently
re-derived here, it is attributed to the review._
