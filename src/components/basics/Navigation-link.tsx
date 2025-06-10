"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner toast is used here for error feedback

interface NavigationLinkProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => Promise<void> | void; // onClick can now be async
  variant?:
    | "default"
    | "ghost"
    | "link"
    | "destructive"
    | "outline"
    | "secondary";
  loadingText?: string;
  icon?: {
    icon_component: React.ReactNode;
    icon_position?: "left" | "right";
  }; // Make icon optional
}
const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  variant,
  loadingText,
  children,
  className,
  icon,
  onClick,
}) => {
  const router = useRouter();
  const [linkIsNavigating, setLinkIsNavigating] = React.useState(false);

  const handleClick = async () => {
    // Made this function async
    setLinkIsNavigating(true); // Set loading state immediately on click

    try {
      // Execute the provided onClick function and await its completion if it's an async function
      if (onClick) {
        await onClick();
      }

      // If href is provided, navigate after onClick is done
      if (href) {
        // Adding a small artificial delay for better UX, remove if not needed
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing/navigation delay
        router.push(href);
      }
    } catch (error: any) {
      // Catch any errors from onClick or navigation
      console.error("NavigationLink operation failed:", error);
      // Display a generic error toast if the onClick function didn't handle it
      toast.error("Action failed", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      // Always reset loading state after all operations (success or failure)
      setLinkIsNavigating(false);
    }
  };

  const iconPosition = icon?.icon_position || "right"; // Default to "right"

  return (
    <Button
      variant={variant}
      onClick={handleClick} // Call the async handleClick
      disabled={linkIsNavigating}
      className={"flex items-center gap-2 " + className} // Added for spacing
    >
      {/* Render left icon if not navigating and position is left */}
      {icon &&
        iconPosition === "left" &&
        !linkIsNavigating &&
        icon.icon_component}

      {/* Show loading text or children */}
      {linkIsNavigating && loadingText ? loadingText : children}

      {/* Show Loader2 if navigating, otherwise render right icon */}
      {linkIsNavigating ? (
        <Loader2 className="animate-spin" />
      ) : (
        icon && iconPosition === "right" && icon.icon_component
      )}
    </Button>
  );
};

export default NavigationLink;
