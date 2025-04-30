import { CustomCard } from "@/app/components/ui/common/CustomCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DashboardWelcome = () =>
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
        Get started by viewing and managing your products. You can add new
        products, view existing ones, and keep track of your inventory.
      </p>
      <Link href={"dashboard/products"} className="bg-amber-400">
        <Button>Go to products</Button>
      </Link>
    </CustomCard>
  </div>

