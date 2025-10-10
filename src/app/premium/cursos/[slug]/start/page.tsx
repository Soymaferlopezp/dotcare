import StartFetchClient from "@/components/dashboard/Courses/StartFetchClient";

export default async function CourseStartPage(ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params; // 👈 importante
  return <StartFetchClient slug={slug} />;
}
