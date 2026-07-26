import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Shopping Cart</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
            Review items before checkout.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-ink hover:text-ink"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={clearCart}
            disabled={items.length === 0}
            className="border border-danger px-4 py-2 font-mono text-xs uppercase tracking-widest text-danger transition-colors hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:text-muted"
          >
            Clear cart
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border border-line bg-surface p-10 text-center">
          <p className="font-display text-2xl text-ink">Your cart is empty.</p>
          <p className="mt-2 font-mono text-sm text-muted">
            Add products from the catalog to build an order.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-ink"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 border border-line bg-surface p-4 sm:flex-row"
              >
                <div className="h-28 w-28 overflow-hidden bg-gradient-to-br from-brand to-brand-dark sm:h-32 sm:w-32">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                      {item.brand ? `${item.brand} · ` : ""}
                      {item.category}
                    </p>
                    <h2 className="mt-1 font-display text-2xl text-ink">
                      {item.name}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="font-mono text-xs uppercase tracking-widest text-muted">
                      Qty
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        className="ml-3 w-20 border border-line bg-bg px-3 py-2 font-mono text-sm text-ink focus:border-brand focus:outline-none"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="font-mono text-xs uppercase tracking-widest text-danger transition-colors hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-2 sm:items-end">
                  <p className="font-display text-2xl text-ink">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {formatPrice(item.price, item.currency)} each
                  </p>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit border border-line bg-surface p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Order summary
            </p>
            <div className="mt-4 space-y-3 border-b border-line pb-4 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>
                  {formatPrice(subtotal, items[0]?.currency || "USD")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-2xl text-ink">Total</span>
              <span className="font-display text-2xl text-ink">
                {formatPrice(subtotal, items[0]?.currency || "USD")}
              </span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 flex w-full justify-center border border-ink bg-ink px-4 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-ink"
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
