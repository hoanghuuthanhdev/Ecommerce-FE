import { useNavigate, useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { deleteProduct } from "../api/products";
import PriceTag from "../components/PriceTag";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import MockDataBanner from "../components/MockDataBanner";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { item, status, error, reload, usingMockData } = useProduct(id);

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    await deleteProduct(id);
    navigate("/");
  };

  return (
    <>
      {usingMockData && <MockDataBanner />}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-widest text-muted hover:text-brand"
        >
          ← Back to catalog
        </Link>

        {status === "loading" && <LoadingState label="Loading product…" />}

        {status === "error" && (
          <ErrorState
            message={error?.message || "Could not load this product."}
            onRetry={reload}
          />
        )}

        {status === "success" && item && (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="aspect-[4/5] overflow-hidden border border-line bg-gradient-to-br from-brand to-brand-dark">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col justify-between p-6 text-surface">
                  <div className="flex items-start justify-between gap-3 font-mono text-[11px] uppercase tracking-widest text-surface/70">
                    <span>{item.brand || "Product"}</span>
                    <span>{item.stockQuantity ?? 0} units</span>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-surface/70">
                      {item.category}
                    </p>
                    <h2 className="mt-3 font-display text-4xl leading-tight">
                      {item.name}
                    </h2>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => addItem(item)}
                  disabled={!item.productAvailable}
                  className="border border-brand bg-brand px-4 py-2 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-brand disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted"
                >
                  {item.productAvailable ? "Add to cart" : "Sold out"}
                </button>
                <Link
                  to={`/products/${id}/edit`}
                  className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-ink"
                >
                  Edit product
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="border border-red-500 px-4 py-2 font-mono text-xs uppercase tracking-widest text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                >
                  Delete product
                </button>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  {item.brand ? `${item.brand} · ` : ""}
                  {item.category}
                </p>
                <h1 className="mt-2 font-display text-4xl leading-tight text-ink">
                  {item.name}
                </h1>
                {item.releaseDate && (
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
                    Released {new Date(item.releaseDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <PriceTag
                price={item.price}
                currency={item.currency}
                productAvailable={item.productAvailable}
              />

              {item.description && (
                <p className="max-w-md text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="border border-line bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    Availability
                  </p>
                  <p className="mt-2 font-display text-xl text-ink">
                    {item.productAvailable ? "Available" : "Unavailable"}
                  </p>
                </div>
                <div className="border border-line bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    Stock
                  </p>
                  <p className="mt-2 font-display text-xl text-ink">
                    {item.stockQuantity ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
