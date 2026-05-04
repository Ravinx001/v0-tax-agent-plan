/**
 * Curated context on vehicle import patterns commonly discussed in Sri Lanka.
 * Figures are illustrative; refresh from official trade/customs publications periodically.
 *
 * Sources listed are public entry points — verify current policies before relying on numbers.
 */

export interface ImportMarketSource {
  label: string;
  url: string;
  note?: string;
}

export interface ImportMarketSegment {
  name: string;
  description: string;
  typicalModels: string[];
}

export interface SriLankaImportMarketSnapshot {
  /** Human-readable refresh hint (not auto-updated) */
  lastReviewed: string;
  summary: string;
  segments: ImportMarketSegment[];
  commonDiscussionPoints: string[];
  caveats: string[];
  sources: ImportMarketSource[];
}

export const SL_IMPORT_MARKET_SNAPSHOT: SriLankaImportMarketSnapshot = {
  lastReviewed: "2026-05",
  summary:
    "Private vehicle imports to Sri Lanka are dominated by Japanese-brand used and near-new " +
    "passenger cars sourced via auctions (e.g. USS/JAA) and consolidated shipments. Small to " +
    "mid-size petrol and hybrid models are especially common because they balance purchase " +
    "price, excise brackets, and running costs. Larger SUVs and diesels appear regularly but " +
    "often face steeper excise and scrutiny on valuation. Electric and plug-in hybrid volumes " +
    "have grown as duty incentives shifted, but charging and model availability still influence " +
    "buyer choices.",
  segments: [
    {
      name: "Compact / small family (≈1000–1500cc)",
      description:
        "High volume segment: city hatchbacks and small sedans. Often petrol or mild hybrid; " +
        "favoured for lower CIF and excise band positioning.",
      typicalModels: [
        "Toyota Vitz / Yaris",
        "Suzuki Swift",
        "Honda Fit",
        "Toyota Axio / Corolla (older gens)",
      ],
    },
    {
      name: "Mid-size sedans & crossovers (≈1500–2000cc)",
      description:
        "Popular for families and ride-hailing. Hybrid variants (e.g. Prius-family) are " +
        "frequently compared against petrol for tax savings.",
      typicalModels: [
        "Toyota Prius / Aqua family",
        "Honda Grace / Shuttle",
        "Toyota CHR",
        "Mazda Axela / Demio",
      ],
    },
    {
      name: "SUVs & people movers",
      description:
        "Steady demand for Prado-class SUVs and vans; higher CIF and capacity can push excise " +
        "and total tax materially higher than compact cars.",
      typicalModels: [
        "Toyota Prado / Harrier",
        "Nissan X-Trail",
        "Honda Vezel / HR-V",
        "Toyota Hiace (commercial use cases)",
      ],
    },
    {
      name: "EV & PHEV",
      description:
        "Growing interest; battery kWh and model year matter for excise. Users often compare " +
        "against petrol/hybrid on total landed cost.",
      typicalModels: [
        "Nissan Leaf",
        "Tesla (various)",
        "BYD / MG EV lines (market dependent)",
      ],
    },
  ],
  commonDiscussionPoints: [
    "CIF (Cost, Insurance, Freight) in LKR drives customs duty and VAT bases — customs can reassess.",
    "Used vehicle age limits and surcharges may apply depending on year and category.",
    "Hybrid vs petrol often decided after side-by-side tax comparison for the same CIF.",
    "Auction grade and mileage affect buyer price but formal tax still keys off declared CIF.",
  ],
  caveats: [
    "This snapshot is not an official statistic sheet; it reflects typical market chatter and " +
      "should be cross-checked with current gazette rates and customs guidance.",
    "Do not treat any example model list as exhaustive or as import-legal advice.",
  ],
  sources: [
    {
      label: "Sri Lanka Customs",
      url: "https://www.customs.gov.lk/",
      note: "Official customs information and publications.",
    },
    {
      label: "Central Bank of Sri Lanka",
      url: "https://www.cbsl.gov.lk/",
      note: "Macro and external sector context; not a vehicle-by-vehicle import database.",
    },
  ],
};
