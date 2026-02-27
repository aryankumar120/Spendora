import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
      variant === "default" && "border-orange-200 bg-orange-50 text-orange-700",
      variant === "outline" && "border-border bg-white text-slate-700",
      variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
      variant === "danger" && "border-red-200 bg-red-50 text-red-700",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
