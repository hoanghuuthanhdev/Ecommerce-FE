import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between px-6 py-6">
        <div className="flex items-baseline gap-4">
          <Link
            to="/"
            className="font-display text-2xl tracking-tight text-ink"
          >
            Catalog
          </Link>
          <Link
            to="/cart"
            className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink"
          >
            Cart ({itemCount})
          </Link>
          <Link
            to="/orders"
            className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink"
          >
            Orders
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/checkout"
            className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-ink hover:text-ink"
          >
            Checkout
          </Link>
          <Link
            to="/products/new"
            className="border border-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-surface"
          >
            Add product
          </Link>
        </div>
      </div>
    </header>
  );
}
