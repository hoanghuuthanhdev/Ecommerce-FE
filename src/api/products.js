import { API_BASE_URL, apiFetch } from "./client";
import { MOCK_PRODUCTS, getMockProduct } from "./mockData";

// Flip this to false once your backend is live and you no longer want
// automatic fallback to placeholder data on failure.
const FALL_BACK_TO_MOCKS_ON_FAILURE = true;

/**
 * Normalizes a few common REST response shapes into a plain array:
 * [ ... ]  |  { data: [...] }  |  { products: [...] }
 */
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
}

function normalizeItem(payload) {
  return payload?.data ?? payload?.product ?? payload;
}

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapProduct(product) {
  if (!product || typeof product !== "object") return product;

  const productImageUrl =
    product.image ??
    (product.id != null
      ? `${API_BASE_URL}/products/image/${product.id}`
      : null);

  return {
    id: product.id ?? product.product_id,
    name: product.name ?? "",
    description: product.description ?? "",
    brand: product.brand ?? "",
    price: toNumber(product.price),
    category: product.category ?? "",
    releaseDate: product.releaseDate ?? product.release_date ?? null,
    productAvailable: toBoolean(product.productAvailable ?? product.product_available),
    stockQuantity: toNumber(product.stockQuantity ?? product.stock_quantity),
    image: productImageUrl,
    currency: product.currency ?? "USD",
  };
}

function mapProductList(items) {
  return items.map(mapProduct);
}

function buildProductPayload(formValues) {
  return {
    name: formValues.name ?? "",
    description: formValues.description ?? "",
    brand: formValues.brand ?? "",
    price: formValues.price ? Number(formValues.price) : 0,
    category: formValues.category ?? "",
    releaseDate: formValues.releaseDate || null,
    productAvailable: Boolean(formValues.productAvailable),
    stockQuantity: formValues.stockQuantity
      ? Number(formValues.stockQuantity)
      : 0,
  };
}

async function buildProductFormData(formValues) {
  const formData = new FormData();
  const productPayload = buildProductPayload(formValues);

  formData.append(
    "product",
    new Blob([JSON.stringify(productPayload)], { type: "application/json" }),
  );

  if (formValues.imageFile) {
    formData.append("imageFile", formValues.imageFile);
    return formData;
  }

  if (formValues.imageUrl) {
    const response = await fetch(formValues.imageUrl);
    if (!response.ok) {
      throw new Error("Could not load the current product image for update.");
    }

    const imageBlob = await response.blob();
    const fileName =
      formValues.imageName || `product-${formValues.id ?? "image"}`;
    formData.append("imageFile", imageBlob, fileName);
    return formData;
  }

  throw new Error("An image file is required to save this product.");
}

// GET /products
export async function fetchProducts(params = {}) {
  if (params.keyword) {
    return searchProducts(params.keyword);
  }

  const query = new URLSearchParams(params).toString();
  const path = query ? `/products?${query}` : "/products";
  try {
    const payload = await apiFetch(path);
    return {
      items: mapProductList(normalizeList(payload)),
      usingMockData: false,
    };
  } catch (err) {
    if (FALL_BACK_TO_MOCKS_ON_FAILURE) {
      return { items: mapProductList(MOCK_PRODUCTS), usingMockData: true };
    }
    throw err;
  }
}

// GET /product/search?keyword=...
export async function searchProducts(keyword) {
  const query = new URLSearchParams({ keyword }).toString();

  try {
    const payload = await apiFetch(`/product/search?${query}`);
    return {
      items: mapProductList(normalizeList(payload)),
      usingMockData: false,
    };
  } catch (err) {
    if (FALL_BACK_TO_MOCKS_ON_FAILURE) {
      const lowerKeyword = String(keyword || "").toLowerCase();
      const items = MOCK_PRODUCTS.filter((product) => {
        const haystack = [
          product.name,
          product.description,
          product.brand,
          product.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(lowerKeyword);
      });

      return { items: mapProductList(items), usingMockData: true };
    }

    throw err;
  }
}

// GET /products/:id
export async function fetchProduct(id) {
  try {
    const payload = await apiFetch(`/products/${id}`);
    return { item: mapProduct(normalizeItem(payload)), usingMockData: false };
  } catch (err) {
    if (FALL_BACK_TO_MOCKS_ON_FAILURE) {
      const item = getMockProduct(id);
      if (item) return { item: mapProduct(item), usingMockData: true };
    }
    throw err;
  }
}

/**
 * POST /product
 * Matches the Spring Boot controller:
 *   - part "product": JSON Product object (releaseDate as yyyy-MM-dd)
 *   - part "imageFile": the uploaded image (MultipartFile)
 */
export async function createProduct(formValues) {
  const formData = await buildProductFormData(formValues);

  const payload = await apiFetch("/product", {
    method: "POST",
    body: formData,
  });
  return mapProduct(normalizeItem(payload));
}

export async function updateProduct(id, formValues) {
  const formData = await buildProductFormData(formValues);

  const payload = await apiFetch(`/product/${id}`, {
    method: "PUT",
    body: formData,
  });
  return mapProduct(normalizeItem(payload));
}

export async function deleteProduct(id) {
  return apiFetch(`/product/${id}`, {
    method: "DELETE",
  });
}
