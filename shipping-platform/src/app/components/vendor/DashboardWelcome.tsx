'use client'

import { Button } from "@/components/ui/button"
import { CustomCard } from "@/app/components/ui/common/CustomCard"
import { useRouter } from "next/navigation"

export const DashboardWelcome = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6">
      <CustomCard
        title="Welcome to Your Dashboard"
        description="Manage your products and track your inventory in one place"
        className="max-w-2xl mx-auto"
        titleClassName="text-3xl font-bold"
        descriptionClassName="text-lg"
        contentClassName="space-y-4"
      >
        <p className="text-muted-foreground">
          Get started by viewing and managing your products. You can add new products,
          view existing ones, and keep track of your inventory.
        </p>
        <Button 
          size="lg" 
          className="w-full sm:w-auto"
          onClick={() => router.push('/dashboard/products')}
        >
          Go to Products
        </Button>
      </CustomCard>
    </div>
  )
} 