import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route
          path="*"
          element={
            <p className="mx-auto max-w-6xl px-6 py-24 text-center font-mono text-sm text-muted">
              Page not found.
            </p>
          }
        />
      </Routes>
    </div>
  );
}
