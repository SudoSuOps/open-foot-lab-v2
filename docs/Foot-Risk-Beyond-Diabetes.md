# Foot Risk Beyond Diabetes — why FootLab is not a "diabetes app"

_Deep dive · OpenFootLab positioning · sourced. The at-risk foot is defined by a mechanism,
not a diagnosis. Diabetes is the largest single cause — not the only one, and not a
prerequisite._

## The thesis

A foot becomes high-risk through one (or more) of **three mechanisms**. None of them
requires diabetes:

1. **Loss of protective sensation (neuropathy)** — the person can't feel the injury, so a
   blister, seam, pebble, or pressure point becomes a wound before it's noticed.
2. **Poor perfusion (ischemia)** — blood can't reach the tissue, so a small wound won't heal
   and spreads.
3. **Altered structure / mechanics** — deformity, scarring, missing tissue, or a prosthetic
   interface concentrates pressure where skin can't tolerate it.

Diabetes is dangerous precisely because it can hit **all three at once**. But every one of
these mechanisms has non-diabetic causes that produce the same at-risk foot and the same need
for lifelong monitoring.

## Amputation is not mostly a diabetes story — in the people *living* with it

Two different denominators, both true, and the distinction is the whole point:

- **New amputations (incidence)** are dominated by vascular disease — ~82% of amputation
  hospital discharges are dysvascular, and that share is rising. Diabetes drives most of it.
- **People *living* with limb loss (prevalence)** — the population that needs foot care for
  *decades* — tells a different story. Of the ~1.6 million Americans living with limb loss
  (projected to rise toward 3.6M+ by 2050), the causes are roughly **54% dysvascular, 45%
  trauma, <2% cancer**. And **over two-thirds of the dysvascular cases are diabetic** — so a
  large slice of the dysvascular group is **non-diabetic PAD**. Net: **well over half of
  people living with limb loss are not there because of diabetes.**

Why the gap? **Trauma amputees are young and live for 50+ years.** They accumulate in the
prevalent population. The person who will rely on foot care longest is often *not* diabetic —
he's your car-accident archetype.

### The traumatic amputee (your 25-year-old)
- Trauma-related limb loss skews **young and male** (mean age ~35; ~83% male in series).
- **Motor-vehicle collisions are the leading cause (~50–58%)**, then industrial/machinery
  crush injuries, then domestic accidents.
- A partial-foot or below-knee amputation at 25 means **50–60 years** of: residual-limb skin
  surveillance, prosthetic/orthotic fit checks, scar and pressure management — **and** watching
  the **remaining foot**, which now carries extra load (contralateral overload is a documented
  new-ulcer risk).

### Cancer and congenital — the youngest cohorts
- **Osteosarcoma** is the most common bone cancer in kids/young adults (peak age 10–14; ~8
  per 100,000 at 10–19). A meaningful fraction still require amputation when limb-salvage isn't
  possible — a teenager with a lifetime of limb care ahead.
- **Congenital limb deficiency** occurs in ~**1 in 1,900** U.S. newborns — foot/limb care from
  birth, never diabetes-related.

## Non-diabetic conditions that create a foot needing lifelong care

| Condition | Mechanism | Why lifelong foot care |
|---|---|---|
| **Non-diabetic PAD / critical limb ischemia** | Ischemia | Non-healing arterial ulcers, gangrene risk; lifelong vascular + wound surveillance |
| **Traumatic (partial) amputation** | Structure + often nerve | Residual limb + contralateral overload for decades |
| **Chemotherapy-induced peripheral neuropathy (CIPN)** | Neuropathy | ~**52%** of chemo patients affected; persists in a large share (~**58%** of breast-cancer survivors at ~5.6 yrs) → insensate feet in millions of survivors |
| **Charcot-Marie-Tooth & hereditary neuropathies** | Neuropathy + deformity | Most common inherited neuropathy (~1/2,500); high-arch/clawtoe deformity, insensate |
| **Spinal cord injury** | Neuropathy (insensate) | Pressure injury prevalence **23–39%**; **37%** rehospitalized for a pressure ulcer by year 20 |
| **Spina bifida / myelomeningocele** | Neuropathy (congenital) | Lifelong multi-system; insensate feet; foot pressure ulcers ~**8.8%** |
| **Rheumatoid & inflammatory arthritis** | Structure (deformity) | Foot involvement in **30–90%**; foot ulcers in ~**10%** |
| **Leprosy (Hansen's disease)** | Neuropathy (insensate) | The **leading cause of Charcot/insensate foot worldwide** in endemic areas |
| **Chronic kidney disease / dialysis** | Ischemia + neuropathy | Independent driver of Charcot and non-healing wounds |
| **Stroke / hemiplegia** | Structure (altered gait/load) | Spastic foot, altered pressure, reduced self-inspection |
| **Congenital insensitivity to pain, syringomyelia, syphilis, alcoholic neuropathy, B12 deficiency** | Neuropathy | All documented non-diabetic causes of the neuropathic/Charcot foot |
| **Venous insufficiency / lymphedema** | Tissue integrity | Chronic leg/foot ulceration, lifelong skin care |

## The through-line: once at risk, always monitoring

Two facts unify the whole list:
1. **An insensate, ischemic, or deformed foot doesn't heal itself and doesn't warn you** — the
   patient needs an *external* early-warning loop, exactly what a daily foot check provides.
2. **Any amputation makes the *other* foot a high-risk foot.** Every amputee — traumatic,
   oncologic, congenital, or diabetic — has a residual limb *and* a contralateral foot to watch
   for the rest of their life.

## What this means for OpenFootLab

- **Reframe the addressable population.** FootLab is not a diabetes product with a foot feature;
  it's a **foot-at-risk platform**. Diabetes is the biggest single wedge, but the same
  insensate/ischemic/deformed-foot problem covers trauma amputees, CIPN cancer survivors, CMT,
  RA, SCI, spina bifida, leprosy, PAD, and every amputee's remaining foot.
- **The product already generalizes.** The observation vocabulary (redness, swelling, wound,
  drainage, discoloration, pressure/friction) and the escalation logic are **condition-agnostic**.
  Only the *context* changes — and the harness already loads that from `Baseline/` /
  `patient_baseline.json` as free text, so a non-diabetic profile ("post-traumatic right partial
  foot amputation, 2026 MVA") drops in without code changes.
- **The Foot Passport is the right container for all of them.** A lifelong, portable, owner-owned
  record is *more* valuable for a 25-year-old trauma amputee with 60 years ahead than for anyone.
- **Positioning line:** *"If your foot can't feel it, can't heal it, or can't take the pressure —
  FootLab watches it. You don't need to be diabetic."*

---

## Sources
- Ziegler-Graham et al., *Estimating the Prevalence of Limb Loss in the United States: 2005 to 2050*, Arch Phys Med Rehabil (2008) — https://pubmed.ncbi.nlm.nih.gov/18295618/
- *Estimating Recent US Limb Loss Prevalence and Updating Future Projections* (2024) — https://pmc.ncbi.nlm.nih.gov/articles/PMC11734033/
- *Lower Limb Amputations: Epidemiology and Assessment*, AAPM&R KnowledgeNow — https://now.aapmr.org/lower-limb-amputations-epidemiology-and-assessment/
- *Epidemiology of Post-Traumatic Limb Amputation: NTDB Analysis* — https://journals.sagepub.com/doi/10.1177/000313481007601120
- *PAD and the Diabetic Foot Syndrome: Neuropathy Makes the Difference* — https://pmc.ncbi.nlm.nih.gov/articles/PMC11012336/
- *Global prevalence of chemotherapy-induced peripheral neuropathy: systematic review & meta-analysis* — https://pmc.ncbi.nlm.nih.gov/articles/PMC12977667/
- *Long-term CIPN among breast cancer survivors* — https://pmc.ncbi.nlm.nih.gov/articles/PMC5509538/
- *Charcot foot pathophysiology overview* (non-diabetic etiologies) — https://pmc.ncbi.nlm.nih.gov/articles/PMC3733015/
- *Lepromatous Leprosy and Charcot Neuroarthropathy of Insensate Feet* — https://pmc.ncbi.nlm.nih.gov/articles/PMC11214381/
- *Prevention of Pressure Ulcers Among People With Spinal Cord Injury* — https://www.sciencedirect.com/science/article/abs/pii/S1934148214015524
- *Foot pressure ulcers in ambulatory pediatric spina bifida* — https://pubmed.ncbi.nlm.nih.gov/31480906/
- *Prevalence of foot ulceration in rheumatoid arthritis* — https://pubmed.ncbi.nlm.nih.gov/18240257/
- *Charcot-Marie-Tooth Hereditary Neuropathy Overview*, GeneReviews — https://www.ncbi.nlm.nih.gov/books/NBK1358/
- *Cancer-Specific Survival after Limb Salvage vs Amputation in Osteosarcoma* — https://pmc.ncbi.nlm.nih.gov/articles/PMC10118882/

_Not medical advice. Prevalence figures are cited from the linked literature and vary by
population and method._
