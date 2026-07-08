export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gold-200 overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-gold-100" />
          <div className="p-4 space-y-2.5">
            <div className="h-2.5 bg-gold-100 rounded w-1/3" />
            <div className="h-3.5 bg-gold-100 rounded w-3/4" />
            <div className="h-2.5 bg-gold-100 rounded w-full" />
            <div className="h-2.5 bg-gold-100 rounded w-2/3" />
            <div className="h-8 bg-gold-100 rounded w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-10 bg-gold-100 rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gold-50 rounded" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gold-200 p-6 space-y-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gold-100 rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gold-100 rounded w-2/3" />
          <div className="h-3 bg-gold-100 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gold-100 rounded" />
        <div className="h-3 bg-gold-100 rounded w-5/6" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-10 animate-pulse">
      <div className="aspect-[4/5] bg-gold-100 rounded-lg" />
      <div className="space-y-4">
        <div className="h-3 bg-gold-100 rounded w-1/4" />
        <div className="h-7 bg-gold-100 rounded w-3/4" />
        <div className="h-7 bg-gold-100 rounded w-1/4" />
        <div className="h-3 bg-gold-100 rounded-full w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-gold-100 rounded" />
          <div className="h-3 bg-gold-100 rounded" />
          <div className="h-3 bg-gold-100 rounded w-4/5" />
        </div>
        <div className="flex gap-2">
          {[1,2,3].map((i) => <div key={i} className="h-10 w-16 bg-gold-100 rounded" />)}
        </div>
        <div className="h-12 bg-gold-100 rounded w-full" />
      </div>
    </div>
  );
}
