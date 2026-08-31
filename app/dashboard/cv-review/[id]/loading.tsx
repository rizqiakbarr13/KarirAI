import { Skeleton } from "@/components/ui/skeleton";

export default function CVReviewLoading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
      <Skeleton className="h-[140px] w-[140px] rounded-full" />
      <Skeleton className="h-24 w-full" />
      <div className="grid w-full gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </div>
  );
}
