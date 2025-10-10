import { NextRequest, NextResponse } from "next/server";
import { POSTS_SEED, USERS } from "@/lib/demoData";
import type { Post, PostScope } from "@/lib/types";

// Estado en memoria (se resetea al reiniciar el dev server)
let POSTS_DB: Post[] = [...POSTS_SEED];

const SCOPES = ["novedades", "comenta", "codigo", "soporte", "feedback"] as const;
type ScopeEnum = typeof SCOPES[number];

const AUTHORS = ["zula", "mary", "mafer"] as const;
type AuthorId = typeof AUTHORS[number];

function isScope(x: unknown): x is ScopeEnum {
  return typeof x === "string" && (SCOPES as readonly string[]).includes(x);
}
function isAuthor(x: unknown): x is AuthorId {
  return typeof x === "string" && (AUTHORS as readonly string[]).includes(x);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scopeRaw = (searchParams.get("scope") || "novedades").toLowerCase();

  if (!isScope(scopeRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_scope" }, { status: 400 });
  }

  const data = POSTS_DB
    .filter((p) => p.scope === scopeRaw)
    .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));

  return NextResponse.json({ ok: true, data, users: USERS });
}

export async function POST(req: NextRequest) {
  type Body = Partial<{ scope: unknown; authorId: unknown; text: unknown; title: unknown }>;
  const body: Body = await req.json().catch(() => ({}));

  const scopeRaw = body.scope;
  const authorRaw = body.authorId;
  const textRaw = body.text;
  const titleRaw = body.title;

  if (!isScope(scopeRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_scope" }, { status: 400 });
  }
  if (!isAuthor(authorRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_author" }, { status: 400 });
  }
  if (typeof textRaw !== "string" || !textRaw.trim()) {
    return NextResponse.json({ ok: false, error: "empty_text" }, { status: 400 });
  }

  const newPost: Post = {
    id: `${scopeRaw}-${Date.now()}`,
    scope: scopeRaw as PostScope,
    authorId: authorRaw,
    title: typeof titleRaw === "string" && titleRaw.trim() ? titleRaw.trim() : undefined,
    text: textRaw.trim(),
    createdAtISO: new Date().toISOString(),
  };

  POSTS_DB.unshift(newPost);
  return NextResponse.json({ ok: true, data: newPost });
}
