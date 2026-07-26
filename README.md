# Ecommerce Frontend

React + Vite + Tailwind frontend for browsing product data from your backend API.

## Setup

```bash
npm install
cp .env.example .env   # then edit VITE_API_BASE_URL
npm run dev
```

Opens at `http://localhost:5173`.

## Connecting your backend

The app talks to your API through `src/api/products.js`, which expects two
REST endpoints (relative to `VITE_API_BASE_URL`):

- `GET /products` — list of products
- `GET /products/:id` — a single product

It tolerates a few common response shapes automatically:
- List: `[...]`, `{ data: [...] }`, or `{ products: [...] }`
- Item: `{...}`, `{ data: {...} }`, or `{ product: {...} }`

Expected product fields (extras are ignored, missing optional ones degrade
gracefully):

```
id, name, price, currency, category, description, image, inStock, sku
```

If your backend's endpoint names, response shape, or field names differ,
adjust `normalizeList` / `normalizeItem` in `src/api/products.js` — that's
the single place response parsing happens.

## Placeholder data

Until `VITE_API_BASE_URL` points at a live backend (or if a request fails),
the app automatically falls back to sample data in `src/api/mockData.js` and
shows a banner saying so. This lets you preview and style the UI immediately.
Turn this off by setting `FALL_BACK_TO_MOCKS_ON_FAILURE = false` in
`src/api/products.js` once your backend is ready.

## Project structure

```
src/
  api/          fetch client + product endpoints + mock data
  hooks/        useProducts, useProduct — data fetching hooks
  components/   Header, ProductCard, PriceTag, Loading/Error states
  pages/        ProductList, ProductDetail
```

## Next steps

Not built yet, since scope was product browsing only: cart, checkout, auth,
search/filtering, pagination. The `useProducts` hook already accepts a
`params` object that's serialized to a query string, so wiring up filters
just means passing params through from a UI control.
