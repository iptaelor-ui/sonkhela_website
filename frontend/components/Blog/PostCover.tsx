import Image from "next/image";
import PostIllustration, { pickTheme } from "./PostIllustration";

// A post's cover_image if it has one, otherwise its built-in illustration.
export default function PostCover({
  post,
  sizes,
  priority = false,
  className = "",
}: {
  post: { title: string; content?: string | null; cover_image?: string | null };
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#0B1F4D] ${className}`}>
      {post.cover_image ? (
        <Image src={post.cover_image} alt={post.title} fill sizes={sizes} className="object-cover" priority={priority} />
      ) : (
        <PostIllustration theme={pickTheme(post.title, post.content || "")} className="absolute inset-0 h-full w-full p-6" />
      )}
    </div>
  );
}
