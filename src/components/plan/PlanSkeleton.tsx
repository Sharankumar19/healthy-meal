import { Skeleton } from "@/components/ui/Card";

export function PlanSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading your weekly plan">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-10 w-72 rounded-xl sm:w-96" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>

      <Skeleton className="h-[126px] rounded-[26px]" />

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Skeleton className="h-[290px] rounded-[30px]" />
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-[150px] rounded-[24px]" />
          <Skeleton className="h-[150px] rounded-[24px]" />
          <Skeleton className="h-[150px] rounded-[24px]" />
        </div>
        <div className="space-y-5 lg:col-span-4">
          <Skeleton className="h-[380px] rounded-[28px]" />
          <Skeleton className="h-[280px] rounded-[26px]" />
        </div>
      </div>
    </div>
  );
}
