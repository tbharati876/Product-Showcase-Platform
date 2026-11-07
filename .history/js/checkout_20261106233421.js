
const CHECKOUT_STORAGE_KEY = "showcase_checkout";

// Get checkout details
function getCheckoutDetails() {
    return getStoredData(CHECKOUT_STORAGE_KEY, {});
}

// Display checkout page
function displayCheckout() {
    const container = document.getElementById("checkoutContent");

    if (!container) return;

    const cart = getCart();
    const products = getProducts();

    const cartProducts = cart.map(item => {
        const product = products.find(
            p => Number(p.id) === Number(item.id)
        );

        return product ? {
            ...product,
            quantity: Number(item.quantity)
        } : null;
    }).filter(Boolean);

    if (cartProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nothing to Checkout</h3>
                <p>Please add products to your cart first.</p>

                <button
                    class="btn-primary"
                    onclick="showSection('products')"
                >
                    Explore Products
                </button>
            </div>
        `;
        return;
    }

    const user = getCurrentUser();

    const subtotal = cartProducts.reduce(
        (total, product) =>
            total + Number(product.price) * product.quantity,
        0
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    container.innerHTML = `
        <div class="checkout-layout">

            <div class="checkout-form-section">

                <h2>Checkout</h2>
                <p>Complete your details to place your order.</p>

                <form id="checkoutForm">

                    <h3>1. Contact Information</h3>

                    <div class="form-grid">

                        <div class="form-group">
                            <label for="checkoutName">Full Name</label>
                            <input
                                type="text"
                                id="checkoutName"
                                value="${user ? escapeHTML(user.name) : ""}"
                                placeholder="Enter your full name"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="checkoutEmail">Email Address</label>
                            <input
                                type="email"
                                id="checkoutEmail"
                                value="${user ? escapeHTML(user.email) : ""}"
                                placeholder="Enter your email"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="checkoutPhone">Phone Number</label>
                            <input
                                type="tel"
                                id="checkoutPhone"
                                placeholder="Enter your phone number"
                                pattern="[0-9]{10}"
                                maxlength="10"
                                required
                            >
                        </div>

                    </div>

                    <h3>2. Delivery Address</h3>

                    <div class="form-group">
                        <label for="checkoutAddress">Street Address</label>
                        <textarea
                            id="checkoutAddress"
                            rows="3"
                            placeholder="House number, street, area"
                            required
                        ></textarea>
                    </div>

                    <div class="form-grid">

                        <div class="form-group">
                            <label for="checkoutCity">City</label>
                            <input
                                type="text"
                                id="checkoutCity"
                                placeholder="City"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="checkoutState">State</label>
                            <input
                                type="text"
                                id="checkoutState"
                                placeholder="State"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="checkoutPincode">PIN Code</label>
                            <input
                                type="text"
                                id="checkoutPincode"
                                placeholder="6-digit PIN code"
                                pattern="[0-9]{6}"
                                maxlength="6"
                                required
                            >
                        </div>

                    </div>

                    <h3>3. Payment Method</h3>

                    <div class="payment-options">

                        <label class="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash on Delivery"
                                checked
                            >
                            <span>
                                <strong>Cash on Delivery</strong>
                                <small>Pay when your order arrives.</small>
                            </span>
                        </label>

                        <label class="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                            >
                            <span>
                                <strong>UPI</strong>
                                <small>Demo payment selection only.</small>
                            </span>
                        </label>

                        <label class="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Card"
                            >
                            <span>
                                <strong>Credit / Debit Card</strong>
                                <small>Demo payment selection only.</small>
                            </span>
                        </label>

                    </div>

                    <p class="payment-note">
                        This is a demonstration checkout. No real payment
                        will be processed.
                    </p>

                    <button
                        type="submit"
                        class="btn-primary place-order-btn"
                    >
                        Place Order - ${formatPrice(total)}
                    </button>

                </form>

            </div>

            <div class="checkout-summary">

                <h3>Your Order</h3>

                ${cartProducts.map(product => `
                    <div class="checkout-product">

                        <img
                            src="${escapeHTML(getProductImage(product))}"
                            alt="${escapeHTML(product.name)}"
                        >

                        <div>
                            <h4>${escapeHTML(product.name)}</h4>
                            <p>Quantity: ${product.quantity}</p>
                        </div>

                        <strong>
                            ${formatPrice(product.price * product.quantity)}
                        </strong>

                    </div>
                `).join("")}

                <hr>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <strong>${shipping === 0 ? "FREE" : formatPrice(shipping)}</strong>
                </div>

                <hr>

                <div class="summary-row summary-total">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

            </div>

        </div>
    `;

    document.getElementById("checkoutForm")
        .addEventListener("submit", handlePlaceOrder);
}

// Handle order placement
function handlePlaceOrder(event) {
    event.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
        showToast("Your cart is empty.", "error");
        return;
    }

    const products = getProducts();

    const cartProducts = cart.map(item => {
        const product = products.find(
            p => Number(p.id) === Number(item.id)
        );

        return product ? {
            ...product,
            quantity: Number(item.quantity)
        } : null;
    }).filter(Boolean);

    if (cartProducts.length !== cart.length) {
        showToast("Some products are no longer available.", "error");
        return;
    }

    const outOfStock = cartProducts.find(
        product => product.stock_status === "Out of Stock"
    );

    if (outOfStock) {
        showToast(outOfStock.name + " is out of stock.", "error");
        return;
    }

    const name = document.getElementById("checkoutName").value.trim();
    const email = document.getElementById("checkoutEmail").value.trim();
    const phone = document.getElementById("checkoutPhone").value.trim();
    const address = document.getElementById("checkoutAddress").value.trim();
    const city = document.getElementById("checkoutCity").value.trim();
    const state = document.getElementById("checkoutState").value.trim();
    const pincode = document.getElementById("checkoutPincode").value.trim();

    const paymentMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
    )?.value || "Cash on Delivery";

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
        showToast("Please complete all delivery details.", "error");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        showToast("Enter a valid 10-digit phone number.", "error");
        return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
        showToast("Enter a valid 6-digit PIN code.", "error");
        return;
    }

    const subtotal = cartProducts.reduce(
        (total, product) =>
            total + Number(product.price) * product.quantity,
        0
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    const order = {
        id: "SC" + Date.now(),
        customerId: getCurrentUser()?.id || null,
        customerName: name,
        email,
        phone,
        address: {
            street: address,
            city,
            state,
            pincode
        },
        items: cartProducts.map(product => ({
            id: product.id,
            name: product.name,
            image: getProductImage(product),
            price: Number(product.price),
            quantity: product.quantity
        })),
        subtotal,
        shipping,
        total,
        paymentMethod,
        paymentStatus: "Pending",
        status: "Order Placed",
        createdAt: new Date().toISOString()
    };

    const orders = getStoredData("showcase_orders", []);

    orders.unshift(order);

    saveStoredData("showcase_orders", orders);

    // Empty the cart after successful order creation
    saveCart([]);

    showOrderConfirmation(order);
}

// Show successful order confirmation
function showOrderConfirmation(order) {
    const container = document.getElementById("checkoutContent");

    if (!container) return;

    container.innerHTML = `
        <div class="order-success">

            <div class="success-icon">✓</div>

            <h2>Order Placed Successfully!</h2>

            <p>
                Thank you, ${escapeHTML(order.customerName)}.
                Your order has been placed.
            </p>

            <div class="order-confirmation-card">

                <p>Order ID</p>
                <h3>${escapeHTML(order.id)}</h3>

                <div class="summary-row">
                    <span>Order Total</span>
                    <strong>${formatPrice(order.total)}</strong>
                </div>

                <div class="summary-row">
                    <span>Payment Method</span>
                    <strong>${escapeHTML(order.paymentMethod)}</strong>
                </div>

                <div class="summary-row">
                    <span>Order Status</span>
                    <strong>${escapeHTML(order.status)}</strong>
                </div>

            </div>

            <button
                class="btn-primary"
                onclick="showSection('orders'); displayOrders();"
            >
                View My Orders
            </button>

            <button
                class="btn-secondary"
                onclick="showSection('products')"
            >
                Continue Shopping
            </button>

        </div>
    `;

    updateCartCount();

    if (typeof displayOrders === "function") {
        displayOrders();
    }

    showToast("Your order has been placed!", "success");
}

// Initialize checkout
function initializeCheckout() {
    displayCheckout();
}
