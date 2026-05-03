/**
 * Sri Lanka Vehicle Import Tax Engine
 * Public API exports
 */

// Types
export type {
  FuelType,
  Currency,
  VehicleCategory,
  CalculationInput,
  TaxBreakdown,
  CalculationResult,
  ExciseRateBand,
  ExchangeRate,
  FuelTypeComparison,
} from "./types";

// Calculator functions
export {
  calculateVehicleTax,
  compareFuelTypes,
  formatCurrency,
  formatResultSummary,
} from "./calculator";

// Rate data and utilities
export {
  RATE_VERSION,
  CUSTOMS_DUTY_RATES,
  VAT_RATE,
  PAL_RATE,
  SSL_RATE,
  MAX_VEHICLE_AGE_YEARS,
  PETROL_EXCISE_BANDS,
  DIESEL_EXCISE_BANDS,
  HYBRID_PETROL_EXCISE_BANDS,
  HYBRID_DIESEL_EXCISE_BANDS,
  getExciseBands,
  getExciseRateByCC,
  getExciseRateByBattery,
  getSupportedFuelTypes,
} from "./rates";
