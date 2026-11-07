// ==========================================
// SHOWCASE - MY ORDERS SYSTEM
// ==========================================

// Get all orders
function getAllOrders() {
    const orders = getStoredData(ORDERS_STORAGE_KEY, []);
    return Array.isArray(orders) ? orders : [];
}

// Save all orders
function saveAllOrders(orders) {
    saveStoredData(ORDERS_STORAGE_KEY, orders);
}

// Get orders belonging to the logged-in user
function getMyOrders() {
    const currentUser = getCurrentUser();

    if (!currentUser) return [];

    return getAllOrders()
        .filter(order =>
            (
                String(order.userId) === String(currentUser.id) ||
                (
                    order.userEmail &&
                    order.userEmail.toLowerCase() === currentUser.email?.toLowerCase()
                )
            )
        )
        .sort((a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
}

// Find one of the current user's orders
function getMyOrderById(orderId) {
    return getMyOrders().find(order =>
        String(order.id) === String(orderId) ||
        String(order.orderNumber) === String(orderId)
    ) || null;
}

// Get order items safely
function getOrderItems(order) {
    if (Array.isArray(order.items)) return order.items;
    if (Array.isArray(order.products)) return order.products;
    return [];
}

// Get an order item's product image
function getOrderItemImage(item) {
    if (item.image) return item.image;
    if (item.images?.length) return item.images[0];
    if (item.thumbnail) return item.thumbnail;
    if (item.productImage) return item.productImage;

    const product = getProducts().find(
        product => Number(product.id) === Number(item.id)
    );

    return product
        ? getProductImage(product)
        : "https://placehold.co/300x300?text=Product";
}

// Get an order item's product name
function getOrderItemName(item) {
    if (item.name || item.productName) {
        return item.name || item.productName;
    }

    const product = getProducts().find(
        product => Number(product.id) === Number(item.id)
    );

    return product?.name || "Product";
}

// Get order item price
function getOrderItemPrice(item) {
    if (item.price !== undefined) {
        return Number(item.price) || 0;
    }

    const product = getProducts().find(
        product => Number(product.id) === Number(item.id)
    );

    return Number(product?.price || 0);
}

// Format order date
function formatOrderDate(date) {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Display My Orders
function displayOrders() {
    const container = document.getElementById("ordersContent");

    if (!container) return;

    const currentUser = getCurrentUser();

    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Login Required</h3>
                <p>Please login to view your orders.</p>

                <button
                    class="btn btn-primary"
                    onclick="showSection('login')"
                >
                    Login
                </button>

                <button
                    class="btn btn-secondary"
                    onclick="showSection('register')"
                >
                    Create Account
                </button>
            </div>
        `;
        return;
    }

    const orders = getMyOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Orders Yet</h3>
                <p>Your placed orders will appear here.</p>

                <button
                    class="btn btn-primary"
                    onclick="showSection('products')"
                >
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="orders-heading">
            <h2>My Orders</h2>
            <p>View your purchases and track their status.</p>
        </div>

        <div class="orders-list">
            ${orders.map(order => {
                const items = getOrderItems(order);
                const status = order.status || "Placed";

                return `
                    <article class="order-card">

                        <div class="order-card-header">
                            <div>
                                <h3>${escapeHTML(order.orderNumber || order.id)}</h3>
                                <p>${formatOrderDate(order.createdAt)}</p>
                            </div>

                            <span class="order-status ${status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
                                ${escapeHTML(status)}
                            </span>
                        </div>

                        <div class="order-products-preview">
                            ${items.map(item => `
                                <div class="order-product-item">

                                    <img
                                        src="${escapeHTML(getOrderItemImage(item))}"
                                        alt="${escapeHTML(getOrderItemName(item))}"
                                        onerror="this.onerror=null;this.src='https://placehold.co/120x120?text=Product';"
                                    >

                                    <div>
                                        <strong>${escapeHTML(getOrderItemName(item))}</strong>
                                        <p>Quantity: ${Math.max(1, Number(item.quantity) || 1)}</p>
                                        <span>
                                            ${formatPrice(
                                                getOrderItemPrice(item) *
                                                Math.max(1, Number(item.quantity) || 1)
                                            )}
                                        </span>
                                    </div>

                                </div>
                            `).join("")}
                        </div>

                        <div class="order-card-footer">
                            <div>
                                <span>Total Amount</span>
                                <strong>${formatPrice(order.total || 0)}</strong>
                            </div>

                            <div class="order-actions">
                                <button
                                    class="btn btn-primary btn-small"
                                    onclick="viewOrderDetails('${String(order.id).replace(/'/g, "\\'")}')"
                                >
                                    View Details
                                </button>

                                ${
                                    !["Cancelled", "Delivered", "Completed", "Shipped"].includes(status)
                                        ? `
                                            <button
                                                class="btn btn-danger btn-small"
                                                onclick="cancelOrder('${String(order.id).replace(/'/g, "\\'")}')"
                                            >
                                                Cancel Order
                                            </button>
                                        `
                                        : ""
                                }
                            </div>
                        </div>

                    </article>
                `;
            }).join("")}
        </div>
    `;
}

// View one order's complete details
function viewOrderDetails(orderId) {
    const container = document.getElementById("orderDetailsContent");

    if (!container) return;

    const order = getMyOrderById(orderId);

    if (!order) {
        showToast("Order not found.", "error");
        showSection("orders");
        return;
    }

    const items = getOrderItems(order);
    const address = order.deliveryAddress || order.address || {};

    container.innerHTML = `
        <div class="order-details-page">

            <button
                class="btn btn-secondary"
                onclick="showSection('orders')"
            >
                ← Back to My Orders
            </button>

            <div class="order-details-header">
                <div>
                    <h2>Order Details</h2>
                    <p>Order ID: ${escapeHTML(order.orderNumber || order.id)}</p>
                    <p>Placed on: ${formatOrderDate(order.createdAt)}</p>
                </div>

                <span class="order-status">
                    ${escapeHTML(order.status || "Placed")}
                </span>
            </div>

            <section class="order-detail-section">
                <h3>Products Ordered</h3>

                <div class="order-detail-products">
                    ${items.map(item => {
                        const quantity = Math.max(1, Number(item.quantity) || 1);
                        const price = getOrderItemPrice(item);

                        return `
                            <div class="order-detail-product">

                                <img
                                    src="${escapeHTML(getOrderItemImage(item))}"
                                    alt="${escapeHTML(getOrderItemName(item))}"
                                    onerror="this.onerror=null;this.src='https://placehold.co/200x200?text=Product';"
                                >

                                <div class="order-detail-product-info">
                                    <h4>${escapeHTML(getOrderItemName(item))}</h4>
                                    <p>${escapeHTML(item.brand || "")}</p>
                                    <p>Quantity: ${quantity}</p>
                                    <strong>${formatPrice(price * quantity)}</strong>

                                    ${
                                        item.description
                                            ? `<p>${escapeHTML(item.description)}</p>`
                                            : ""
                                    }

                                    ${
                                        Array.isArray(item.features) && item.features.length
                                            ? `<ul>${item.features.map(feature =>
                                                `<li>${escapeHTML(feature)}</li>`
                                            ).join("")}</ul>`
                                            : ""
                                    }
                                </div>

                            </div>
                        `;
                    }).join("")}
                </div>
            </section>

            <section class="order-detail-section">
                <h3>Delivery Information</h3>

                <p><strong>Name:</strong> ${escapeHTML(address.name || order.customerName || "")}</p>
                <p><strong>Phone:</strong> ${escapeHTML(address.phone || order.customerPhone || "")}</p>
                <p><strong>Address:</strong> ${escapeHTML(address.address || "")}</p>
                <p><strong>City:</strong> ${escapeHTML(address.city || "")}</p>
                <p><strong>State:</strong> ${escapeHTML(address.state || "")}</p>
                <p><strong>PIN Code:</strong> ${escapeHTML(address.pincode || "")}</p>
            </section>

            <section class="order-detail-section">
                <h3>Payment Information</h3>
                <p><strong>Payment Method:</strong> ${escapeHTML(order.paymentMethod || order.payment || "Not specified")}</p>
                <p><strong>Order Status:</strong> ${escapeHTML(order.status || "Placed")}</p>
            </section>

            <section class="order-detail-section order-price-summary">
                <h3>Price Summary</h3>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(order.subtotal || 0)}</strong>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <strong>${Number(order.shipping || 0) === 0 ? "FREE" : formatPrice(order.shipping)}</strong>
                </div>

                <div class="summary-row total-row">
                    <span>Total Paid / Payable</span>
                    <strong>${formatPrice(order.total || 0)}</strong>
                </div>
            </section>

            ${
                !["Cancelled", "Delivered", "Completed", "Shipped"].includes(order.status)
                    ? `
                        <button
                            class="btn btn-danger"
                            onclick="cancelOrder('${String(order.id).replace(/'/g, "\\'")}')"
                        >
                            Cancel This Order
                        </button>
                    `
                    : ""
            }

        </div>
    `;

    showSection("orderDetails");
}

// Cancel an order
function cancelOrder(orderId) {
    const order = getMyOrderById(orderId);

    if (!order) {
        showToast("Order not found.", "error");
        return;
    }

    const status = order.status || "Placed";

    if (["Cancelled", "Delivered", "Completed", "Shipped"].includes(status)) {
        showToast("This order can no longer be cancelled.", "warning");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    const orders = getAllOrders();

    const orderIndex = orders.findIndex(
        item => String(item.id) === String(order.id)
    );

    if (orderIndex === -1) {
        showToast("Order not found.", "error");
        return;
    }

    orders[orderIndex].status = "Cancelled";
    orders[orderIndex].cancelledAt = new Date().toISOString();

    saveAllOrders(orders);

    showToast("Your order has been cancelled.", "success");

    const activeSection = document.querySelector(".page-section.active");

    if (activeSection?.id === "orderDetails") {
        viewOrderDetails(orderId);
    } else {
        displayOrders();
    }
}

// Initialize orders
function initializeOrders() {
    displayOrders();
}