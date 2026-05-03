/**
 * Sri Lanka Vehicle Import Tax Rates - 2025 Gazette
 * Reference: Customs Ordinance & Excise (Special Provisions) Act
 */

import type { FuelType, ExciseRateBand, ExchangeRate } from "./types";

export const RATE_VERSION = "2025-Q1-v1";

// Customs Duty rates by fuel type (percentage of CIF)
export const CUSTOMS_DUTY_RATES: Record<FuelType, number> = {
  petrol: 30,
  diesel: 30,
  electric: 0, // EVs exempt
  plugin_hybrid: 15,
  hybrid_petrol: 20,
  hybrid_diesel: 20,
};

// Excise duty bands for petrol vehicles (percentage of CIF + Customs Duty)
export const PETROL_EXCISE_BANDS: ExciseRateBand[] = [
  { minCC: 0, maxCC: 1000, rate: 50, description: "Up to 1000cc" },
  { minCC: 1001, maxCC: 1500, rate: 75, description: "1001cc to 1500cc" },
  { minCC: 1501, maxCC: 1800, rate: 100, description: "1501cc to 1800cc" },
  { minCC: 1801, maxCC: 2000, rate: 125, description: "1801cc to 2000cc" },
  { minCC: 2001, maxCC: 2500, rate: 150, description: "2001cc to 2500cc" },
  { minCC: 2501, maxCC: 3000, rate: 200, description: "2501cc to 3000cc" },
  { minCC: 3001, maxCC: Infinity, rate: 250, description: "Above 3000cc" },
];

// Excise duty bands for diesel vehicles
export const DIESEL_EXCISE_BANDS: ExciseRateBand[] = [
  { minCC: 0, maxCC: 1500, rate: 60, description: "Up to 1500cc" },
  { minCC: 1501, maxCC: 2000, rate: 90, description: "1501cc to 2000cc" },
  { minCC: 2001, maxCC: 2500, rate: 120, description: "2001cc to 2500cc" },
  { minCC: 2501, maxCC: 3000, rate: 175, description: "2501cc to 3000cc" },
  { minCC: 3001, maxCC: Infinity, rate: 225, description: "Above 3000cc" },
];

// Excise duty bands for hybrid petrol vehicles
export const HYBRID_PETROL_EXCISE_BANDS: ExciseRateBand[] = [
  { minCC: 0, maxCC: 1000, rate: 25, description: "Up to 1000cc" },
  { minCC: 1001, maxCC: 1500, rate: 40, description: "1001cc to 1500cc" },
  { minCC: 1501, maxCC: 1800, rate: 55, description: "1501cc to 1800cc" },
  { minCC: 1801, maxCC: 2000, rate: 70, description: "1801cc to 2000cc" },
  { minCC: 2001, maxCC: 2500, rate: 85, description: "2001cc to 2500cc" },
  { minCC: 2501, maxCC: Infinity, rate: 110, description: "Above 2500cc" },
];

// Excise duty bands for hybrid diesel vehicles
export const HYBRID_DIESEL_EXCISE_BANDS: ExciseRateBand[] = [
  { minCC: 0, maxCC: 1500, rate: 35, description: "Up to 1500cc" },
  { minCC: 1501, maxCC: 2000, rate: 50, description: "1501cc to 2000cc" },
  { minCC: 2001, maxCC: 2500, rate: 70, description: "2001cc to 2500cc" },
  { minCC: 2501, maxCC: Infinity, rate: 95, description: "Above 2500cc" },
];

// Excise duty for plugin hybrids (based on battery capacity)
export const PLUGIN_HYBRID_EXCISE_RATES: { maxKWh: number; rate: number }[] = [
  { maxKWh: 10, rate: 30 },
  { maxKWh: 20, rate: 25 },
  { maxKWh: Infinity, rate: 20 },
];

// Electric vehicle excise (based on battery capacity)
export const ELECTRIC_EXCISE_RATES: { maxKWh: number; rate: number }[] = [
  { maxKWh: 30, rate: 10 },
  { maxKWh: 60, rate: 15 },
  { maxKWh: Infinity, rate: 20 },
];

// VAT rate
export const VAT_RATE = 18; // 18%

// Port and Airport Levy (PAL)
export const PAL_RATE = 5; // 5%

// Social Security Levy (SSL)
export const SSL_RATE = 2.5; // 2.5%

// Age-based depreciation for used vehicles (percentage reduction from new value)
export const USED_VEHICLE_DEPRECIATION: { maxYears: number; rate: number }[] = [
  { maxYears: 1, rate: 10 },
  { maxYears: 2, rate: 20 },
  { maxYears: 3, rate: 30 },
  { maxYears: 4, rate: 40 },
  { maxYears: 5, rate: 50 },
  { maxYears: 6, rate: 55 },
  { maxYears: 7, rate: 60 },
];

// Maximum age for importing used vehicles
export const MAX_VEHICLE_AGE_YEARS = 7;

// Default exchange rates (should be updated from live source in production)
export const DEFAULT_EXCHANGE_RATES: ExchangeRate[] = [
  { currency: "LKR", rateToLKR: 1, updatedAt: "2025-01-01" },
  { currency: "USD", rateToLKR: 320, updatedAt: "2025-01-01" },
  { currency: "EUR", rateToLKR: 345, updatedAt: "2025-01-01" },
  { currency: "JPY", rateToLKR: 2.1, updatedAt: "2025-01-01" },
  { currency: "GBP", rateToLKR: 405, updatedAt: "2025-01-01" },
];

/**
 * Get the applicable excise bands for a given fuel type
 */
export function getExciseBands(fuelType: FuelType): ExciseRateBand[] | null {
  switch (fuelType) {
    case "petrol":
      return PETROL_EXCISE_BANDS;
    case "diesel":
      return DIESEL_EXCISE_BANDS;
    case "hybrid_petrol":
      return HYBRID_PETROL_EXCISE_BANDS;
    case "hybrid_diesel":
      return HYBRID_DIESEL_EXCISE_BANDS;
    case "electric":
    case "plugin_hybrid":
      // These use battery-based rates, not CC bands
      return null;
    default:
      return null;
  }
}

/**
 * Get excise rate for a specific engine CC and fuel type
 */
export function getExciseRateByCC(
  fuelType: FuelType,
  engineCC: number
): number {
  const bands = getExciseBands(fuelType);
  if (!bands) return 0;

  const band = bands.find((b) => engineCC >= b.minCC && engineCC <= b.maxCC);
  return band?.rate ?? 0;
}

/**
 * Get excise rate for electric/plugin hybrid based on battery capacity
 */
export function getExciseRateByBattery(
  fuelType: FuelType,
  batteryKWh: number
): number {
  const rates =
    fuelType === "electric" ? ELECTRIC_EXCISE_RATES : PLUGIN_HYBRID_EXCISE_RATES;

  const tier = rates.find((r) => batteryKWh <= r.maxKWh);
  return tier?.rate ?? rates[rates.length - 1].rate;
}

/**
 * Get supported fuel types with descriptions
 */
export function getSupportedFuelTypes(): { type: FuelType; description: string }[] {
  return [
    { type: "petrol", description: "Petrol/Gasoline vehicles" },
    { type: "diesel", description: "Diesel vehicles" },
    { type: "electric", description: "Battery Electric Vehicles (BEV)" },
    { type: "plugin_hybrid", description: "Plug-in Hybrid Electric Vehicles (PHEV)" },
    { type: "hybrid_petrol", description: "Petrol Hybrid (non-plug-in)" },
    { type: "hybrid_diesel", description: "Diesel Hybrid (non-plug-in)" },
  ];
}
