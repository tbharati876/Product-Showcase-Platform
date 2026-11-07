// ==========================================
// SHOWCASE - COMPLETE CHECKOUT SYSTEM
// ==========================================

const CHECKOUT_KEY = "showcase_checkout";
const ORDERS_KEY = "showcase_orders";

// Get saved checkout details
function getCheckoutDetails() {
    return getStoredData(CHECKOUT_STORAGE_KEY, {});
}

// Save checkout details
function saveCheckoutDetails(details) {
    saveStoredData(CHECKOUT_STORAGE_KEY, details);
}

// Get complete products for checkout
function getCheckoutProducts() {
    return getCartProducts().map(product => ({
        ...product,
        image: getProductImage(product)
    }));
}

// Display checkout page
function displayCheckout() {
    const container = document.getElementById("checkoutContent");

    if (!container) return;

    const products = getCheckoutProducts();

    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Your Cart Is Empty</h3>
                <p>Add products before proceeding to checkout.</p>
                <button class="btn btn-primary" onclick="showSection('products')">
                    Discover Products
                </button>
            </div>
        `;
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Login Required</h3>
                <p>Please login or create an account before placing your order.</p>
                <button class="btn btn-primary" onclick="showSection('login')">
                    Login
                </button>
                <button class="btn btn-secondary" onclick="showSection('register')">
                    Create Account
                </button>
            </div>
        `;
        return;
    }

    const subtotal = products.reduce(
        (sum, product) => sum + Number(product.price || 0) * product.quantity,
        0
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;
    const saved = getCheckoutDetails();

    container.innerHTML = `
        <div class="checkout-layout">

            <form
                id="checkoutForm"
                class="checkout-form"
                onsubmit="placeOrder(event)"
            >
                <section class="checkout-section">
                    <h3>Delivery Information</h3>

                    <div class="form-group">
                        <label for="checkoutName">Full Name</label>
                        <input
                            type="text"
                            id="checkoutName"
                            name="name"
                            value="${escapeHTML(saved.name || currentUser.name || "")}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="checkoutEmail">Email Address</label>
                        <input
                            type="email"
                            id="checkoutEmail"
                            name="email"
                            value="${escapeHTML(saved.email || currentUser.email || "")}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="checkoutPhone">Phone Number</label>
                        <input
                            type="tel"
                            id="checkoutPhone"
                            name="phone"
                            value="${escapeHTML(saved.phone || currentUser.phone || "")}"
                            pattern="[0-9+() -]{7,20}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="checkoutAddress">Full Address</label>
                        <textarea
                            id="checkoutAddress"
                            name="address"
                            rows="3"
                            required
                        >${escapeHTML(saved.address || "")}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="checkoutCity">City</label>
                        <input
                            type="text"
                            id="checkoutCity"
                            name="city"
                            value="${escapeHTML(saved.city || "")}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="checkoutState">State</label>
                        <input
                            type="text"
                            id="checkoutState"
                            name="state"
                            value="${escapeHTML(saved.state || "")}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="checkoutPincode">PIN Code</label>
                        <input
                            type="text"
                            id="checkoutPincode"
                            name="pincode"
                            value="${escapeHTML(saved.pincode || "")}"
                            pattern="[0-9]{6}"
                            maxlength="6"
                            required
                        >
                    </div>
                </section>

                <section class="checkout-section">
                    <h3>Payment Method</h3>

                    <label class="payment-option">
                        <input
                            type="radio"
                            name="payment"
                            value="Cash on Delivery"
                            ${saved.payment !== "Demo Online Payment" ? "checked" : ""}
                            required
                        >
                        Cash on Delivery
                    </label>

                    <label class="payment-option">
                        <input
                            type="radio"
                            name="payment"
                            value="Demo Online Payment"
                            ${saved.payment === "Demo Online Payment" ? "checked" : ""}
                        >
                        Demo Online Payment (Simulation)
                    </label>

                    <p class="payment-note">
                        Online payment is a demonstration only. No real payment
                        will be processed.
                    </p>
                </section>

                <button type="submit" class="btn btn-primary btn-block">
                    Place Order
                </button>
            </form>

            <aside class="checkout-summary">
                <h3>Your Order</h3>

                <div class="checkout-products">
                    ${products.map(product => `
                        <div class="checkout-product">
                            <img
                                src="${escapeHTML(product.image)}"
                                alt="${escapeHTML(product.name)}"
                                onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=Product';"
                            >

                            <div>
                                <strong>${escapeHTML(product.name)}</strong>
                                <p>Quantity: ${product.quantity}</p>
                                <span>${formatPrice(
                                    Number(product.price) * product.quantity
                                )}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <strong>${shipping === 0 ? "FREE" : formatPrice(shipping)}</strong>
                </div>

                <div class="summary-row total-row">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                <button
                    type="button"
                    class="btn btn-secondary btn-block"
                    onclick="showSection('cart')"
                >
                    Back to Cart
                </button>
            </aside>

        </div>
    `;
}

// Place order
function placeOrder(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        showToast("Please login before placing an order.", "warning");
        showSection("login");
        return;
    }

    const form = event.target;

    if (!form.reportValidity()) return;

    const products = getCheckoutProducts();

    if (products.length === 0) {
        showToast("Your cart is empty.", "warning");
        showSection("cart");
        return;
    }

    const formData = new FormData(form);

    const deliveryDetails = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim().toLowerCase(),
        phone: String(formData.get("phone") || "").trim(),
        address: String(formData.get("address") || "").trim(),
        city: String(formData.get("city") || "").trim(),
        state: String(formData.get("state") || "").trim(),
        pincode: String(formData.get("pincode") || "").trim(),
        payment: String(formData.get("payment") || "Cash on Delivery")
    };

    if (Object.values(deliveryDetails).some(value => !value)) {
        showToast("Please complete all delivery and payment details.", "warning");
        return;
    }

    saveCheckoutDetails(deliveryDetails);

    const subtotal = products.reduce(
        (sum, product) => sum + Number(product.price || 0) * product.quantity,
        0
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    const orderItems = products.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand || "",
        category: product.category || "",
        description: product.description || "",
        price: Number(product.price || 0),
        quantity: product.quantity,
        image: getProductImage(product),
        images: Array.isArray(product.images) ? [...product.images] : [],
        features: Array.isArray(product.features) ? [...product.features] : [],
        specifications: product.specifications || {},
        rating: Number(product.rating || 0)
    }));

    const order = {
        id: generateId(),
        orderNumber: "SC" + Date.now(),
        userId: currentUser.id,
        userEmail: currentUser.email,
        customerName: deliveryDetails.name,
        customerEmail: deliveryDetails.email,
        customerPhone: deliveryDetails.phone,
        deliveryAddress: {
            name: deliveryDetails.name,
            phone: deliveryDetails.phone,
            address: deliveryDetails.address,
            city: deliveryDetails.city,
            state: deliveryDetails.state,
            pincode: deliveryDetails.pincode
        },
        paymentMethod: deliveryDetails.payment,
        items: orderItems,
        subtotal,
        shipping,
        total,
        status: "Placed",
        createdAt: new Date().toISOString()
    };

    const orders = getStoredData(ORDERS_STORAGE_KEY, []);
    orders.unshift(order);

    saveStoredData(ORDERS_STORAGE_KEY, orders);

    clearCart(true);

    showToast("Your order has been placed successfully!", "success");

    showSection("orders");
}

// Initialize checkout
function initializeCheckout() {
    displayCheckout();
}