interface SiteHeaderProps {
  children?: React.ReactNode;
}

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-stone bg-parchment-light/80 backdrop-blur-sm z-20 shrink-0">
      {children}
    </header>
  );
}
