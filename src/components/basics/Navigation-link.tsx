import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface NavigationLinkProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
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

  const handleClick = () => {
    setLinkIsNavigating(true);
    // then run extra functions if needed
    onClick?.();
    // then navigate to the link
    // setTimeout to simulate a delay for demonstration purposes
    setTimeout(() => {
      if (!href) return;
      router.push(href);
    }, 1000); // Adjust the delay as needed
  };

  const iconPosition = icon?.icon_position || "right"; // Default to "right"

  return (
    <Button
      variant={variant}
      onClick={() => handleClick()}
      disabled={linkIsNavigating}
      className={"flex items-center gap-2 " + className} // Added for spacing
    >
      {icon &&
        iconPosition === "left" &&
        !linkIsNavigating &&
        icon.icon_component}
      {linkIsNavigating && loadingText ? loadingText : children}
      {linkIsNavigating ? (
        <Loader2 className="animate-spin" />
      ) : (
        icon && iconPosition === "right" && icon.icon_component
      )}
    </Button>
  );
};

export default NavigationLink;
