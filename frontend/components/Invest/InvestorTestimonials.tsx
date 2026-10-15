import Image from "next/image";
import { Quote } from "lucide-react";
import type { Investor } from "@/database/invest";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function Photo({ investor, size }: { investor: Investor; size: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-[#0B1F4D] ring-4 ring-[#F97316]/20 ${size}`}>
      {investor.photo_url ? (
        <Image src={investor.photo_url} alt={investor.name} fill sizes="160px" className="object-cover object-[center_25%]" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
          {initials(investor.name)}
        </span>
      )}
    </div>
  );
}

function Byline({ investor }: { investor: Investor }) {
  return (
    <div>
      <p className="font-bold text-[#0B1F4D]">{investor.name}</p>
      {investor.role && <p className="text-sm text-gray-600">{investor.role}</p>}
      {investor.investor_since && (
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#F97316]">
          Investor since {investor.investor_since}
        </p>
      )}
    </div>
  );
}

export default function InvestorTestimonials({ investors }: { investors: Investor[] }) {
  if (investors.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
        Investor stories are coming soon.
      </div>
    );
  }

  // One investor: a single featured card
  if (investors.length === 1) {
    const inv = investors[0];
    return (
      <figure className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-3xl bg-white p-8 shadow-lg sm:p-12 md:flex-row md:items-start">
        <Photo investor={inv} size="h-36 w-36 sm:h-40 sm:w-40" />
        <div className="text-center md:text-left">
          <Quote size={36} className="mx-auto text-[#F97316] md:mx-0" />
          <blockquote className="mt-4 text-lg leading-8 text-gray-700 sm:text-xl sm:leading-9">
            {inv.testimonial}
          </blockquote>
          <figcaption className="mt-6">
            <Byline investor={inv} />
          </figcaption>
        </div>
      </figure>
    );
  }

  // Several investors: a grid that grows as more come on board
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {investors.map((inv) => (
        <figure key={inv.id} className="flex flex-col rounded-3xl bg-white p-8 shadow-lg">
          <Quote size={28} className="text-[#F97316]" />
          <blockquote className="mt-4 flex-1 leading-8 text-gray-700">{inv.testimonial}</blockquote>
          <figcaption className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-6">
            <Photo investor={inv} size="h-16 w-16" />
            <Byline investor={inv} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
