

import { Button } from "@/components/ui/button"

type Props = {
  text: string
  onClick?: () => void
  className?: string
  size?: "default" | "sm" | "lg" | "icon" | null 
}

export const BasicButton = ({text, onClick, className, size}: Props) => {

  return (
        <Button 
          size={size}
          className={className}
          onClick={onClick}
        >
         {text}
        </Button>
   
  )
} 