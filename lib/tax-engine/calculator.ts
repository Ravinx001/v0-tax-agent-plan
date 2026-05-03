/**
 * Sri Lanka Vehicle Import Tax Calculator
 * Pure functions for calculating import duties and taxes
 */

import type {
  CalculationInput,
  CalculationResult,
  TaxBreakdown,
  FuelType,
  FuelTypeComparison,
} from "./types";

import {
  RATE_VERSION,
  CUSTOMS_DUTY_RATES,
  VAT_RATE,
  PAL_RATE,
  SSL_RATE,
  MAX_VEHICLE_AGE_YEARS,
  getExciseRateByCC,
  getExciseRateByBattery,
} from "./rates";

/**
 * Calculate the age of a vehicle in years
 */
function calculateVehicleAge(manufactureYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - manufactureYear;
}

/**
 * Validate the input for calculation
 */
function validateInput(input: CalculationInput): string[] {
  const warnings: string[] = [];
  const age = calculateVehicleAge(input.manufactureYear);

  if (input.cifValueLKR <= 0) {
    throw new Error("CIF value must be greater than zero");
  }

  if (input.engineCC < 0) {
    throw new Error("Engine capacity cannot be negative");
  }

  if (input.fuelType === "electric" && input.engineCC > 0) {
    warnings.push("Electric vehicles typically have 0cc engine capacity");
  }

  if (
    (input.fuelType === "electric" || input.fuelType === "plugin_hybrid") &&
    !input.batteryCapacityKWh
  ) {
    warnings.push(
      "Battery capacity not provided; using default rate for smallest battery tier"
    );
  }

  if (input.isUsed && age > MAX_VEHICLE_AGE_YEARS) {
    warnings.push(
      `Vehicle is ${age} years old. Import of vehicles over ${MAX_VEHICLE_AGE_YEARS} years may be restricted.`
    );
  }

  if (age < 0) {
    warnings.push("Manufacture year is in the future; calculation may not be accurate");
  }

  return warnings;
}

/**
 * Calculate customs duty
 */
function calculateCustomsDuty(cifValue: number, fuelType: FuelType): number {
  const rate = CUSTOMS_DUTY_RATES[fuelType];
  return Math.round(cifValue * (rate / 100));
}

/**
 * Calculate excise duty
 */
function calculateExciseDuty(
  cifValue: number,
  customsDuty: number,
  fuelType: FuelType,
  engineCC: number,
  batteryKWh?: number
): number {
  const assessableValue = cifValue + customsDuty;
  let rate: number;

  if (fuelType === "electric" || fuelType === "plugin_hybrid") {
    rate = getExciseRateByBattery(fuelType, batteryKWh ?? 0);
  } else {
    rate = getExciseRateByCC(fuelType, engineCC);
  }

  return Math.round(assessableValue * (rate / 100));
}

/**
 * Calculate VAT
 */
function calculateVAT(
  cifValue: number,
  customsDuty: number,
  exciseDuty: number
): number {
  const assessableValue = cifValue + customsDuty + exciseDuty;
  return Math.round(assessableValue * (VAT_RATE / 100));
}

/**
 * Calculate Port and Airport Levy (PAL)
 */
function calculatePAL(cifValue: number): number {
  return Math.round(cifValue * (PAL_RATE / 100));
}

/**
 * Calculate Social Security Levy (SSL)
 */
function calculateSSL(
  cifValue: number,
  customsDuty: number,
  exciseDuty: number,
  vat: number
): number {
  const assessableValue = cifValue + customsDuty + exciseDuty + vat;
  return Math.round(assessableValue * (SSL_RATE / 100));
}

/**
 * Main calculation function - calculates all taxes for a vehicle import
 */
export function calculateVehicleTax(input: CalculationInput): CalculationResult {
  // Validate input
  const warnings = validateInput(input);

  // Calculate each component
  const customsDuty = calculateCustomsDuty(input.cifValueLKR, input.fuelType);

  const exciseDuty = calculateExciseDuty(
    input.cifValueLKR,
    customsDuty,
    input.fuelType,
    input.engineCC,
    input.batteryCapacityKWh
  );

  const vat = calculateVAT(input.cifValueLKR, customsDuty, exciseDuty);
  const pal = calculatePAL(input.cifValueLKR);
  const ssl = calculateSSL(input.cifValueLKR, customsDuty, exciseDuty, vat);

  // Build breakdown
  const breakdown: TaxBreakdown = {
    customsDuty,
    exciseDuty,
    vat,
    pal,
    ssl,
    surcharge: 0, // No additional surcharges currently
  };

  // Calculate totals
  const totalTax =
    breakdown.customsDuty +
    breakdown.exciseDuty +
    breakdown.vat +
    breakdown.pal +
    breakdown.ssl +
    breakdown.surcharge;

  const totalLandedCost = input.cifValueLKR + totalTax;
  const effectiveTaxRate = (totalTax / input.cifValueLKR) * 100;

  return {
    input,
    breakdown,
    totalTax,
    totalLandedCost,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    currency: "LKR",
    calculatedAt: new Date().toISOString(),
    rateVersion: RATE_VERSION,
    warnings,
  };
}

/**
 * Compare tax calculations across different fuel types for the same vehicle specs
 */
export function compareFuelTypes(
  cifValueLKR: number,
  engineCC: number,
  manufactureYear: number,
  isUsed: boolean,
  batteryCapacityKWh?: number
): FuelTypeComparison[] {
  const fuelTypes: FuelType[] = [
    "petrol",
    "diesel",
    "hybrid_petrol",
    "hybrid_diesel",
    "plugin_hybrid",
    "electric",
  ];

  const results = fuelTypes.map((fuelType) => {
    const result = calculateVehicleTax({
      cifValueLKR,
      engineCC: fuelType === "electric" ? 0 : engineCC,
      fuelType,
      manufactureYear,
      isUsed,
      batteryCapacityKWh,
    });

    return {
      fuelType,
      result,
    };
  });

  // Calculate savings vs petrol
  const petrolResult = results.find((r) => r.fuelType === "petrol");
  const petrolTax = petrolResult?.result.totalTax ?? 0;

  return results.map((r) => ({
    ...r,
    savingsVsPetrol:
      r.fuelType === "petrol" ? undefined : petrolTax - r.result.totalTax,
  }));
}

/**
 * Format currency value for display
 */
export function formatCurrency(value: number, currency: string = "LKR"): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a calculation result as a readable summary
 */
export function formatResultSummary(result: CalculationResult): string {
  const lines = [
    `Vehicle Tax Calculation Summary`,
    `================================`,
    ``,
    `Input:`,
    `  CIF Value: ${formatCurrency(result.input.cifValueLKR)}`,
    `  Engine: ${result.input.engineCC}cc ${result.input.fuelType.replace("_", " ")}`,
    `  Year: ${result.input.manufactureYear} (${result.input.isUsed ? "Used" : "New"})`,
    ``,
    `Tax Breakdown:`,
    `  Customs Duty: ${formatCurrency(result.breakdown.customsDuty)}`,
    `  Excise Duty:  ${formatCurrency(result.breakdown.exciseDuty)}`,
    `  VAT:          ${formatCurrency(result.breakdown.vat)}`,
    `  PAL:          ${formatCurrency(result.breakdown.pal)}`,
    `  SSL:          ${formatCurrency(result.breakdown.ssl)}`,
    ``,
    `Total Tax:        ${formatCurrency(result.totalTax)}`,
    `Total Landed Cost: ${formatCurrency(result.totalLandedCost)}`,
    `Effective Tax Rate: ${result.effectiveTaxRate}%`,
    ``,
    `Rate Version: ${result.rateVersion}`,
  ];

  if (result.warnings.length > 0) {
    lines.push(``, `Warnings:`);
    result.warnings.forEach((w) => lines.push(`  - ${w}`));
  }

  return lines.join("\n");
}
