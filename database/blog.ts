import { cache } from "react";
import { supabase } from "./supabase";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  published_at: string;
  cover_image?: string | null;
};

// cache() lets generateMetadata and the page share one query per request
export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
});

export async function getPublishedSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data || []).map((p) => p.slug);
}

export async function getOtherPosts(slug: string, limit = 2) {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, category, published_at")
    .eq("is_published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(limit);
  return data || [];
}
