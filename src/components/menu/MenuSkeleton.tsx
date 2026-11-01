import { Skeleton } from "@/components/ui/Card";

export function MenuSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading the menu">
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-9 w-80 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
      <div className="flex gap-2 overflow-hidden">
        {["w-20", "w-24", "w-20", "w-28", "w-24", "w-24"].map((width, index) => (
          <Skeleton
            key={index}
            className={`h-9 shrink-0 rounded-full ${width}`}
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-card sm:flex-col"
          >
            <Skeleton className="h-[190px] w-[118px] shrink-0 rounded-none sm:h-[190px] sm:w-full" />
            <div className="flex-1 space-y-2.5 p-3.5">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
