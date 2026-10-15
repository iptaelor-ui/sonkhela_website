import { supabase } from "./supabase";

export type Investor = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  testimonial: string;
  investor_since: number | null;
};

export type Opening = {
  id: string;
  kind: "investment" | "savings";
  title: string;
  description: string | null;
  min_amount: number | null;
  return_rate: string | null;
  term: string | null;
  status: "open" | "closing_soon" | "closed";
};

// Both return [] if the tables don't exist yet, so the page still renders.
export async function getInvestors(): Promise<Investor[]> {
  const { data } = await supabase
    .from("investors")
    .select("id, name, role, photo_url, testimonial, investor_since")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  return data || [];
}

export async function getOpenings(): Promise<Opening[]> {
  const { data } = await supabase
    .from("investment_openings")
    .select("id, kind, title, description, min_amount, return_rate, term, status")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  return data || [];
}
