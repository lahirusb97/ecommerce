// app/dashboard/page.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { DollarSign, Users, ShoppingCart, Package } from "lucide-react";
import RecentOrdersTable from "@/components/ui/RecentOrdersTable";

export default async function DashboardPage() {
  // Fetch counts from DB (SSR, no flicker)
  const [productCount, orderCount, customerCount, totalSales] =
    await Promise.all([
      prisma.product.count(),
      // prisma.order.count(),
      prisma.user.count(),
      // prisma.order.aggregate({ _sum: { total: true } }),
    ]);

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Products"
          value={productCount}
          icon={<Package className="w-8 h-8 text-primary" />}
        />
        <SummaryCard
          title="Orders"
          value={orderCount}
          icon={<ShoppingCart className="w-8 h-8 text-primary" />}
        />
        <SummaryCard
          title="Customers"
          value={customerCount}
          icon={<Users className="w-8 h-8 text-primary" />}
        />
        {/* <SummaryCard
          title="Total Sales"
          value={
            "Rs. " + (totalSales._sum.total?.toLocaleString() ?? "0")
          }
          icon={<DollarSign className="w-8 h-8 text-primary" />}
        /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <RecentOrdersTable />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Best Selling Products</h2>
          {/* You can add a BestSellingProductsTable or card here */}
        </div>
      </div>
    </div>
  );
}

// SummaryCard component
function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className="flex items-center gap-4 p-6">
      <div>{icon}</div>
      <div>
        <CardHeader className="p-0">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </div>
    </Card>
  );
}
