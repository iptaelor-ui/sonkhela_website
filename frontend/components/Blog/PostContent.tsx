import Link from "next/link";
import { Fragment, type ReactNode } from "react";

// Renders the simple Markdown used in blog_posts.content:
// paragraphs, ## / ### headings, "- " and "1. " lists, **bold**, *italic*,
// and [links](/invest) (site links open in place, others in a new tab).

const LINK_CLASS = "font-semibold text-[#F97316] underline underline-offset-4 hover:text-[#EA580C]";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|\*[^*]+\*)/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? (
        <Link key={i} href={href} className={LINK_CLASS}>{label}</Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noreferrer" className={LINK_CLASS}>{label}</a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-[#0B1F4D]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function PostContent({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-6 text-lg leading-8 text-gray-700">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return <h3 key={i} className="pt-2 text-xl font-bold text-[#0B1F4D]">{inline(block.slice(4))}</h3>;
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="border-l-4 border-[#F97316] pl-4 pt-4 text-2xl font-bold text-[#0B1F4D]">
              {inline(block.slice(3))}
            </h2>
          );
        }

        const lines = block.split("\n");
        if (lines.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-[#F97316]">
              {lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return (
            <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#F97316]">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ""))}</li>)}
            </ol>
          );
        }

        return <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </div>
  );
}
