interface BannerProps {
  children: React.ReactNode;
  className?: string;
}

export default function BannerWrapper({
  children,
  className = "",
}: BannerProps) {
  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50 
        w-[95%] max-w-md p-4 
        bg-background border border-border 
        rounded-lg shadow-floating 
        animate-slide-up 
        ${className}
      `}
      role="alert"
    >
      {children}
    </div>
  );
}
