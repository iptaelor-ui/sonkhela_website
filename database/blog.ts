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

// The site avoids em dashes, but posts are written elsewhere, so swap them
// at display time: a pair around an aside becomes commas (or brackets if the
// aside already has commas), and a single one becomes a colon.
export function replaceEmDashes(text: string): string {
  return text
    .replace(/\s*—\s*([^—.!?\n]{1,80}?)\s*—\s*/g, (_, aside: string) =>
      aside.includes(",") ? ` (${aside}) ` : `, ${aside}, `
    )
    .replace(/\s*—\s*(?=[.,;:!?])/g, "")
    .replace(/\s*—\s*/g, ": ");
}

type PostText = { title: string; excerpt: string | null; content?: string | null };

export function cleanPost<T extends PostText>(post: T): T {
  return {
    ...post,
    title: replaceEmDashes(post.title),
    excerpt: post.excerpt && replaceEmDashes(post.excerpt),
    ...(post.content != null && { content: replaceEmDashes(post.content) }),
  };
}

// cache() lets generateMetadata and the page share one query per request
export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data && cleanPost(data);
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
  return (data || []).map(cleanPost);
}
