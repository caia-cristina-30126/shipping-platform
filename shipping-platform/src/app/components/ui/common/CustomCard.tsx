'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface CustomCardProps {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  contentClassName?: string
  footerClassName?: string
}

export const CustomCard = ({
  title,
  description,
  children,
  footer,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  contentClassName = "",
  footerClassName = "",
}: CustomCardProps) => {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className={titleClassName}>{title}</CardTitle>}
          {description && (
            <CardDescription className={descriptionClassName}>
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className={footerClassName}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
} 