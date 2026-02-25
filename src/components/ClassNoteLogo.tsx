import { cn } from "@/lib/utils";
import logoImg from "@/assets/classnote-logo.png";

type LogoSize = "sm" | "md" | "lg" | "hero";
type LogoLayout = "horizontal" | "stacked";

const SIZE_STYLES: Record<LogoSize, { wrap: string; img: string; text: string }> = {
  sm: {
    wrap: "gap-1.5",
    img: "h-8 w-8",
    text: "text-xl",
  },
  md: {
    wrap: "gap-2",
    img: "h-10 w-10",
    text: "text-2xl",
  },
  lg: {
    wrap: "gap-2.5",
    img: "h-12 w-12",
    text: "text-3xl",
  },
  hero: {
    wrap: "gap-4",
    img: "h-28 w-28 sm:h-32 sm:w-32 lg:h-40 lg:w-40",
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
      <img
        src={logoImg}
        alt=""
        className={cn("shrink-0 object-contain", s.img)}
        aria-hidden="true"
      />

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
