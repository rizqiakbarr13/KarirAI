import { Skeleton } from "@/components/ui/skeleton";

export default function CVBuilderLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-card border border-dark/10 bg-white p-6">
          <Skeleton className="h-8 w-full" />
          <div className="mt-8 flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <Skeleton className="aspect-[1/1.414] w-full" />
      </div>
    </div>
  );
}
