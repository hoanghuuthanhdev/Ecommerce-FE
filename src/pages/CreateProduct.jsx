import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../api/products";
import ProductForm from "../components/ProductForm";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (formValues) => {
    setSubmitStatus("loading");
    setSubmitError(null);

    try {
      await createProduct(formValues);
      navigate("/");
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(err);
      throw err;
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/"
        className="mb-8 inline-block font-mono text-xs uppercase tracking-widest text-muted hover:text-brand"
      >
        ← Back to catalog
      </Link>

      <ProductForm
        title="Add new product"
        submitLabel="Create product"
        submitStatus={submitStatus}
        submitError={submitError}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
