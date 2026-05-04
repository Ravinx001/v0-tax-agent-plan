"use client";

import type { UIMessage } from "ai";
import type { CalculationResult } from "@/lib/tax-engine";
import { formatCurrency } from "@/lib/tax-engine";
import {
  extractCompletedFuelComparisons,
  extractCompletedTaxCalculations,
  type ComparisonRow,
} from "@/lib/chat-tax-parts";
import { Separator } from "@/components/ui/separator";

function TaxBreakdownCard({ result }: { result: CalculationResult }) {
  const { input, breakdown, totalTax, totalLandedCost, effectiveTaxRate, warnings } =
    result;
  const rows: [string, string][] = [
    ["CIF (basis)", formatCurrency(input.cifValueLKR)],
    ["Customs duty", formatCurrency(breakdown.customsDuty)],
    ["Excise duty", formatCurrency(breakdown.exciseDuty)],
    ["VAT", formatCurrency(breakdown.vat)],
    ["PAL", formatCurrency(breakdown.pal)],
    ["SSL", formatCurrency(breakdown.ssl)],
  ];
  if (breakdown.surcharge > 0) {
    rows.push(["Surcharge", formatCurrency(breakdown.surcharge)]);
  }

  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-foreground">
      <div className="mb-2 font-semibold text-foreground">
        Tax breakdown (engine {input.engineCC}cc · {input.fuelType} ·{" "}
        {input.manufactureYear} · {input.isUsed ? "used" : "new"})
      </div>
      <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <Separator className="my-2" />
      <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
        <dt className="font-medium">Total tax</dt>
        <dd className="text-right font-semibold tabular-nums">
          {formatCurrency(totalTax)}
        </dd>
        <dt className="font-medium">Landed cost</dt>
        <dd className="text-right font-semibold tabular-nums">
          {formatCurrency(totalLandedCost)}
        </dd>
        <dt className="text-muted-foreground">Effective rate</dt>
        <dd className="text-right tabular-nums">
          {(effectiveTaxRate * 100).toFixed(1)}% of CIF
        </dd>
      </dl>
      {warnings.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-[11px] text-amber-700 dark:text-amber-400">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FuelComparisonCard({ rows }: { rows: ComparisonRow[] }) {
  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
      <div className="mb-2 font-semibold text-foreground">Fuel type comparison</div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-1 pr-2 font-medium">Fuel</th>
              <th className="py-1 pr-2 font-medium">Total tax</th>
              <th className="py-1 font-medium">Landed</th>
              <th className="py-1 pl-2 font-medium">vs petrol</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.fuelType} className="border-b border-border/60 last:border-0">
                <td className="py-1 pr-2 capitalize">{r.fuelType.replace(/_/g, " ")}</td>
                <td className="py-1 pr-2 tabular-nums">{formatCurrency(r.totalTax)}</td>
                <td className="py-1 tabular-nums">
                  {formatCurrency(r.totalLandedCost)}
                </td>
                <td className="py-1 pl-2 text-muted-foreground tabular-nums">
                  {r.savingsVsPetrol == null
                    ? "—"
                    : r.savingsVsPetrol > 0
                      ? `−${formatCurrency(r.savingsVsPetrol)}`
                      : r.savingsVsPetrol < 0
                        ? `+${formatCurrency(Math.abs(r.savingsVsPetrol))}`
                        : "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Negative vs petrol means lower tax than petrol; positive means higher.
      </p>
    </div>
  );
}

export function TaxResultCards({ message }: { message: UIMessage }) {
  const calcs = extractCompletedTaxCalculations(message);
  const compare = extractCompletedFuelComparisons(message);

  if (calcs.length === 0 && !compare?.length) return null;

  return (
    <div className="space-y-2">
      {calcs.map((c, i) => (
        <TaxBreakdownCard key={`${c.calculatedAt}-${i}`} result={c} />
      ))}
      {compare && compare.length > 0 ? (
        <FuelComparisonCard rows={compare} />
      ) : null}
    </div>
  );
}
