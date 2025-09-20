import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};
export default function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "px-3 py-2 rounded-xl text-sm font-semibold",
        variant === "primary" && "bg-white text-slate-900",
        variant === "ghost" && "bg-white/5 text-white",
        className
      )}
    />
  );
}
