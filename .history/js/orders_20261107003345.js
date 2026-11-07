
// ==========================================
// SHOWCASE - MY ORDERS SYSTEM
// ==========================================

const ORDERS_STORAGE_KEY = "showcase_orders";

// Get all saved orders
function getOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(ORDERS_STORAGE_KEY)
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

// Escape HTML safely
function ordersEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

// Format price
function ordersFormatPrice(price) {
    const amount = Number(price) || 0;

    if (typeof formatPrice === "function") {
        return formatPrice(amount);
    }

    return "₹" + amount.toLocaleString("en-IN");
}

// Format date
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

// Get current user's orders
function getMyOrders() {
    const user = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    if (!user) return [];

    const userEmail = String(user.email || "").toLowerCase();
    const userId = String(user.id || "");

    return getOrders()
        .filter(order => {
            const orderEmail = String(
                order.customerEmail || ""
            ).toLowerCase();

            const orderCustomerId = String(
                order.customerId || ""
            );

            return (
                (userEmail && orderEmail === userEmail) ||
                (userId && orderCustomerId === userId) ||
                (userEmail && orderCustomerId.toLowerCase() === userEmail)
            );
        })
        .sort((a, b) => {
            const dateA = Number(a.createdAt) ||
                new Date(a.date || 0).getTime();

            const dateB = Number(b.createdAt) ||
                new Date(b.date || 0).getTime();

            return dateB - dateA;
        });
}

// Find orders page content container
function getOrdersContainer() {
    return (
        document.getElementById("ordersContent") ||
        document.getElementById("ordersContainer") ||
        document.getElementById("ordersList") ||
        document.querySelector("#orders .content-section")
    );
}

// Get product image
function getOrderItemImage(item) {
    return (
        item.image ||
        (Array.isArray(item.images) ? item.images[0] : "") ||
        item.thumbnail ||
        item.productImage ||
        ""
    );
}

// Display product inside order
function renderOrderProduct(item) {
    const image = getOrderItemImage(item);
    const name = item.name || item.title || "Product";
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;

    return `
        <div class="order-product-item">
            <div class="order-product-image">
                ${
                    image
                        ? `<img src="${ordersEscape(image)}"
                               alt="${ordersEscape(name)}"
                               onerror="this.style.display='none'">`
                        : `<i class="fas fa-box-open"></i>`
                }
            </div>

            <div class="order-product-info">
                <h4>${ordersEscape(name)}</h4>

                ${
                    item.brand
                        ? `<p>Brand: ${ordersEscape(item.brand)}</p>`
                        : ""
                }

                ${
                    item.category
                        ? `<p>Category: ${ordersEscape(item.category)}</p>`
                        : ""
                }

                <p>
                    Price: ${ordersFormatPrice(price)}
                    &nbsp; × &nbsp;
                    Quantity: ${quantity}
                </p>

                ${
                    item.description
                        ? `<p class="order-product-description">
                            ${ordersEscape(item.description)}
                           </p>`
                        : ""
                }
            </div>

            <div class="order-product-total">
                ${ordersFormatPrice(price * quantity)}
            </div>
        </div>
    `;
}

// Display all orders
function displayOrders() {
    const container = getOrdersContainer();

    if (!container) {
        console.error("My Orders content container was not found.");
        return;
    }

    const user = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    if (!user) {
        container.innerHTML = `
            <div class="orders-empty-state">
                <i class="fas fa-user-lock"></i>
                <h2>Please Login First</h2>
                <p>Login to view your orders and delivery details.</p>
                <button class="btn btn-primary"
                    onclick="showSection('login')">
                    Login
                </button>
            </div>
        `;
        return;
    }

    const orders = getMyOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="orders-empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h2>No Orders Yet</h2>
                <p>Your purchased products will appear here.</p>
                <button class="btn btn-primary"
                    onclick="showSection('products')">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="my-orders-wrapper">
            <div class="orders-heading">
                <h2>My Orders</h2>
                <p>View your purchased products and track your orders.</p>
            </div>

            <div class="orders-list">
                ${orders.map(order => {
                    const items = Array.isArray(order.items)
                        ? order.items
                        : [];

                    const status = order.status || "Order Placed";

                    const canCancel = ![
                        "cancelled",
                        "delivered",
                        "completed",
                        "shipped"
                    ].includes(status.toLowerCase());

                    const itemCount = items.reduce(
                        (total, item) =>
                            total + (Number(item.quantity) || 1),
                        0
                    );

                    return `
                        <article class="order-card">
                            <div class="order-card-header">
                                <div>
                                    <span class="order-label">
                                        ORDER ID
                                    </span>
                                    <h3>${ordersEscape(order.id)}</h3>
                                    <p>${formatOrderDate(
                                        order.date || order.createdAt
                                    )}</p>
                                </div>

                                <span class="order-status status-${ordersEscape(
                                    status.toLowerCase().replace(/\s+/g, "-")
                                )}">
                                    ${ordersEscape(status)}
                                </span>
                            </div>

                            <div class="order-card-summary">
                                <span>
                                    <i class="fas fa-box"></i>
                                    ${itemCount} item(s)
                                </span>

                                <span>
                                    <i class="fas fa-credit-card"></i>
                                    ${ordersEscape(
                                        order.paymentMethod || "Not specified"
                                    )}
                                </span>

                                <strong>
                                    ${ordersFormatPrice(order.total)}
                                </strong>
                            </div>

                            <div class="order-products-preview">
                                ${items.map(renderOrderProduct).join("")}
                            </div>

                            <div class="order-card-actions">
                                <button
                                    class="btn btn-primary"
                                    onclick="viewOrderDetails('${ordersEscape(order.id)}')">
                                    <i class="fas fa-eye"></i>
                                    View Order Details
                                </button>

                                ${
                                    canCancel
                                        ? `<button
                                            class="btn btn-danger"
                                            onclick="cancelOrder('${ordersEscape(order.id)}')">
                                            <i class="fas fa-times-circle"></i>
                                            Cancel Order
                                           </button>`
                                        : ""
                                }
                            </div>
                        </article>
                    `;
                }).join("")}
            </div>
        </div>
    `;
}

// View complete order details
function viewOrderDetails(orderId) {
    const container = getOrdersContainer();

    if (!container) return;

    const order = getMyOrders().find(
        item => String(item.id) === String(orderId)
    );

    if (!order) {
        showToast("Order not found.", "error");
        return;
    }

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    const address = order.address || {};

    container.innerHTML = `
        <div class="order-details-page">

            <button class="btn btn-secondary order-back-button"
                onclick="displayOrders()">
                <i class="fas fa-arrow-left"></i>
                Back to My Orders
            </button>

            <div class="order-details-heading">
                <h2>Order Details</h2>
                <p>Order ID: ${ordersEscape(order.id)}</p>
                <span class="order-status">
                    ${ordersEscape(order.status || "Order Placed")}
                </span>
            </div>

            <div class="order-details-card">
                <h3>
                    <i class="fas fa-shopping-bag"></i>
                    Purchased Products
                </h3>

                <div class="order-products-preview">
                    ${items.map(renderOrderProduct).join("")}
                </div>
            </div>

            <div class="order-details-grid">

                <div class="order-details-card">
                    <h3>
                        <i class="fas fa-truck"></i>
                        Delivery Details
                    </h3>

                    <p><strong>Name:</strong>
                        ${ordersEscape(
                            address.name || order.customerName || "N/A"
                        )}
                    </p>

                    <p><strong>Email:</strong>
                        ${ordersEscape(
                            address.email || order.customerEmail || "N/A"
                        )}
                    </p>

                    <p><strong>Phone:</strong>
                        ${ordersEscape(address.phone || "N/A")}
                    </p>

                    <p><strong>Address:</strong>
                        ${ordersEscape(address.address || "N/A")}
                    </p>

                    <p><strong>City:</strong>
                        ${ordersEscape(address.city || "N/A")}
                    </p>

                    <p><strong>State:</strong>
                        ${ordersEscape(address.state || "N/A")}
                    </p>

                    <p><strong>PIN Code:</strong>
                        ${ordersEscape(address.pincode || "N/A")}
                    </p>
                </div>

                <div class="order-details-card">
                    <h3>
                        <i class="fas fa-receipt"></i>
                        Payment Summary
                    </h3>

                    <p>
                        <span>Subtotal</span>
                        <strong>${ordersFormatPrice(order.subtotal)}</strong>
                    </p>

                    <p>
                        <span>Shipping</span>
                        <strong>${ordersFormatPrice(order.shipping)}</strong>
                    </p>

                    <p>
                        <span>Payment Method</span>
                        <strong>${ordersEscape(
                            order.paymentMethod || "N/A"
                        )}</strong>
                    </p>

                    <p>
                        <span>Payment Status</span>
                        <strong>${ordersEscape(
                            order.paymentStatus || "Pending"
                        )}</strong>
                    </p>

                    <hr>

                    <p class="order-grand-total">
                        <span>Total Amount</span>
                        <strong>${ordersFormatPrice(order.total)}</strong>
                    </p>
                </div>
            </div>

            <div class="order-details-card">
                <h3>
                    <i class="fas fa-calendar-alt"></i>
                    Order Information
                </h3>

                <p><strong>Order Date:</strong>
                    ${formatOrderDate(order.date || order.createdAt)}
                </p>

                <p><strong>Order Status:</strong>
                    ${ordersEscape(order.status || "Order Placed")}
                </p>

                ${
                    order.cancelledAt
                        ? `<p><strong>Cancelled On:</strong>
                            ${formatOrderDate(order.cancelledAt)}</p>`
                        : ""
                }
            </div>

            ${
                ![
                    "cancelled",
                    "delivered",
                    "completed",
                    "shipped"
                ].includes(
                    String(order.status || "").toLowerCase()
                )
                    ? `<button class="btn btn-danger"
                        onclick="cancelOrder('${ordersEscape(order.id)}')">
                        <i class="fas fa-times-circle"></i>
                        Cancel Order
                       </button>`
                    : ""
            }
        </div>
    `;
}

// Cancel an order
function cancelOrder(orderId) {
    const order = getMyOrders().find(
        item => String(item.id) === String(orderId)
    );

    if (!order) {
        showToast("Order not found.", "error");
        return;
    }

    const status = String(order.status || "").toLowerCase();

    if ([
        "cancelled",
        "delivered",
        "completed",
        "shipped"
    ].includes(status)) {
        showToast(
            "This order can no longer be cancelled.",
            "error"
        );
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to cancel order ${order.id}?`
    );

    if (!confirmed) return;

    const orders = getOrders();

    const updatedOrders = orders.map(item => {
        if (String(item.id) === String(orderId)) {
            return {
                ...item,
                status: "Cancelled",
                cancelledAt: new Date().toISOString()
            };
        }

        return item;
    });

    saveOrders(updatedOrders);

    showToast("Your order has been cancelled.", "success");

    displayOrders();
}

// Initialize orders
function initializeOrders() {
    displayOrders();
}
