import React from "react";
export default function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`bg-white/5 rounded-2xl backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}
