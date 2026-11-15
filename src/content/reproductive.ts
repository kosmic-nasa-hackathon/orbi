/**
 * Design preview of a seventh system: reproductive, hormonal and gynecological health.
 * Copy only: the engine does not evaluate it and nothing here drives a level. No source gives
 * thresholds for these signals yet, so the card shows no traffic light. Design and evidence:
 * docs/DEMO.md ("A seventh system") and docs/resources/08-womens-health.md.
 */

export const REPRODUCTIVE_PREVIEW = {
  title: "Reproductive & hormonal health",
  badge: "Design preview",
  summary: "7th system · not evaluated yet",
  why: "Contraception and reproductive health, managed far from the nearest pharmacy and with no resupply. ORBI will track only what can honestly be known on board.",
  groups: [
    {
      label: "Daily, you log it",
      items: [
        "Breakthrough bleeding",
        "Pill taken and pills left",
        "Pelvic pain",
        "Urinary symptoms",
        "Neck or arm swelling, new headache",
      ],
    },
    {
      label: "Profile and pharmacy",
      items: ["Contraceptive method", "Drug expiry and radiation dose"],
    },
    {
      label: "On board, periodic",
      items: ["Guided ultrasound: cysts, endometrium", "LH and pH strips"],
    },
    {
      label: "Measured on Earth",
      items: ["Estrogen, progesterone, FSH, AMH", "Vaginal microbiome"],
    },
  ],
  safety:
    "Safety alerts always on: thrombosis signs, urinary infection with fever, medication reserve.",
  privacy: "The detail stays on board. Mission Control gets the conclusion unless you share more.",
  pending: "No levels yet: these rules need sourced thresholds first.",
} as const;
