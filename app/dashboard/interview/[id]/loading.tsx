import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewSessionLoading() {
  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col gap-4">
      <Skeleton className="h-6 w-48" />
      <div className="flex-1 space-y-3 py-4">
        <Skeleton className="h-14 w-2/3" />
        <Skeleton className="ml-auto h-10 w-1/2" />
        <Skeleton className="h-14 w-3/4" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
