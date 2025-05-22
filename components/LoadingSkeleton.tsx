import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react"; // Or your store logo

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      {/* Shimmer bar at the top */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden">
        <div className="h-full w-1/3 bg-primary animate-[shimmer_1.5s_infinite] rounded-full" />
      </div>

      {/* Central loader */}
      <div className="flex flex-col items-center space-y-6">
        {/* Store Icon / Logo */}
        <span className="flex items-center justify-center w-20 h-20 rounded-full bg-muted shadow-lg animate-pulse">
          <ShoppingCart size={48} className="text-primary" />
        </span>
        {/* Large title skeleton */}
        <Skeleton className="h-8 w-60" />
        {/* Paragraph skeleton */}
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

// Add this to your global CSS (if not using Tailwind's animate utilities)
// Or add this to tailwind.config.js as a custom animation
/*
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
*/
