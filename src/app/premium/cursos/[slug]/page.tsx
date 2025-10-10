import CoursePreviewClient from "@/components/dashboard/Courses/CoursePreviewClient";

export default async function CourseSlugPage(ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params; // 👈 importante
  return <CoursePreviewClient slug={slug} />;
}
