/**
 * Sri Lanka Vehicle Import Tax Engine - Type Definitions
 * Based on 2025 Gazette rates and customs regulations
 */

// Fuel types supported by the tax engine
export type FuelType =
  | "petrol"
  | "diesel"
  | "electric"
  | "plugin_hybrid"
  | "hybrid_petrol"
  | "hybrid_diesel";

// Currency options for output
export type Currency = "LKR" | "USD" | "EUR" | "JPY" | "GBP";

// Vehicle category based on engine capacity
export type VehicleCategory =
  | "small" // <= 1000cc
  | "medium" // 1001-1500cc
  | "large" // 1501-2000cc
  | "luxury"; // > 2000cc

// Input for tax calculation
export interface CalculationInput {
  cifValueLKR: number; // CIF value in LKR
  engineCC: number; // Engine capacity in cc (0 for electric)
  fuelType: FuelType;
  manufactureYear: number;
  isUsed: boolean;
  batteryCapacityKWh?: number; // For electric/hybrid vehicles
}

// Breakdown of individual tax components
export interface TaxBreakdown {
  customsDuty: number;
  exciseDuty: number;
  vat: number;
  pal: number; // Port and Airport Levy
  ssl: number; // Social Security Levy
  surcharge: number; // Additional surcharges if any
}

// Complete calculation result
export interface CalculationResult {
  input: CalculationInput;
  breakdown: TaxBreakdown;
  totalTax: number;
  totalLandedCost: number;
  effectiveTaxRate: number; // Total tax as percentage of CIF
  currency: Currency;
  calculatedAt: string; // ISO timestamp
  rateVersion: string; // Version of rates used
  warnings: string[]; // Any warnings or caveats
}

// Rate band for excise duty lookup
export interface ExciseRateBand {
  minCC: number;
  maxCC: number;
  rate: number; // Percentage
  description: string;
}

// Exchange rate for currency conversion
export interface ExchangeRate {
  currency: Currency;
  rateToLKR: number;
  updatedAt: string;
}

// Comparison result for different fuel types
export interface FuelTypeComparison {
  fuelType: FuelType;
  result: CalculationResult;
  savingsVsPetrol?: number;
}
