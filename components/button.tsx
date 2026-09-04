import type { ButtonHTMLAttributes } from "react";

const sizeStyles = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-2.5 py-1 text-sm",
  md: "px-3 py-1.5 text-sm",
  lg: "px-3.5 py-2 text-sm",
  xl: "px-4 py-2.5 text-sm",
} as const;

type ButtonSize = keyof typeof sizeStyles;

type ButtonProps = {
  label: string;
  size?: ButtonSize;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size">;

const baseStyles =
  "rounded-full bg-white/10 font-semibold text-white ring-1 ring-inset ring-white/5 hover:bg-white/20";

export default function Button({
  label,
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[baseStyles, sizeStyles[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {label}
    </button>
  );
}
