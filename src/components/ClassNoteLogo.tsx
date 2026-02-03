import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "hero";
type LogoLayout = "horizontal" | "stacked";

const SIZE_STYLES: Record<LogoSize, { wrap: string; iconBox: string; icon: string; text: string }> = {
  sm: {
    wrap: "gap-2",
    iconBox: "h-9 w-9 rounded-xl",
    icon: "h-5 w-5",
    text: "text-xl",
  },
  md: {
    wrap: "gap-2.5",
    iconBox: "h-10 w-10 rounded-xl",
    icon: "h-5 w-5",
    text: "text-2xl",
  },
  lg: {
    wrap: "gap-3",
    iconBox: "h-12 w-12 rounded-2xl",
    icon: "h-6 w-6",
    text: "text-3xl",
  },
  hero: {
    wrap: "gap-4",
    iconBox: "h-28 w-28 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-3xl",
    icon: "h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20",
    text: "text-5xl sm:text-6xl lg:text-7xl",
  },
};

export default function ClassNoteLogo({
  size = "md",
  layout = "horizontal",
  className,
}: {
  size?: LogoSize;
  layout?: LogoLayout;
  className?: string;
}) {
  const s = SIZE_STYLES[size];

  return (
    <div
      className={cn(
        "inline-flex items-center select-none",
        layout === "stacked" ? "flex-col text-center" : "flex-row",
        s.wrap,
        className
      )}
      aria-label="ClassNote"
    >
      <div
        className={cn(
          "shrink-0 gradient-primary shadow-sm flex items-center justify-center",
          s.iconBox
        )}
        aria-hidden="true"
      >
        <MessageCircle className={cn("text-primary-foreground", s.icon)} />
      </div>

      <span
        className={cn(
          "font-display font-extrabold tracking-tight leading-none text-foreground",
          s.text
        )}
      >
        Class<span className="text-gradient">Note</span>
      </span>
    </div>
  );
}
