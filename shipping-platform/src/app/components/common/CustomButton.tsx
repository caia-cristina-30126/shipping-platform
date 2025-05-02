

import { Button } from "@/components/ui/button"

type Props = {
  text: string
  onClick?: () => void
  className?: string
  size?: "default" | "sm" | "lg" | "icon" | null
}

export const CustomButton = ({ text, onClick, className, size }: Props) =>
  <Button
    size={size}
    className={`${className} cursor-pointer`}
    onClick={onClick}
  >
    {text}
  </Button>
