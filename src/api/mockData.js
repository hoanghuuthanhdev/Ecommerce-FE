export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    description: "Apple flagship smartphone with A18 Pro chip",
    brand: "Apple",
    price: 1199.99,
    category: "Smartphone",
    releaseDate: "20-09-2025",
    inStock: true,
    stockQuantity: 50,
    currency: "USD",
  },
  {
    id: 2,
    name: "Galaxy S25 Ultra",
    description: "Samsung premium Android smartphone with AI features",
    brand: "Samsung",
    price: 1299.99,
    category: "Smartphone",
    releaseDate: "10-02-2025",
    inStock: true,
    stockQuantity: 35,
    currency: "USD",
  },
  {
    id: 3,
    name: "MacBook Air M4",
    description: "Lightweight laptop powered by Apple M4 processor",
    brand: "Apple",
    price: 1499.99,
    category: "Laptop",
    releaseDate: "18-03-2025",
    inStock: true,
    stockQuantity: 20,
    currency: "USD",
  },
];

export function getMockProduct(id) {
  return (
    MOCK_PRODUCTS.find((product) => String(product.id) === String(id)) ?? null
  );
}
