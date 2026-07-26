import { Link } from "react-router-dom";
import PriceTag from "./PriceTag";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, index }) {
  const { addItem } = useCart();
  const {
    id,
    name,
    price,
    currency,
    category,
    brand,
    releaseDate,
    stockQuantity,
    image,
    productAvailable,
  } = product;

  return (
    <div className="group flex flex-col border border-line bg-surface transition-colors hover:border-brand">
      <Link to={`/products/${id}`} className="block">
        <div className="relative flex aspect-[4/5] overflow-hidden bg-gradient-to-br from-brand to-brand-dark">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between p-5 text-surface">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-surface/70">
                  {category || "Product"}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-surface/70">
                  {stockQuantity} units
                </span>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-surface/70">
                  {brand || "Inventory"}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight">
                  {name}
                </h3>
              </div>
            </div>
          )}
          <span className="absolute left-3 top-3 font-mono text-xs text-surface drop-shadow">
            No. {String(index + 1).padStart(3, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {brand ? `${brand} · ` : ""}
                {category}
              </p>
              <h3 className="mt-1 font-display text-lg leading-snug text-ink">
                {name}
              </h3>
              {releaseDate && (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                  Released {new Date(releaseDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="mt-auto pt-2">
            <PriceTag price={price} currency={currency} productAvailable={productAvailable} />
          </div>
        </div>
      </Link>

      <div className="border-t border-line p-4">
        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={!productAvailable}
          className="w-full border border-ink bg-ink px-4 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted"
        >
          {productAvailable ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
