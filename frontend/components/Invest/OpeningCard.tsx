import { PiggyBank, TrendingUp } from "lucide-react";
import type { Opening } from "@/database/invest";

function formatKwacha(n: number) {
  return "K" + n.toLocaleString("en-GB", { maximumFractionDigits: 2 });
}

export default function OpeningCard({ opening }: { opening: Opening }) {
  const Icon = opening.kind === "savings" ? PiggyBank : TrendingUp;
  const badge = {
    open: { label: "Slots open", style: "bg-green-100 text-green-700" },
    closing_soon: { label: "Closing soon", style: "bg-amber-100 text-amber-700" },
    closed: { label: "Slots full", style: "bg-gray-100 text-gray-600" },
  }[opening.status];

  const facts = [
    { label: "Minimum", value: opening.min_amount != null ? formatKwacha(opening.min_amount) : null },
    { label: "Return", value: opening.return_rate },
    { label: "Term", value: opening.term },
  ].filter((f) => f.value);

  return (
    <div className="flex flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-[#F97316] hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-[#FFF4EC] p-3">
          <Icon size={28} className="text-[#F97316]" />
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${badge.style}`}>
          {badge.label}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#0B1F4D]">{opening.title}</h3>
      {opening.description && <p className="mt-3 flex-1 leading-7 text-gray-600">{opening.description}</p>}

      {facts.length > 0 && (
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-gray-100 pt-6">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs uppercase tracking-wide text-gray-500">{f.label}</dt>
              <dd className="mt-1 text-lg font-bold text-[#0B1F4D]">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
