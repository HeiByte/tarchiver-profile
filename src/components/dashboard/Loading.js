import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex-1 p-8 bg-white m-8 border-[#164B99] border-2 rounded overflow-hidden relative">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-7 w-40 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        <div className="flex flex-col gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <FolderSkeletonItem key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FolderSkeletonItem() {
  return (
    <div className="flex items-center gap-4 max-w-sm p-2">
      {/* Folder icon */}
      <Skeleton className="w-10 h-10 rounded-md flex-shrink-0" />

      {/* Folder name */}
      <Skeleton className="h-4 flex-1 rounded-md" />

      {/* Menu button */}
      <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
    </div>
  );
}
