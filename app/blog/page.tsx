import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cleanPost } from "@/database/blog";
import PostCover from "@/components/Blog/PostCover";

export const revalidate = 3600;

export const metadata = {
  title: "Financial Literacy Blog | Sonkhela Soft Loans",
  description: "Practical money tips for Zambians, published every Friday by Sonkhela Soft Loans.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, content, category, published_at, cover_image")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const [latest, ...rest] = (posts || []).map(cleanPost);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#0B1F4D] pb-20 pt-36 text-white sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316] sm:text-sm sm:tracking-[0.3em]">Financial Literacy</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">Money Tips That Work</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">Practical advice for managing your money, published every Friday.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {!latest && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Our first post is coming this Friday. Check back soon!
          </div>
        )}

        {/* Latest post, featured */}
        {latest && (
          <Link href={"/blog/" + latest.slug} className="group grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:border-[#F97316] hover:shadow-md lg:grid-cols-2">
            <PostCover post={latest} sizes="(min-width: 1024px) 640px, 100vw" priority className="aspect-[16/10] lg:aspect-auto lg:min-h-[340px]" />
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">Latest · {latest.category}</p>
              <h2 className="mt-3 text-2xl font-extrabold text-[#0B1F4D] sm:text-3xl">{latest.title}</h2>
              {latest.excerpt && <p className="mt-4 text-lg leading-8 text-gray-600">{latest.excerpt}</p>}
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm text-gray-400">{formatDate(latest.published_at)}</p>
                <span className="inline-flex items-center gap-1 font-semibold text-[#F97316]">
                  Read <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Older posts */}
        {rest.length > 0 && (
          <div className={`mt-8 grid gap-6 sm:grid-cols-2 ${rest.length >= 3 ? "lg:grid-cols-3" : ""}`}>
            {rest.map((post) => (
              <Link key={post.slug} href={"/blog/" + post.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-[#F97316] hover:shadow-md">
                <PostCover post={post} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">{post.category}</p>
                  <h2 className="mt-2 text-xl font-bold text-[#0B1F4D]">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 text-gray-600">{post.excerpt}</p>}
                  <p className="mt-auto pt-4 text-sm text-gray-400">{formatDate(post.published_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
