import { apiFetch } from "./client";

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  return [];
}

function normalizeItem(payload) {
  return payload?.data ?? payload?.order ?? payload;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapOrderItem(item) {
  if (!item || typeof item !== "object") return item;

  return {
    productId: item.productId ?? item.product_id ?? item.id ?? null,
    productName: item.productName ?? item.name ?? item.product_name ?? "",
    quantity: toNumber(item.quantity, 0),
    unitPrice: toNumber(item.unitPrice ?? item.price ?? item.unit_price, 0),
    totalPrice: toNumber(item.totalPrice ?? item.total_price, 0),
    currency: item.currency ?? "USD",
  };
}

function mapOrder(order) {
  if (!order || typeof order !== "object") return order;

  const items = normalizeList(order.items ?? order.orderItems ?? []);

  return {
    id: order.id ?? order.orderId ?? order.order_id ?? null,
    orderNumber: order.orderNumber ?? order.order_number ?? order.id ?? null,
    status: order.status ?? order.orderStatus ?? "Placed",
    customerName: order.customerName ?? order.customer_name ?? "",
    email:
      order.customerEmail ?? order.customer_email ?? order.email ?? "",
    shippingAddress: order.shippingAddress ?? order.address ?? "",
    paymentMethod: order.paymentMethod ?? order.payment_method ?? "",
    createdAt: order.createdAt ?? order.created_at ?? order.orderDate ?? null,
    subtotal: toNumber(
      order.subtotal ?? order.sub_total ?? order.totalAmount,
      0,
    ),
    totalAmount: toNumber(
      order.totalAmount ?? order.total_amount ?? order.subtotal,
      0,
    ),
    items: items.map(mapOrderItem),
  };
}

export function buildOrderPayload({
  customerName,
  email,
  shippingAddress,
  paymentMethod,
  items,
  subtotal,
}) {
  const normalizedItems = items.map((item) => ({
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    totalPrice: item.price * item.quantity,
    currency: item.currency || "USD",
  }));

  return {
    customerName,
    email,
    shippingAddress,
    address: shippingAddress,
    paymentMethod,
    subtotal,
    totalAmount: subtotal,
    items: normalizedItems,
    orderItems: normalizedItems,
  };
}

export async function placeOrder(orderRequest) {
  const payload = await apiFetch("/orders/place", {
    method: "POST",
    body: JSON.stringify(orderRequest),
  });

  return mapOrder(normalizeItem(payload));
}

export async function fetchOrders() {
  const payload = await apiFetch("/orders");
  return normalizeList(payload).map(mapOrder);
}
