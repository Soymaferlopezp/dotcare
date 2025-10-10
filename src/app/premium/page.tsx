import FeedSummary from "@/components/dashboard/Feed/FeedSummary";
import RightNews from "@/components/dashboard/Feed/RightNews";

export default function Page() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
      <FeedSummary />
      <RightNews />
    </div>
  );
}
