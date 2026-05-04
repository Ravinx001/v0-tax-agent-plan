import type { UIMessage } from "ai";
import type { CalculationResult } from "@/lib/tax-engine";

export interface ComparisonRow {
  fuelType: string;
  totalTax: number;
  totalLandedCost: number;
  effectiveTaxRate?: number;
  savingsVsPetrol?: number;
}

export function extractCompletedTaxCalculations(
  message: UIMessage
): CalculationResult[] {
  const results: CalculationResult[] = [];
  for (const part of message.parts ?? []) {
    if (part.type !== "tool-calculate_vehicle_tax") continue;
    if ((part as { state?: string }).state !== "output-available") continue;
    const output = (part as { output?: unknown }).output as
      | { data?: CalculationResult }
      | undefined;
    if (output?.data) results.push(output.data);
  }
  return results;
}

export function extractCompletedFuelComparisons(
  message: UIMessage
): ComparisonRow[] | null {
  for (const part of message.parts ?? []) {
    if (part.type !== "tool-compare_fuel_types") continue;
    if ((part as { state?: string }).state !== "output-available") continue;
    const output = (part as { output?: unknown }).output as
      | { comparisons?: ComparisonRow[] }
      | undefined;
    if (output?.comparisons?.length) return output.comparisons;
  }
  return null;
}
