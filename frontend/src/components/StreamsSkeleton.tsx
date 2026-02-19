export function StreamsSkeleton() {
  return (
    <div className="flex flex-col gap-4 bg-zinc-800 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg overflow-hidden border border-zinc-700 animate-pulse"
          >
            <div className="w-full aspect-video bg-zinc-700" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-4 w-28 bg-zinc-700 rounded" />
              <div className="h-3 w-full bg-zinc-700 rounded" />
              <div className="h-3 w-20 bg-zinc-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
