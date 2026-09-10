import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-black/10 bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}
