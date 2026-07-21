export const anatomyDictionary: Record<
  string,
  {
    explanation: string;
    function?: string;
    innervation?: string;
    bloodSupply?: string;
    mnemonic?: string;
  }
> = {
  "musculus biceps brachii": {
    explanation:
      "Merupakan otot kompartemen anterior lengan atas.",

    function:
      "Fleksi siku dan supinasi lengan bawah.",

    innervation:
      "Nervus musculocutaneus.",

    bloodSupply:
      "Arteria brachialis.",

    mnemonic:
      "Biceps = Bend (fleksi) + Supinasi.",
  },

  "musculus deltoideus": {
    explanation:
      "Merupakan otot utama bahu.",

    function:
      "Abduksi lengan.",

    innervation:
      "Nervus axillaris.",

    bloodSupply:
      "Arteria circumflexa humeri posterior.",
  },

  "hepar": {
    explanation:
      "Organ terbesar di rongga abdomen yang berperan dalam metabolisme, detoksifikasi, dan produksi empedu.",
  },

  "arteria carotis communis": {
    explanation:
      "Menyuplai darah ke kepala dan leher.",
  },
};