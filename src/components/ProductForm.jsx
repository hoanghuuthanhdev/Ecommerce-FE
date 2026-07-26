import { useState } from "react";

const DEFAULT_FORM = {
  name: "",
  description: "",
  brand: "",
  price: "",
  category: "",
  releaseDate: "",
  productAvailable: true,
  stockQuantity: "",
  imageFile: null,
};

function normalizeFormValue(product) {
  if (!product) return DEFAULT_FORM;

  return {
    name: product.name ?? "",
    description: product.description ?? "",
    brand: product.brand ?? "",
    price: product.price ?? "",
    category: product.category ?? "",
    releaseDate: product.releaseDate ?? "",
    productAvailable: product.stockQuantity ?? true,
    stockQuantity: product.stockQuantity ?? "",
    imageFile: null,
  };
}

export default function ProductForm({
  initialProduct,
  title,
  submitLabel,
  onSubmit,
  onCancel,
  submitError,
  submitStatus,
}) {
  const [form, setForm] = useState(() => normalizeFormValue(initialProduct));
  const [preview, setPreview] = useState(initialProduct?.image ?? null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    updateField("imageFile", file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(initialProduct?.image ?? null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      imageUrl: initialProduct?.image ?? null,
      imageName: initialProduct?.imageName ?? null,
      id: initialProduct?.id ?? null,
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        <p className="mt-2 font-mono text-xs text-muted">
          Submit product data as multipart/form-data.
        </p>
      </div>

      {submitStatus === "error" && (
        <div className="mb-8 border border-red-400/40 bg-red-500/10 px-6 py-4 font-mono text-xs text-red-700">
          {submitError?.message || "Could not save the product."}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        <div className="flex flex-col gap-5">
          <TextField
            label="Name"
            value={form.name}
            onChange={(v) => updateField("name", v)}
            required
          />
          <TextField
            label="Brand"
            value={form.brand}
            onChange={(v) => updateField("brand", v)}
          />
          <TextField
            label="Category"
            value={form.category}
            onChange={(v) => updateField("category", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Price"
              value={form.price}
              onChange={(v) => updateField("price", v)}
              min="0"
              step="0.01"
              required
            />
            <NumberField
              label="Stock quantity"
              value={form.stockQuantity}
              onChange={(v) => updateField("stockQuantity", v)}
              min="0"
              step="1"
              required
            />
          </div>
          <TextField
            label="Release date"
            type="date"
            value={form.releaseDate}
            onChange={(v) => updateField("releaseDate", v)}
          />
          <label className="flex cursor-pointer items-center gap-3 border border-line bg-surface p-4">
            <input
              type="checkbox"
              checked={form.productAvailable}
              onChange={(e) =>
                updateField("productAvailable", e.target.checked)
              }
              className="h-4 w-4 accent-brand"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Product available
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-widest text-muted">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={5}
              className="resize-none border border-line bg-surface p-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-widest text-muted">
              Product image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-line bg-surface p-3 text-sm file:mr-3 file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:text-surface"
            />
            {preview && (
              <div className="mt-2 aspect-[4/5] overflow-hidden border border-line bg-gradient-to-br from-brand to-brand-dark">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={submitStatus === "loading"}
            className="flex-1 border border-ink bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitStatus === "loading" ? "Saving…" : submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-ink hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </main>
  );
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border border-line bg-surface p-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
      />
    </div>
  );
}

function NumberField({ label, value, onChange, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
        className="border border-line bg-surface p-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
      />
    </div>
  );
}
