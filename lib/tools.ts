/**
 * AI SDK Tool Definitions for AutoTaxBot
 * Tools for calculating Sri Lankan vehicle import taxes
 */

import { tool } from "ai";
import { z } from "zod";
import {
  calculateVehicleTax,
  compareFuelTypes,
  formatResultSummary,
  formatCurrency,
  getExciseBands,
  getSupportedFuelTypes,
  type FuelType,
} from "./tax-engine";

// Zod schema for fuel type validation
const fuelTypeSchema = z.enum([
  "petrol",
  "diesel",
  "electric",
  "plugin_hybrid",
  "hybrid_petrol",
  "hybrid_diesel",
]);

/**
 * Main tax calculation tool
 */
export const calculateVehicleTaxTool = tool({
  description: `Calculate the complete import tax breakdown for a vehicle being imported to Sri Lanka.
Returns customs duty, excise duty, VAT, PAL, SSL, total tax, and total landed cost.
Use this when the user provides vehicle details like CIF value, engine capacity, fuel type, etc.`,
  inputSchema: z.object({
    cifValueLKR: z
      .number()
      .positive()
      .describe("CIF (Cost, Insurance, Freight) value in Sri Lankan Rupees"),
    engineCC: z
      .number()
      .min(0)
      .describe("Engine capacity in cubic centimeters (cc). Use 0 for electric vehicles."),
    fuelType: fuelTypeSchema.describe(
      "Type of fuel/power: petrol, diesel, electric, plugin_hybrid, hybrid_petrol, or hybrid_diesel"
    ),
    manufactureYear: z
      .number()
      .int()
      .min(1990)
      .max(new Date().getFullYear() + 1)
      .describe("Year the vehicle was manufactured"),
    isUsed: z.boolean().describe("Whether the vehicle is used (true) or brand new (false)"),
    batteryCapacityKWh: z
      .number()
      .positive()
      .optional()
      .describe("Battery capacity in kWh (required for electric and plugin_hybrid vehicles)"),
  }),
  execute: async ({
    cifValueLKR,
    engineCC,
    fuelType,
    manufactureYear,
    isUsed,
    batteryCapacityKWh,
  }) => {
    const result = calculateVehicleTax({
      cifValueLKR,
      engineCC,
      fuelType,
      manufactureYear,
      isUsed,
      batteryCapacityKWh,
    });

    return {
      summary: formatResultSummary(result),
      data: result,
    };
  },
});

/**
 * Compare taxes across fuel types
 */
export const compareFuelTypesTool = tool({
  description: `Compare import taxes for the same vehicle across all fuel types (petrol, diesel, hybrid, electric, etc.).
Shows potential savings of electric/hybrid vs petrol. Use this when the user wants to compare options or is deciding between fuel types.`,
  inputSchema: z.object({
    cifValueLKR: z
      .number()
      .positive()
      .describe("CIF value in Sri Lankan Rupees"),
    engineCC: z
      .number()
      .min(0)
      .describe("Engine capacity in cc (will be set to 0 for electric comparison)"),
    manufactureYear: z
      .number()
      .int()
      .min(1990)
      .max(new Date().getFullYear() + 1)
      .describe("Year the vehicle was manufactured"),
    isUsed: z.boolean().describe("Whether the vehicle is used or new"),
    batteryCapacityKWh: z
      .number()
      .positive()
      .optional()
      .describe("Battery capacity in kWh (used for electric/hybrid calculations)"),
  }),
  execute: async ({
    cifValueLKR,
    engineCC,
    manufactureYear,
    isUsed,
    batteryCapacityKWh,
  }) => {
    const comparisons = compareFuelTypes(
      cifValueLKR,
      engineCC,
      manufactureYear,
      isUsed,
      batteryCapacityKWh
    );

    const summary = comparisons
      .map((c) => {
        const savings = c.savingsVsPetrol;
        const savingsText =
          savings !== undefined
            ? savings > 0
              ? ` (saves ${formatCurrency(savings)} vs petrol)`
              : savings < 0
              ? ` (costs ${formatCurrency(Math.abs(savings))} more than petrol)`
              : " (same as petrol)"
            : "";
        return `${c.fuelType}: Total Tax ${formatCurrency(c.result.totalTax)} | Landed Cost ${formatCurrency(c.result.totalLandedCost)}${savingsText}`;
      })
      .join("\n");

    return {
      summary: `Fuel Type Comparison\n====================\n\n${summary}`,
      comparisons: comparisons.map((c) => ({
        fuelType: c.fuelType,
        totalTax: c.result.totalTax,
        totalLandedCost: c.result.totalLandedCost,
        effectiveTaxRate: c.result.effectiveTaxRate,
        savingsVsPetrol: c.savingsVsPetrol,
      })),
    };
  },
});

/**
 * Look up excise rate bands
 */
export const lookupExciseRateTool = tool({
  description: `Look up the excise duty rate bands for a specific fuel type.
Shows all engine capacity brackets and their corresponding tax rates.
Use this when the user asks about tax rates or rate structures.`,
  inputSchema: z.object({
    fuelType: fuelTypeSchema.describe("Fuel type to look up rates for"),
  }),
  execute: async ({ fuelType }) => {
    const bands = getExciseBands(fuelType as FuelType);

    if (!bands) {
      if (fuelType === "electric") {
        return {
          message:
            "Electric vehicles use battery capacity-based rates instead of engine CC:\n" +
            "- Up to 30 kWh: 10%\n" +
            "- 30-60 kWh: 15%\n" +
            "- Above 60 kWh: 20%",
          type: "battery-based",
        };
      }
      if (fuelType === "plugin_hybrid") {
        return {
          message:
            "Plugin hybrids use battery capacity-based rates:\n" +
            "- Up to 10 kWh: 30%\n" +
            "- 10-20 kWh: 25%\n" +
            "- Above 20 kWh: 20%",
          type: "battery-based",
        };
      }
      return { message: "No rate bands found for this fuel type", type: "unknown" };
    }

    const bandsText = bands
      .map((b) => `${b.description}: ${b.rate}%`)
      .join("\n");

    return {
      message: `Excise Duty Rates for ${fuelType}:\n\n${bandsText}`,
      bands,
      type: "cc-based",
    };
  },
});

/**
 * List supported fuel types
 */
export const listSupportedFuelTypesTool = tool({
  description: `List all supported fuel types and their descriptions.
Use this when the user asks what vehicle types are supported or needs to know the valid fuel type options.`,
  inputSchema: z.object({}),
  execute: async () => {
    const fuelTypes = getSupportedFuelTypes();

    const message = fuelTypes
      .map((f) => `- ${f.type}: ${f.description}`)
      .join("\n");

    return {
      message: `Supported Fuel Types:\n\n${message}`,
      fuelTypes,
    };
  },
});

/**
 * All tools exported as a single object for use with AI SDK
 */
export const taxBotTools = {
  calculate_vehicle_tax: calculateVehicleTaxTool,
  compare_fuel_types: compareFuelTypesTool,
  lookup_excise_rate: lookupExciseRateTool,
  list_supported_fuel_types: listSupportedFuelTypesTool,
};
