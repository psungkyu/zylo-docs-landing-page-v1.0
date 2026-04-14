import React from "react";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}

export default function SectionContainer({
  children,
  className = "",
  id,
  fullWidth = false,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`
        ${fullWidth ? "w-full" : "container"}
        py-20 lg:py-32
        ${className}
      `}
    >
      {children}
    </section>
  );
}
