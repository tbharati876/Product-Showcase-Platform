
const ORDERS_STORAGE_KEY = "showcase_orders";

// Get all orders
function getOrders() {
    return getStoredData(ORDERS_STORAGE_KEY, []);
}

// Get orders belonging to the current user
function getMyOrders() {
    const user = getCurrentUser();

    if (!user) return [];

    return getOrders().filter(order =>
        order.customerId !== null &&
        String(order.customerId) === String(user.id)
    );
}

// Display orders
function displayOrders() {
    const container = document.getElementById("ordersContent");

    if (!container) return;

    const user = getCurrentUser();

    if (!user) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Login Required</h3>
                <p>Please login to view your orders.</p>
                <button class="btn-primary" onclick="showAuthPage('login')">
                    Login
                </button>
            </div>
        `;
        return;
    }

    const orders = getMyOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Your orders will appear here after checkout.</p>

                <button
                    class="btn-primary"
                    onclick="showSection('products')"
                >
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="orders-page">

            <div class="orders-header">
                <div>
                    <h2>My Orders</h2>
                    <p>Track and manage your purchases.</p>
                </div>

                <span class="orders-count">
                    ${orders.length} Order(s)
                </span>
            </div>

            <div class="orders-list">

                ${orders.map(order => `
                    <div class="order-card">

                        <div class="order-card-header">

                            <div>
                                <span>Order ID</span>
                                <h3>${escapeHTML(order.id)}</h3>
                            </div>

                            <div class="order-status">
                                ${escapeHTML(order.status)}
                            </div>

                        </div>

                        <div class="order-info">

                            <div>
                                <span>Order Date</span>
                                <strong>
                                    ${new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </strong>
                            </div>

                            <div>
                                <span>Payment Method</span>
                                <strong>${escapeHTML(order.paymentMethod)}</strong>
                            </div>

                            <div>
                                <span>Payment Status</span>
                                <strong>${escapeHTML(order.paymentStatus)}</strong>
                            </div>

                            <div>
                                <span>Total Amount</span>
                                <strong>${formatPrice(order.total)}</strong>
                            </div>

                        </div>

                        <div class="order-products">

                            ${order.items.map(item => `
                                <div class="order-product">

                                    <img
                                        src="${escapeHTML(item.image)}"
                                        alt="${escapeHTML(item.name)}"
                                    >

                                    <div>
                                        <h4>${escapeHTML(item.name)}</h4>
                                        <p>Quantity: ${Number(item.quantity)}</p>
                                        <strong>${formatPrice(item.price)}</strong>
                                    </div>

                                </div>
                            `).join("")}

                        </div>

                        <div class="order-card-footer">

                            <span>
                                ${order.items.length} product type(s)
                            </span>

                            <button
                                class="btn-secondary"
                                onclick="viewOrderDetails('${escapeHTML(order.id)}')"
                            >
                                View Details
                            </button>

                        </div>

                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

// View individual order details
function viewOrderDetails(orderId) {
    const order = getMyOrders().find(
        item => String(item.id) === String(orderId)
    );

    if (!order) {
        showToast("Order not found.", "error");
        return;
    }

    const container = document.getElementById("ordersContent");

    if (!container) return;

    container.innerHTML = `
        <div class="order-details-page">

            <button
                class="btn-secondary"
                onclick="displayOrders()"
            >
                ← Back to My Orders
            </button>

            <h2>Order Details</h2>

            <div class="order-details-card">

                <h3>${escapeHTML(order.id)}</h3>

                <p>
                    Placed on:
                    ${new Date(order.createdAt).toLocaleString("en-IN")}
                </p>

                <div class="order-info">

                    <div>
                        <span>Order Status</span>
                        <strong>${escapeHTML(order.status)}</strong>
                    </div>

                    <div>
                        <span>Payment Method</span>
                        <strong>${escapeHTML(order.paymentMethod)}</strong>
                    </div>

                    <div>
                        <span>Payment Status</span>
                        <strong>${escapeHTML(order.paymentStatus)}</strong>
                    </div>

                    <div>
                        <span>Total</span>
                        <strong>${formatPrice(order.total)}</strong>
                    </div>

                </div>

                <h3>Delivery Address</h3>

                <p>
                    ${escapeHTML(order.customerName)}<br>
                    ${escapeHTML(order.address.street)}<br>
                    ${escapeHTML(order.address.city)},
                    ${escapeHTML(order.address.state)} -
                    ${escapeHTML(order.address.pincode)}<br>
                    Phone: ${escapeHTML(order.phone)}
                </p>

                <h3>Products</h3>

                ${order.items.map(item => `
                    <div class="order-product">

                        <img
                            src="${escapeHTML(item.image)}"
                            alt="${escapeHTML(item.name)}"
                        >

                        <div>
                            <h4>${escapeHTML(item.name)}</h4>
                            <p>Quantity: ${Number(item.quantity)}</p>
                            <strong>
                                ${formatPrice(item.price * item.quantity)}
                            </strong>
                        </div>

                    </div>
                `).join("")}

                <hr>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(order.subtotal)}</strong>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <strong>${formatPrice(order.shipping)}</strong>
                </div>

                <div class="summary-row summary-total">
                    <span>Grand Total</span>
                    <strong>${formatPrice(order.total)}</strong>
                </div>

            </div>

        </div>
    `;
}

// Initialize orders
function initializeOrders() {
    displayOrders();
}
