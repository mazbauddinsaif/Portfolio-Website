export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-5">
      <div className="size-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
      <p className="text-xs tracking-[0.16em] text-ink-faint uppercase">Loading</p>
    </div>
  );
}
