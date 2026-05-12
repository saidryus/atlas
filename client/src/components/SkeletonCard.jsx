export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="h-40 shimmer" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-3.5 shimmer rounded w-3/4" />
        <div className="h-2.5 shimmer rounded w-2/5" />
        <div className="h-2.5 shimmer rounded w-full" />
        <div className="h-2.5 shimmer rounded w-4/5" />
        <div className="flex justify-between pt-0.5">
          <div className="h-2.5 shimmer rounded w-16" />
          <div className="h-2.5 shimmer rounded w-12" />
        </div>
      </div>
    </div>
  );
}
