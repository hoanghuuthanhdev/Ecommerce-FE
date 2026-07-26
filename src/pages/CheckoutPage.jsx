import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { buildOrderPayload, placeOrder } from "../api/orders";

function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const customerName = String(formData.get("customerName") || "").trim();
    const email = String(formData.get("customerEmail") || "").trim();
    const shippingAddress = String(
      formData.get("shippingAddress") || "",
    ).trim();
    const paymentMethod = String(formData.get("paymentMethod") || "card");

    setSubmitStatus("loading");
    setSubmitError(null);

    try {
      const orderRequest = buildOrderPayload({
        customerName,
        email: email,
        shippingAddress,
        paymentMethod,
        items,
        subtotal,
      });

      const createdOrder = await placeOrder(orderRequest);
      clearCart();
      navigate("/orders", {
        state: { createdOrder },
        replace: true,
      });
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(error);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 border-b border-line pb-5">
        <h1 className="font-display text-3xl text-ink">Checkout</h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
          Review shipping and place the order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitStatus === "error" && (
            <div className="border border-red-400/40 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-700">
              {submitError?.message || "Could not place the order."}
            </div>
          )}

          <section className="border border-line bg-surface p-5">
            <h2 className="font-display text-2xl text-ink">Customer details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="block font-mono text-xs uppercase tracking-widest text-muted">
                  Full name
                </span>
                <input
                  required
                  type="text"
                  name="customerName"
                  className="w-full border border-line bg-bg px-4 py-3 font-mono text-sm text-ink focus:border-brand focus:outline-none"
                  placeholder="Alex Morgan"
                />
              </label>
              <label className="space-y-2">
                <span className="block font-mono text-xs uppercase tracking-widest text-muted">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="customerEmail"
                  className="w-full border border-line bg-bg px-4 py-3 font-mono text-sm text-ink focus:border-brand focus:outline-none"
                  placeholder="alex@example.com"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="block font-mono text-xs uppercase tracking-widest text-muted">
                  Address
                </span>
                <input
                  required
                  type="text"
                  name="shippingAddress"
                  className="w-full border border-line bg-bg px-4 py-3 font-mono text-sm text-ink focus:border-brand focus:outline-none"
                  placeholder="123 Market Street"
                />
              </label>
            </div>
          </section>

          <section className="border border-line bg-surface p-5">
            <h2 className="font-display text-2xl text-ink">Payment method</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 border border-line px-4 py-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  defaultChecked
                />
                <span className="font-mono text-sm text-ink">Card</span>
              </label>
              <label className="flex items-center gap-3 border border-line px-4 py-3">
                <input type="radio" name="paymentMethod" value="cod" />
                <span className="font-mono text-sm text-ink">
                  Cash on delivery
                </span>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitStatus === "loading"}
            className="w-full border border-brand bg-brand px-5 py-4 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitStatus === "loading" ? "Placing order…" : "Place order"}
          </button>
        </form>

        <aside className="h-fit border border-line bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Order summary
          </p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>
                {items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, items[0]?.currency || "USD")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>Calculated later</span>
            </div>
          </div>
          <div className="mt-4 border-t border-line pt-4 flex items-center justify-between">
            <span className="font-display text-2xl text-ink">Total</span>
            <span className="font-display text-2xl text-ink">
              {formatPrice(subtotal, items[0]?.currency || "USD")}
            </span>
          </div>
          <Link
            to="/cart"
            className="mt-6 inline-flex font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink"
          >
            Back to cart
          </Link>
        </aside>
      </div>
    </main>
  );
}
