import { Skeleton } from "@/components/ui/Card";

export function HomeSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading your dashboard">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-9 w-64 rounded-xl sm:w-80" />
          <Skeleton className="h-4 w-56 rounded-lg" />
        </div>
        <div className="hidden gap-2 lg:flex">
          <Skeleton className="h-11 w-24 rounded-full" />
          <Skeleton className="h-11 w-24 rounded-full" />
          <Skeleton className="h-11 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Skeleton className="h-[360px] rounded-[30px] lg:col-span-8" />
        <div className="space-y-5 lg:col-span-4">
          <Skeleton className="h-[230px] rounded-[30px]" />
          <Skeleton className="h-[250px] rounded-[30px]" />
        </div>
        <div className="space-y-4 lg:col-span-8">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[240px] rounded-[24px]" />
            <Skeleton className="h-[240px] rounded-[24px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
