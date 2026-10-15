import Link from "next/link";
import { Handshake, PiggyBank, TrendingUp } from "lucide-react";
import { getInvestors, getOpenings, type Opening } from "@/database/invest";
import InvestorTestimonials from "@/components/Invest/InvestorTestimonials";
import OpeningCard from "@/components/Invest/OpeningCard";
import PostIllustration from "@/components/Blog/PostIllustration";

export const revalidate = 600; // new investors/openings show within 10 minutes

export const metadata = {
  title: "Invest With Us | Sonkhela Soft Loans",
  description:
    "Meet the investors behind Sonkhela Soft Loans and see our current investment and savings openings in Lusaka, Zambia.",
};

function RateBadge({ opening, className }: { opening: Opening; className: string }) {
  const Icon = opening.kind === "savings" ? PiggyBank : TrendingUp;
  return (
    <div className={`absolute flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-[#0B1F4D] shadow-xl ${className}`}>
      <div className="rounded-xl bg-[#FFF4EC] p-2">
        <Icon size={22} className="text-[#F97316]" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{opening.title}</p>
        <p className="font-extrabold">{opening.return_rate || (opening.kind === "savings" ? "Savings" : "Investment")}</p>
      </div>
    </div>
  );
}

export default async function InvestPage() {
  const [investors, openings] = await Promise.all([getInvestors(), getOpenings()]);
  const investments = openings.filter((o) => o.kind === "investment");
  const savings = openings.filter((o) => o.kind === "savings");
  const columns = [
    { title: "Investment openings", icon: TrendingUp, items: investments },
    { title: "Savings openings", icon: PiggyBank, items: savings },
  ].filter((c) => c.items.length > 0);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#0B1F4D] pb-24 pt-40 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div>
            <p className="font-semibold uppercase tracking-[0.3em] text-[#F97316]">INVEST WITH US</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Grow your money while helping Zambians grow.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Every kwacha invested with Sonkhela helps fund students, marketeers and working
              people across Lusaka. Meet our investors and see what&apos;s open right now.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#openings" className="rounded-xl bg-[#F97316] px-8 py-3 font-semibold text-white transition hover:bg-[#EA580C]">
                See current openings
              </a>
              <a href="#investors" className="rounded-xl border border-white/30 px-8 py-3 font-semibold text-white transition hover:border-[#F97316] hover:text-[#F97316]">
                Meet our investors
              </a>
            </div>
          </div>

          {/* Desktop only: illustration + rate badges for each plan */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] rounded-3xl bg-white/5 ring-1 ring-white/10">
              <PostIllustration theme="growth" className="h-full w-full p-8" />
            </div>
            {openings.slice(0, 2).map((o, i) => (
              <RateBadge key={o.id} opening={o} className={i === 0 ? "-left-8 bottom-10" : "-right-4 -top-6"} />
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section id="investors" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="font-semibold uppercase tracking-[0.3em] text-[#F97316]">OUR INVESTORS</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0B1F4D] sm:text-4xl">The people who back us</h2>
          </div>
          <InvestorTestimonials investors={investors} />
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="font-semibold uppercase tracking-[0.3em] text-[#F97316]">CURRENT OPENINGS</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0B1F4D] sm:text-4xl">Investment &amp; savings opportunities</h2>
          </div>

          {openings.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-gray-300 bg-[#F8FAFC] p-10 text-center">
              <Handshake size={36} className="mx-auto text-[#F97316]" />
              <p className="mt-4 text-gray-600">
                There are no open opportunities right now. Get in touch and we&apos;ll let you know
                when the next one opens.
              </p>
            </div>
          ) : (
            <div className={columns.length > 1 ? "grid gap-12 lg:grid-cols-2" : ""}>
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[#0B1F4D]">
                    <col.icon className="text-[#F97316]" /> {col.title}
                  </h3>
                  <div className={columns.length > 1 ? "grid gap-6" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
                    {col.items.map((o) => <OpeningCard key={o.id} opening={o} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-[#0B1F4D] p-12 text-center text-white">
            <h2 className="text-3xl font-extrabold">Interested in investing or saving with us?</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Talk to our team about the options that suit you. We&apos;ll walk you through everything
              before you commit.
            </p>
            <Link href="/contact">
              <button className="mt-8 rounded-xl bg-[#F97316] px-10 py-4 text-lg font-semibold text-white transition hover:bg-[#EA580C]">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
