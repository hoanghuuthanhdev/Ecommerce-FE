# Ecommerce Frontend

React + Vite + Tailwind storefront for browsing products, managing a cart, creating and editing products, and placing orders against a backend API.

## What This App Does

- Browse the product catalog
- Search products by keyword
- View product details
- Create, update, and delete products
- Add items to a persistent shopping cart
- Checkout and place an order
- View backend orders

## Tech Stack

- React 18
- React Router
- Vite
- Tailwind CSS

## Quick Start

```bash
npm install
copy .env.example .env
npm run dev
```

The dev server runs on `http://localhost:5173`.

## Environment Variables

Create a `.env` file from `.env.example` and set the backend base URL:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

`src/api/client.js` uses this value as the root for every API request.

## Routes

- `/` - product catalog
- `/products/new` - create a product
- `/products/:id` - product detail
- `/products/:id/edit` - edit a product
- `/cart` - shopping cart
- `/checkout` - place an order
- `/orders` - backend order list

## API Contract

The frontend is intentionally tolerant of common backend response shapes, but it still expects the backend to follow the same basic resource model.

### Products

Used by `src/api/products.js`.

- `GET /products` - list products
- `GET /products/:id` - fetch a single product
- `GET /product/search?keyword=...` - keyword search
- `POST /product` - create a product with multipart form data
- `PUT /product/:id` - update a product with multipart form data
- `DELETE /product/:id` - delete a product

Accepted list shapes:

- `[...]`
- `{ data: [...] }`
- `{ products: [...] }`

Accepted item shapes:

- `{...}`
- `{ data: {...} }`
- `{ product: {...} }`

Expected product fields:

```text
id, name, price, currency, category, description, image, productAvailable, stockQuantity
```

### Product Create / Update Payload

`src/components/ProductForm.jsx` submits multipart form data in this shape:

- part `product`: JSON blob with product fields
- part `imageFile`: uploaded image file

The JSON payload includes:

- `name`
- `description`
- `brand`
- `price`
- `category`
- `releaseDate`
- `productAvailable`
- `stockQuantity`

### Orders

Used by `src/api/orders.js`.

- `POST /orders/place` - place an order
- `GET /orders` - fetch order history

Expected order request fields:

- `customerName`
- `customerEmail` or `email`
- `shippingAddress`
- `paymentMethod`
- `subtotal`
- `totalAmount`
- `items`
- `orderItems`

Each order item includes:

- `productId`
- `productName`
- `quantity`
- `unitPrice`
- `totalPrice`
- `currency`

The frontend normalizes both `customerEmail` and `email` in order responses so backend field naming differences do not break the UI.

## Fallback Data

If product requests fail, the app falls back to `src/api/mockData.js` and shows a banner so the UI still works without a live backend.

This fallback is enabled in `src/api/products.js` through `FALL_BACK_TO_MOCKS_ON_FAILURE`.

Orders do not have a mock fallback. If the order API fails, the checkout flow shows the backend error.

## Project Structure

```text
src/
  api/        API client, product endpoints, order endpoints, mock data
  components/ Shared UI pieces such as Header, cards, banners, and forms
  context/    Cart state and persistence
  hooks/      Data fetching hooks for products
  pages/      Route-level screens for catalog, detail, cart, checkout, and orders
```

## Important Behavior

- Cart items persist in `localStorage` under `ecommerce-frontend-cart`
- Product detail pages can add items directly to the cart
- Search is performed from the catalog page
- Checkout submits the current cart subtotal and item list to the order API

## Backend Expectations

This frontend assumes the backend exposes Spring-style REST endpoints and accepts multipart product uploads plus JSON order requests.

If your backend uses different paths or field names, the key normalization points are:

- `src/api/products.js` for product response/request mapping
- `src/api/orders.js` for order request/response mapping
- `src/api/client.js` for the API base URL and fetch wrapper

## Troubleshooting

- If product pages show a mock banner, the live product request failed and the app switched to local sample data.
- If checkout returns `400`, verify the backend `OrderRequest` fields line up with the payload described above, especially `customerEmail` versus `email`.
- If the backend runs on a different host or port, update `VITE_API_BASE_URL` in `.env`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
