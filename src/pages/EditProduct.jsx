import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { updateProduct } from "../api/products";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import MockDataBanner from "../components/MockDataBanner";
import ProductForm from "../components/ProductForm";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, status, error, reload, usingMockData } = useProduct(id);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (formValues) => {
    setSubmitStatus("loading");
    setSubmitError(null);

    try {
      await updateProduct(id, formValues);
      navigate(`/products/${id}`);
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(err);
      throw err;
    }
  };

  return (
    <>
      {usingMockData && <MockDataBanner />}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to={`/products/${id}`}
          className="mb-8 inline-block font-mono text-xs uppercase tracking-widest text-muted hover:text-brand"
        >
          ← Back to product
        </Link>

        {status === "loading" && <LoadingState label="Loading product…" />}

        {status === "error" && (
          <ErrorState
            message={error?.message || "Could not load this product."}
            onRetry={reload}
          />
        )}

        {status === "success" && item && (
          <ProductForm
            title={`Edit ${item.name}`}
            submitLabel="Save changes"
            initialProduct={item}
            submitStatus={submitStatus}
            submitError={submitError}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/products/${id}`)}
          />
        )}
      </main>
    </>
  );
}
