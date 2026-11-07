
// SHOWCASE - CHECKOUT SYSTEM

const ORDER_STORAGE_KEY = "showcase_v2_orders";

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function escapeCheckoutText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Create checkout page
function createCheckoutSection() {
    let section = document.getElementById("checkout");

    if (!section) {
        section = document.createElement("section");
        section.id = "checkout";
        section.className = "page-section";
        document.querySelector("main")?.appendChild(section);
    }

    section.innerHTML = `
        <div class="section-heading">
            <span class="section-eyebrow">COMPLETE YOUR PURCHASE</span>
            <h2>Secure Checkout</h2>
            <p>Enter your delivery information and review your order.</p>
        </div>

        <div id="checkoutContent"></div>
    `;
}

// Display checkout
function displayCheckout() {
    const container = document.getElementById("checkoutContent");
    if (!container) return;

    const cart = typeof getCart === "function" ? getCart() : [];
    const products = getProducts();

    const items = cart.map(item => ({
        ...item,
        product: products.find(
            product => String(product.id) === String(item.productId)
        )
    })).filter(item => item.product);

    if (!items.length) {
        container.innerHTML = `
            <div class="checkout-empty">
                <h3>Your cart is empty</h3>
                <p>Add products before proceeding to checkout.</p>
                <button class="btn btn-primary"
                    onclick="showSection('products')">
                    Explore Products
                </button>
            </div>
        `;
        return;
    }

    const subtotal = items.reduce(
        (total, item) =>
            total + Number(item.product.price) * item.quantity,
        0
    );

    container.innerHTML = `
        <div class="checkout-layout">

            <form id="checkoutForm" class="checkout-form">

                <div class="checkout-card">
                    <h3>01. Contact Information</h3>

                    <div class="checkout-field-grid">
                        <div class="form-group">
                            <label for="checkoutName">Full Name *</label>
                            <input id="checkoutName" name="name"
                                type="text" maxlength="80"
                                autocomplete="name" required>
                        </div>

                        <div class="form-group">
                            <label for="checkoutEmail">Email Address *</label>
                            <input id="checkoutEmail" name="email"
                                type="email" maxlength="120"
                                autocomplete="email" required>
                        </div>

                        <div class="form-group">
                            <label for="checkoutPhone">Phone Number *</label>
                            <input id="checkoutPhone" name="phone"
                                type="tel" pattern="[0-9]{10}"
                                maxlength="10" inputmode="numeric"
                                autocomplete="tel" placeholder="10-digit mobile number"
                                required>
                        </div>
                    </div>
                </div>

                <div class="checkout-card">
                    <h3>02. Delivery Address</h3>

                    <div class="form-group">
                        <label for="checkoutAddress">House / Street Address *</label>
                        <textarea id="checkoutAddress" name="address"
                            rows="3" maxlength="300"
                            autocomplete="street-address" required></textarea>
                    </div>

                    <div class="checkout-field-grid">
                        <div class="form-group">
                            <label for="checkoutCity">City *</label>
                            <input id="checkoutCity" name="city"
                                type="text" maxlength="80"
                                autocomplete="address-level2" required>
                        </div>

                        <div class="form-group">
                            <label for="checkoutState">State *</label>
                            <select id="checkoutState" name="state" required>
                                <option value="">Select state</option>
                                <option>Andhra Pradesh</option>
                                <option>Arunachal Pradesh</option>
                                <option>Assam</option>
                                <option>Bihar</option>
                                <option>Chhattisgarh</option>
                                <option>Goa</option>
                                <option>Gujarat</option>
                                <option>Haryana</option>
                                <option>Himachal Pradesh</option>
                                <option>Jharkhand</option>
                                <option>Karnataka</option>
                                <option>Kerala</option>
                                <option>Madhya Pradesh</option>
                                <option>Maharashtra</option>
                                <option>Manipur</option>
                                <option>Meghalaya</option>
                                <option>Mizoram</option>
                                <option>Nagaland</option>
                                <option>Odisha</option>
                                <option>Punjab</option>
                                <option>Rajasthan</option>
                                <option>Sikkim</option>
                                <option>Tamil Nadu</option>
                                <option>Telangana</option>
                                <option>Tripura</option>
                                <option>Uttar Pradesh</option>
                                <option>Uttarakhand</option>
                                <option>West Bengal</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="checkoutPincode">PIN Code *</label>
                            <input id="checkoutPincode" name="pincode"
                                type="text" pattern="[0-9]{6}"
                                maxlength="6" inputmode="numeric"
                                autocomplete="postal-code" required>
                        </div>
                    </div>
                </div>

                <div class="checkout-card">
                    <h3>03. Payment Method</h3>

                    <label class="payment-option">
                        <input type="radio" name="payment"
                            value="Cash on Delivery" checked>
                        <span>💵 Cash on Delivery</span>
                    </label>

                    <label class="payment-option">
                        <input type="radio" name="payment"
                            value="UPI (Demo)">
                        <span>📱 UPI (Demo)</span>
                    </label>

                    <label class="payment-option">
                        <input type="radio" name="payment"
                            value="Card (Demo)">
                        <span>💳 Credit / Debit Card (Demo)</span>
                    </label>

                    <p class="payment-note">
                        Demo mode only. No real payment will be processed.
                    </p>
                </div>

                <button type="submit"
                    class="btn btn-primary place-order-button">
                    Place Demo Order
                </button>

                <p id="checkoutMessage" aria-live="polite"></p>

            </form>

            <aside class="checkout-order-summary">
                <h3>Your Order</h3>

                <div class="checkout-order-items">
                    ${items.map(item => `
                        <div class="checkout-order-item">
                            <img
                                src="${escapeCheckoutText(item.product.images?.[0] || "https://placehold.co/100x100?text=Product")}"
                                alt="${escapeCheckoutText(item.product.name)}">

                            <div>
                                <strong>${escapeCheckoutText(item.product.name)}</strong>
                                <p>Quantity: ${item.quantity}</p>
                            </div>

                            <strong>
                                ${formatPrice(Number(item.product.price) * item.quantity)}
                            </strong>
                        </div>
                    `).join("")}
                </div>

                <div class="checkout-total-line">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>

                <div class="checkout-total-line">
                    <span>Shipping</span>
                    <strong>FREE</strong>
                </div>

                <div class="checkout-grand-total">
                    <span>Total</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>
            </aside>

        </div>
    `;

    const currentUser = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    if (currentUser) {
        document.getElementById("checkoutName").value =
            currentUser.name || "";

        document.getElementById("checkoutEmail").value =
            currentUser.email || "";
    }

    document.getElementById("checkoutForm")
        .addEventListener("submit", placeDemoOrder);
}

// Place demo order
function placeDemoOrder(event) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const cart = getCart();
    const products = getProducts();

    const items = cart.map(item => {
        const product = products.find(
            product => String(product.id) === String(item.productId)
        );

        if (!product || product.stock_status !== "In Stock") {
            return null;
        }

        return {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: item.quantity
        };
    });

    if (!items.length || items.some(item => !item)) {
        alert("One or more products are unavailable. Please review your cart.");
        return;
    }

    const formData = new FormData(form);

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const order = {
        id: "SC" + Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            phone: formData.get("phone"),
            address: formData.get("address").trim(),
            city: formData.get("city").trim(),
            state: formData.get("state"),
            pincode: formData.get("pincode")
        },
        items,
        subtotal,
        total: subtotal,
        paymentMethod: formData.get("payment"),
        status: "Order Placed (Demo)"
    };

    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);

    saveCart([]);

    displayOrderConfirmation(order);
}

// Order confirmation
function displayOrderConfirmation(order) {
    const container = document.getElementById("checkoutContent");

    container.innerHTML = `
        <div class="order-confirmation">
            <div class="confirmation-icon">✓</div>

            <span class="section-eyebrow">ORDER CONFIRMED</span>

            <h2>Thank you for your order!</h2>

            <p>Your demo order has been successfully created.</p>

            <div class="confirmation-details">
                <p><strong>Order ID:</strong> ${escapeCheckoutText(order.id)}</p>
                <p><strong>Customer:</strong> ${escapeCheckoutText(order.customer.name)}</p>
                <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                <p><strong>Payment:</strong> ${escapeCheckoutText(order.paymentMethod)}</p>
                <p><strong>Status:</strong> ${escapeCheckoutText(order.status)}</p>
            </div>

            <button class="btn btn-primary"
                onclick="showSection('products')">
                Continue Shopping
            </button>
        </div>
    `;

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
}

// Initialize checkout
function initializeCheckout() {
    createCheckoutSection();
    displayCheckout();
}
