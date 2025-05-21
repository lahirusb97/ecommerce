// components/dashboard/RecentOrdersTable.tsx
import React from "react";
// import { prisma } from "@/lib/prisma";

export default async function RecentOrdersTable() {
  // Fetch 5 most recent orders (with user and total)
  //   const orders = await prisma.order.findMany({
  //     orderBy: { createdAt: "desc" },
  //     take: 5,
  //     include: { user: true },
  //   });

  return (
    <div className="rounded-xl border bg-background">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {/* {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.user?.name || "Guest"}</td>
              <td className="px-4 py-2">Rs. {order.total.toLocaleString()}</td>
              <td className="px-4 py-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}
