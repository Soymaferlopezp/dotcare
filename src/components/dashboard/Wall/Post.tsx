"use client";
import Image from "next/image";
import { USERS } from "@/lib/demoData";
import type { Post } from "@/lib/types";

function AdminPill({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold
                      bg-fuchsia-500/15 text-fuchsia-400 ring-1 ring-inset ring-fuchsia-500/30">
      Admin
    </span>
  );
}

export default function PostCard({ post }: { post: Post }) {
  const user = USERS[post.authorId];
  return (
    <article className="rounded-2xl border border-muted p-4 bg-card">
      <header className="flex items-center gap-3">
        <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="font-semibold leading-tight">{user.name}</h4>
            <AdminPill show={user.admin} />
          </div>
          <p className="text-xs text-muted-foreground">{user.role}</p>
        </div>
        <time className="text-xs text-muted-foreground" dateTime={post.createdAtISO}>
          {new Date(post.createdAtISO).toLocaleString()}
        </time>
      </header>

      {post.title && <h3 className="mt-3 font-semibold">{post.title}</h3>}
      <p className="mt-1 text-sm whitespace-pre-wrap">{post.text}</p>
    </article>
  );
}
