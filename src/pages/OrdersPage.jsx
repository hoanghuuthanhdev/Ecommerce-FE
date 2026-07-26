import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchOrders } from "../api/orders";

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function getOrderTotal(order) {
  return order.totalAmount || order.subtotal || 0;
}

export default function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const createdOrder = location.state?.createdOrder;

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setStatus("loading");
      setError(null);

      try {
        const data = await fetchOrders();
        if (!isMounted) return;
        setOrders(data);
        setStatus("success");
      } catch (loadError) {
        if (!isMounted) return;
        setOrders([]);
        setStatus("error");
        setError(loadError);
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleOrders = createdOrder
    ? [createdOrder, ...orders.filter((order) => order.id !== createdOrder.id)]
    : orders;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Orders</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
            Orders returned from the backend order API.
          </p>
        </div>
        <Link
          to="/checkout"
          className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-ink"
        >
          Go to checkout
        </Link>
      </div>

      {createdOrder && (
        <div className="mb-8 border border-brand bg-brand/5 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">
            Latest order
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-ink">
                Order {createdOrder.orderNumber ?? createdOrder.id ?? "#"}
              </h2>
              <p className="mt-1 font-mono text-sm text-muted">
                {createdOrder.customerName || "Customer"} ·{" "}
                {createdOrder.status}
              </p>
            </div>
            <p className="font-display text-2xl text-ink">
              {formatCurrency(getOrderTotal(createdOrder))}
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <p className="py-24 text-center font-mono text-sm text-muted">
          Loading orders…
        </p>
      )}

      {status === "error" && (
        <div className="border border-red-400/40 bg-red-500/10 px-6 py-4 font-mono text-xs text-red-700">
          {error?.message || "Could not load orders from the backend."}
        </div>
      )}

      {status === "success" && visibleOrders.length === 0 && (
        <div className="border border-line bg-surface p-10 text-center">
          <p className="font-display text-2xl text-ink">No orders yet.</p>
          <p className="mt-2 font-mono text-sm text-muted">
            Place an order from checkout to see it here.
          </p>
        </div>
      )}

      {status !== "loading" && visibleOrders.length > 0 && (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <article
              key={order.id ?? `${order.orderNumber}-${order.createdAt}`}
              className="border border-line bg-surface p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-ink">
                    Order {order.orderNumber ?? order.id ?? "#"}
                  </h2>
                  <p className="mt-1 font-mono text-sm text-muted">
                    {order.customerName || "Customer"}
                    {order.customerEmail ? ` · ${order.customerEmail}` : ""}
                  </p>
                  {order.shippingAddress && (
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                      {order.shippingAddress}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    Status
                  </p>
                  <p className="mt-1 font-display text-2xl text-ink">
                    {order.status || "Placed"}
                  </p>
                  <p className="mt-1 font-display text-2xl text-ink">
                    {formatCurrency(getOrderTotal(order))}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-t border-line pt-4 md:grid-cols-2">
                {order.items?.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={`${order.id ?? order.orderNumber}-item-${index}`}
                      className="border border-line px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-lg text-ink">
                            {item.productName || `Item ${index + 1}`}
                          </p>
                          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <p className="font-display text-lg text-ink">
                          {formatCurrency(
                            item.totalPrice || item.unitPrice * item.quantity,
                            item.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-mono text-sm text-muted">
                    No order items were returned by the backend.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
