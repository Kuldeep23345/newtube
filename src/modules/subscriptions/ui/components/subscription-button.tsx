import { cn } from "@/lib/utils"
import{Button} from "@/components/ui/button"

interface SubscriptionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: "lg" | "md" | "sm" | "icon";
    
} 


export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-full", className)}
      variant={isSubscribed ? "secondary" : "default"}
      size={size === "icon" ? "icon" : "default"}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  )
}
