import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwtToken";
import { Card } from "@/components/ui/card";

export default async function OrdersPage() {
  // 1. Auth check
  const token = (await cookies()).get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;
  if (!payload?.userId) redirect("/");

  //iser Data
  const user = await prisma.user.findUnique({
    where: { id: BigInt(payload.userId) },
  });
  // 2. Fetch orders with items
  const orders = await prisma.order.findMany({
    where: { userId: BigInt(payload.userId) },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      status: true,
      items: {
        select: {
          name: true,
          sku: true,
          quantity: true,
          price: true,
          imageUrl: true,
        },
      },
    },
  });

  // 3. Render table with nested order items
  return (
    <Card className="max-w-3xl mx-auto mt-0 p-2 gap-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Hello, {user?.name}</h2>
        <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
        <p className="text-sm text-muted-foreground">Phone: {user?.phone}</p>
      </div>
      <h2 className="text-xl font-bold mb-1">Your Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr>
              <th className="border-b p-2">Order ID</th>
              <th className="border-b p-2">Date</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id.toString()} className="align-top">
                  <td className="border-b p-2">{order.id.toString()}</td>
                  <td className="border-b p-2">
                    {order.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border-b p-2">{order.status}</td>
                  <td className="border-b p-2">
                    <ul className="divide-y">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="py-2 flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-10 h-10 rounded object-cover border"
                            />
                          )}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-600">
                              SKU: {item.sku}
                            </div>
                            <div className="text-xs">Qty: {item.quantity}</div>
                            <div className="text-xs font-semibold">
                              Price: ${Number(item.price).toFixed(2)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
