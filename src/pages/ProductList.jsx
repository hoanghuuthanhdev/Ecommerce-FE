import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import MockDataBanner from "../components/MockDataBanner";

export default function ProductList() {
  const [draftKeyword, setDraftKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const { items, status, error, reload, usingMockData } = useProducts({
    keyword,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeyword(draftKeyword.trim());
  };

  const handleClear = () => {
    setDraftKeyword("");
    setKeyword("");
  };

  return (
    <>
      {usingMockData && <MockDataBanner />}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 border-b border-line pb-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-3xl text-ink">
                Current Catalog
              </h1>
              <p className="mt-2 font-mono text-xs text-muted">
                Search products by name, brand, category, or description.
              </p>
            </div>
            <span className="font-mono text-xs text-muted">
              {status === "success" ? `${items.length} items` : "\u00A0"}
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="search"
              value={draftKeyword}
              onChange={(e) => setDraftKeyword(e.target.value)}
              placeholder="Search products"
              className="w-full border border-line bg-surface px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              className="border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-ink"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="border border-line px-5 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-ink hover:text-ink"
            >
              Clear
            </button>
          </form>
        </div>

        {status === "loading" && <LoadingState />}

        {status === "error" && (
          <ErrorState
            message={
              error?.message || "Could not load products from the backend."
            }
            onRetry={reload}
          />
        )}

        {status === "success" && items.length === 0 && (
          <p className="py-24 text-center font-mono text-sm text-muted">
            {keyword
              ? `No products found for “${keyword}”.`
              : "No products yet. Add one on the backend to see it here."}
          </p>
        )}

        {status === "success" && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
