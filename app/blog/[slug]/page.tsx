import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";
import { getOtherPosts, getPost, getPublishedSlugs } from "@/database/blog";
import PostContent from "@/components/Blog/PostContent";
import PostIllustration, { pickTheme } from "@/components/Blog/PostIllustration";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return []; // pages are rendered on first visit instead
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found | Sonkhela Soft Loans" };
  return {
    title: `${post.title} | Sonkhela Soft Loans`,
    description: post.excerpt || undefined,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const content = post.content || "";
  const minutes = Math.max(1, Math.round(content.split(/\s+/).length / 200));
  const others = await getOtherPosts(slug);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="bg-[#0B1F4D] pb-16 pt-32 text-white sm:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px]">
          <div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-[#F97316]">
              <ArrowLeft size={16} /> All money tips
            </Link>
            {post.category && (
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316] sm:text-sm">{post.category}</p>
            )}
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">{post.excerpt}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {formatDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-2"><Clock size={16} /> {minutes} min read</span>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 lg:max-w-none">
            {post.cover_image ? (
              <Image src={post.cover_image} alt={post.title} fill sizes="(min-width: 1024px) 380px, 90vw" className="object-cover" priority />
            ) : (
              <PostIllustration theme={pickTheme(post.title, content)} className="h-full w-full p-6" />
            )}
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <PostContent content={content} />

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-[#F97316]/20 bg-[#FFF8F3] p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-[#0B1F4D]">Need a little help getting there?</h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-700">
            Sonkhela offers fast, collateral-backed loans with clear rates and written agreements.
          </p>
          <Link href="/apply?loan=collateral">
            <button className="mt-6 rounded-xl bg-[#F97316] px-8 py-3 font-semibold text-white transition hover:bg-[#EA580C]">
              Apply Now
            </button>
          </Link>
        </div>
      </article>

      {/* More posts */}
      {others.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#0B1F4D]">More money tips</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {others.map((p) => (
                <Link key={p.slug} href={"/blog/" + p.slug} className="group flex flex-col rounded-2xl border border-gray-200 bg-[#F8FAFC] p-6 transition hover:border-[#F97316] hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">{p.category}</p>
                  <h3 className="mt-2 font-bold text-[#0B1F4D]">{p.title}</h3>
                  <p className="mt-4 text-sm text-gray-400">{formatDate(p.published_at)}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#F97316]">
                    Read <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
