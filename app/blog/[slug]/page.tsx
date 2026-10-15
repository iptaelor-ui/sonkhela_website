import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, PiggyBank } from "lucide-react";
import { getOtherPosts, getPost, getPublishedSlugs } from "@/database/blog";
import { getOpenings } from "@/database/invest";
import PostContent from "@/components/Blog/PostContent";
import PostCover from "@/components/Blog/PostCover";

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
  const [others, openings] = await Promise.all([getOtherPosts(slug), getOpenings()]);
  // Every post promotes our own savings plan while one is open
  const savingsPlan = openings.find((o) => o.kind === "savings" && o.status !== "closed");

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

          <PostCover
            post={post}
            sizes="(min-width: 1024px) 380px, 90vw"
            priority
            className="mx-auto aspect-[4/3] w-full max-w-sm rounded-3xl bg-white/5 ring-1 ring-white/10 lg:max-w-none"
          />
        </div>
      </section>

      {/* Article + sidebar (sidebar drops below the article on phones) */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <PostContent content={content} />
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {savingsPlan && (
            <div className="rounded-3xl bg-[#0B1F4D] p-8 text-white">
              <div className="inline-flex rounded-2xl bg-white/10 p-3">
                <PiggyBank size={28} className="text-[#F97316]" />
              </div>
              <h2 className="mt-4 text-xl font-bold">Save with Sonkhela</h2>
              <p className="mt-2 leading-7 text-gray-300">
                Put these tips into practice with the {savingsPlan.title}.
              </p>
              {savingsPlan.return_rate && (
                <p className="mt-4 text-2xl font-extrabold text-[#F97316]">{savingsPlan.return_rate}</p>
              )}
              <Link href="/invest#openings">
                <button className="mt-6 w-full rounded-xl bg-[#F97316] px-8 py-3 font-semibold text-white transition hover:bg-[#EA580C]">
                  Start Saving
                </button>
              </Link>
            </div>
          )}

          <div className="rounded-3xl border border-[#F97316]/20 bg-[#FFF8F3] p-8 text-center">
            <h2 className="text-xl font-bold text-[#0B1F4D]">Need a little help getting there?</h2>
            <p className="mt-3 leading-7 text-gray-700">
              Sonkhela offers fast, collateral-backed loans with clear rates and written agreements.
            </p>
            <Link href="/apply?loan=collateral">
              <button className="mt-6 w-full rounded-xl bg-[#F97316] px-8 py-3 font-semibold text-white transition hover:bg-[#EA580C]">
                Apply Now
              </button>
            </Link>
          </div>

          {others.length > 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-[#0B1F4D]">More money tips</h2>
              <div className="mt-4 divide-y divide-gray-100">
                {others.map((p) => (
                  <Link key={p.slug} href={"/blog/" + p.slug} className="group block py-4 first:pt-0 last:pb-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">{p.category}</p>
                    <h3 className="mt-1 font-bold text-[#0B1F4D] transition group-hover:text-[#F97316]">{p.title}</h3>
                    <p className="mt-2 inline-flex items-center gap-1 text-sm text-gray-400">
                      {formatDate(p.published_at)} <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
