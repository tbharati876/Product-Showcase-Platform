
// ==========================================
// SHOWCASE MY ORDERS SYSTEM
// ==========================================

const ORDERS_STORAGE_KEY = "showcase_orders";

// Get all saved orders
function getOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
        );

        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Unable to load orders:", error);
        return [];
    }
}

// Save orders
function saveOrders(orders) {
    localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders)
    );
}

// Get orders belonging to logged-in customer
function getMyOrders() {
    const user = getCurrentUser();

    if (!user) return [];

    return getOrders()
        .filter(order => {
            const sameId =
                order.customerId != null &&
                String(order.customerId) === String(user.id);

            const sameEmail =
                order.customerEmail &&
                order.customerEmail.toLowerCase() ===
                user.email.toLowerCase();

            return sameId || sameEmail;
        })
        .sort((a, b) => {
            return new Date(b.date || b.createdAt || 0) -
                   new Date(a.date || a.createdAt || 0);
        });
}

// Format date
function formatOrderDate(dateValue) {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ==========================================
// DISPLAY MY ORDERS
// ==========================================

function displayOrders() {
    const container = document.getElementById("ordersContent");

    if (!container) return;

    const user = getCurrentUser();

    if (!user) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-lock"></i>
                <h3>Please Login First</h3>
                <p>Login to your account to view your orders.</p>

                <button class="btn btn-primary"
                    onclick="showSection('login')">
                    Login Now
                </button>
            </div>
        `;
        return;
    }

    const orders = getMyOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No Orders Yet</h3>
                <p>Hello ${escapeHTML(user.name)}, you haven't placed any orders yet.</p>

                <button class="btn btn-primary"
                    onclick="showSection('products')">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="orders-header">
            <div>
                <h3>Hello, ${escapeHTML(user.name)}!</h3>
                <p>You have placed ${orders.length} order${orders.length === 1 ? "" : "s"}.</p>
            </div>
        </div>

        <div class="orders-list">

            ${orders.map(order => {
                const items = Array.isArray(order.items) ? order.items : [];

                const itemCount = items.reduce(
                    (sum, item) => sum + Number(item.quantity || 1),
                    0
                );

                return `
                    <div class="order-card">

                        <div class="order-card-header">
                            <div>
                                <span class="order-label">ORDER ID</span>
                                <strong>${escapeHTML(order.id || "N/A")}</strong>
                            </div>

                            <span class="order-status">
                                ${escapeHTML(order.status || "Order Placed")}
                            </span>
                        </div>

                        <div class="order-card-info">

                            <div>
                                <span>Order Date</span>
                                <strong>${formatOrderDate(order.date || order.createdAt)}</strong>
                            </div>

                            <div>
                                <span>Items</span>
                                <strong>${itemCount} item(s)</strong>
                            </div>

                            <div>
                                <span>Payment</span>
                                <strong>${escapeHTML(order.paymentMethod || "Not specified")}</strong>
                            </div>

                            <div>
                                <span>Total Amount</span>
                                <strong>${formatPrice(Number(order.total || 0))}</strong>
                            </div>

                        </div>

                        <div class="order-product-preview">

                            ${items.map(item => `
                                <div class="order-product-item">

                                    ${item.image ? `
                                        <img
                                            src="${escapeHTML(item.image)}"
                                            alt="${escapeHTML(item.name || "Product")}"
                                            onerror="this.style.display='none'"
                                        >
                                    ` : ""}

                                    <div>
                                        <strong>${escapeHTML(item.name || "Product")}</strong>
                                        <span>Quantity: ${Number(item.quantity || 1)}</span>
                                    </div>

                                    <strong>
                                        ${formatPrice(
                                            Number(item.price || 0) *
                                            Number(item.quantity || 1)
                                        )}
                                    </strong>

                                </div>
                            `).join("")}

                        </div>

                        <div class="order-card-footer">
                            <button class="btn btn-primary"
                                onclick="viewOrderDetails('${escapeHTML(order.id)}')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>

                    </div>
                `;
            }).join("")}

        </div>
    `;
}

// ==========================================
// VIEW ORDER DETAILS
// ==========================================

function viewOrderDetails(orderId) {
    const order = getMyOrders().find(
        item => String(item.id) === String(orderId)
    );

    if (!order) {
        showToast("Order not found.", "error");
        return;
    }

    const items = Array.isArray(order.items) ? order.items : [];
    const address = order.address || {};

    const container = document.getElementById("ordersContent");

    if (!container) return;

    container.innerHTML = `
        <div class="order-detail-page">

            <button class="btn btn-outline order-back-button"
                onclick="displayOrders()">
                <i class="fas fa-arrow-left"></i>
                Back to My Orders
            </button>

            <div class="order-detail-card">

                <div class="order-detail-heading">
                    <div>
                        <span class="order-label">ORDER DETAILS</span>
                        <h3>${escapeHTML(order.id || "N/A")}</h3>
                    </div>

                    <span class="order-status">
                        ${escapeHTML(order.status || "Order Placed")}
                    </span>
                </div>

                <div class="order-detail-info">

                    <div>
                        <span>Order Date</span>
                        <strong>${formatOrderDate(order.date || order.createdAt)}</strong>
                    </div>

                    <div>
                        <span>Payment Method</span>
                        <strong>${escapeHTML(order.paymentMethod || "Not specified")}</strong>
                    </div>

                    <div>
                        <span>Payment Status</span>
                        <strong>${escapeHTML(order.paymentStatus || "Pending")}</strong>
                    </div>

                </div>

                <h3>Products Ordered</h3>

                <div class="order-detail-products">

                    ${items.map(item => `
                        <div class="order-detail-product">

                            ${item.image ? `
                                <img
                                    src="${escapeHTML(item.image)}"
                                    alt="${escapeHTML(item.name || "Product")}"
                                    onerror="this.style.display='none'"
                                >
                            ` : ""}

                            <div class="order-detail-product-info">
                                <strong>${escapeHTML(item.name || "Product")}</strong>
                                <span>Quantity: ${Number(item.quantity || 1)}</span>
                                <span>Unit Price: ${formatPrice(Number(item.price || 0))}</span>
                            </div>

                            <strong>
                                ${formatPrice(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                )}
                            </strong>

                        </div>
                    `).join("")}

                </div>

                <div class="order-total-breakdown">

                    <div>
                        <span>Subtotal</span>
                        <strong>${formatPrice(Number(order.subtotal || 0))}</strong>
                    </div>

                    <div>
                        <span>Shipping</span>
                        <strong>
                            ${Number(order.shipping || 0) === 0
                                ? "FREE"
                                : formatPrice(Number(order.shipping || 0))}
                        </strong>
                    </div>

                    <div class="order-grand-total">
                        <span>Total Payable</span>
                        <strong>${formatPrice(Number(order.total || 0))}</strong>
                    </div>

                </div>

                <h3>Delivery Address</h3>

                <div class="order-delivery-address">
                    <p><strong>${escapeHTML(address.name || order.customerName || "")}</strong></p>
                    <p>${escapeHTML(address.email || order.customerEmail || "")}</p>
                    <p>${escapeHTML(address.phone || "")}</p>
                    <p>${escapeHTML(address.address || "")}</p>
                    <p>
                        ${escapeHTML(address.city || "")},
                        ${escapeHTML(address.state || "")} -
                        ${escapeHTML(address.pincode || "")}
                    </p>
                </div>

            </div>
        </div>
    `;
}

// ==========================================
// INITIALIZE ORDERS
// ==========================================

function initializeOrders() {
    displayOrders();
}
