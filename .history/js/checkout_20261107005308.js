
// ==========================================
// SHOWCASE - COMPLETE CHECKOUT SYSTEM
// ==========================================

const CHECKOUT_STORAGE_KEY = "showcase_checkout";
const CHECKOUT_ORDERS_KEY = "showcase_orders";

// Get saved checkout details
function getCheckoutDetails() {
    try {
        return JSON.parse(
            localStorage.getItem(CHECKOUT_STORAGE_KEY)
        ) || {};
    } catch (error) {
        return {};
    }
}

// Save checkout details
function saveCheckoutDetails(details) {
    localStorage.setItem(
        CHECKOUT_STORAGE_KEY,
        JSON.stringify(details)
    );
}

// Escape HTML
function checkoutEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Format price
function checkoutPrice(value) {
    return typeof formatPrice === "function"
        ? formatPrice(Number(value) || 0)
        : "₹" + (Number(value) || 0).toLocaleString("en-IN");
}

// Get complete products from cart IDs
function getCheckoutProducts() {
    const cart = getCart();
    const products = getProducts();

    return cart.map(cartItem => {
        const product = products.find(
            item => Number(item.id) === Number(cartItem.id)
        );

        if (!product) return null;

        return {
            ...product,
            quantity: Number(cartItem.quantity) || 1,
            image: getProductImage(product)
        };
    }).filter(Boolean);
}

// Get saved value
function getSavedCheckoutValue(key, fallback = "") {
    const details = getCheckoutDetails();
    return details[key] || fallback;
}

// Display complete checkout page
function displayCheckout() {
    const container = document.getElementById("checkoutContent");

    if (!container) return;

    const products = getCheckoutProducts();

    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3>Your Cart is Empty</h3>
                <p>Add products to your cart before checkout.</p>
                <button class="btn-primary"
                    onclick="showSection('products')">
                    Explore Products
                </button>
            </div>
        `;
        return;
    }

    const subtotal = products.reduce(
        (total, item) =>
            total + Number(item.price) * item.quantity,
        0
    );

    // Keep shipping consistent with cart
    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    const user = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    const saved = getCheckoutDetails();

    const customerName = saved.name || user?.name || "";
    const customerEmail = saved.email || user?.email || "";

    container.innerHTML = `
        <div class="checkout-layout">

            <div class="checkout-form-container">

                <form id="checkoutForm" onsubmit="handlePlaceOrder(event)">

                    <div class="checkout-form-section">
                        <h3>
                            <i class="fas fa-user"></i>
                            Customer Information
                        </h3>

                        <div class="checkout-field">
                            <label for="checkoutName">Full Name</label>
                            <input
                                type="text"
                                id="checkoutName"
                                name="name"
                                value="${checkoutEscape(customerName)}"
                                placeholder="Enter your full name"
                                required
                            >
                        </div>

                        <div class="checkout-field">
                            <label for="checkoutEmail">Email Address</label>
                            <input
                                type="email"
                                id="checkoutEmail"
                                name="email"
                                value="${checkoutEscape(customerEmail)}"
                                placeholder="Enter your email"
                                required
                            >
                        </div>

                        <div class="checkout-field">
                            <label for="checkoutPhone">Phone Number</label>
                            <input
                                type="tel"
                                id="checkoutPhone"
                                name="phone"
                                value="${checkoutEscape(saved.phone)}"
                                placeholder="Enter your phone number"
                                required
                            >
                        </div>
                    </div>

                    <div class="checkout-form-section">
                        <h3>
                            <i class="fas fa-map-marker-alt"></i>
                            Delivery Address
                        </h3>

                        <div class="checkout-field">
                            <label for="checkoutAddress">Address</label>
                            <textarea
                                id="checkoutAddress"
                                name="address"
                                placeholder="House number, street, area"
                                required
                            >${checkoutEscape(saved.address)}</textarea>
                        </div>

                        <div class="checkout-field-row">
                            <div class="checkout-field">
                                <label for="checkoutCity">City</label>
                                <input
                                    type="text"
                                    id="checkoutCity"
                                    name="city"
                                    value="${checkoutEscape(saved.city)}"
                                    required
                                >
                            </div>

                            <div class="checkout-field">
                                <label for="checkoutState">State</label>
                                <input
                                    type="text"
                                    id="checkoutState"
                                    name="state"
                                    value="${checkoutEscape(saved.state)}"
                                    required
                                >
                            </div>
                        </div>

                        <div class="checkout-field">
                            <label for="checkoutPincode">PIN Code</label>
                            <input
                                type="text"
                                id="checkoutPincode"
                                name="pincode"
                                value="${checkoutEscape(saved.pincode)}"
                                pattern="[0-9]{6}"
                                maxlength="6"
                                placeholder="6-digit PIN code"
                                required
                            >
                        </div>
                    </div>

                    <div class="checkout-form-section">
                        <h3>
                            <i class="fas fa-credit-card"></i>
                            Payment Method
                        </h3>

                        <label class="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash on Delivery"
                                checked
                            >
                            <span>
                                <i class="fas fa-money-bill-wave"></i>
                                Cash on Delivery
                            </span>
                        </label>

                        <label class="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Online Payment"
                            >
                            <span>
                                <i class="fas fa-credit-card"></i>
                                Online Payment (Demo)
                            </span>
                        </label>
                    </div>

                    <button type="submit"
                        class="btn-primary place-order-btn">
                        Place Order
                        <i class="fas fa-arrow-right"></i>
                    </button>

                </form>
            </div>

            <div class="checkout-summary">

                <h3>Your Order</h3>

                <div class="checkout-summary-products">

                    ${products.map(product => `
                        <div class="checkout-summary-item">

                            <div class="checkout-summary-image">
                                <img
                                    src="${checkoutEscape(product.image)}"
                                    alt="${checkoutEscape(product.name)}"
                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                >
                                <i class="fas fa-image"
                                   style="display:none;"></i>
                            </div>

                            <div class="checkout-summary-info">
                                <h4>${checkoutEscape(product.name)}</h4>
                                <p>Quantity: ${product.quantity}</p>
                                <p>${checkoutPrice(product.price)}</p>
                            </div>

                            <strong>
                                ${checkoutPrice(
                                    Number(product.price) * product.quantity
                                )}
                            </strong>

                        </div>
                    `).join("")}

                </div>

                <div class="checkout-summary-row">
                    <span>Subtotal</span>
                    <strong>${checkoutPrice(subtotal)}</strong>
                </div>

                <div class="checkout-summary-row">
                    <span>Shipping</span>
                    <strong>
                        ${shipping === 0 ? "FREE" : checkoutPrice(shipping)}
                    </strong>
                </div>

                <div class="checkout-summary-total">
                    <span>Total</span>
                    <strong>${checkoutPrice(total)}</strong>
                </div>

            </div>

        </div>
    `;
}

// Create complete product snapshot for order
function createOrderProductSnapshot(product) {
    return {
        ...JSON.parse(JSON.stringify(product)),
        id: product.id,
        name: product.name,
        description: product.description || "",
        brand: product.brand || "",
        category: product.category || "",
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 1,

        // Save the exact image used by the cart
        image: getProductImage(product),

        images: Array.isArray(product.images)
            ? [...product.images]
            : [],

        features: Array.isArray(product.features)
            ? [...product.features]
            : product.features || [],

        specifications: product.specifications
            ? { ...product.specifications }
            : {},

        tags: Array.isArray(product.tags)
            ? [...product.tags]
            : []
    };
}

// Place order
function handlePlaceOrder(event) {
    if (event) event.preventDefault();

    const user = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    if (!user) {
        showToast("Please login before placing an order.", "error");
        showSection("login");
        return;
    }

    const products = getCheckoutProducts();

    if (products.length === 0) {
        showToast("Your cart is empty.", "error");
        showSection("cart");
        return;
    }

    const form = document.getElementById("checkoutForm");

    if (!form || !form.reportValidity()) {
        return;
    }

    const name = document.getElementById("checkoutName").value.trim();
    const email = document.getElementById("checkoutEmail").value.trim();
    const phone = document.getElementById("checkoutPhone").value.trim();
    const address = document.getElementById("checkoutAddress").value.trim();
    const city = document.getElementById("checkoutCity").value.trim();
    const state = document.getElementById("checkoutState").value.trim();
    const pincode = document.getElementById("checkoutPincode").value.trim();

    const paymentElement = document.querySelector(
        'input[name="paymentMethod"]:checked'
    );

    const paymentMethod = paymentElement
        ? paymentElement.value
        : "Cash on Delivery";

    const subtotal = products.reduce(
        (total, item) =>
            total + Number(item.price) * item.quantity,
        0
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    const order = {
        id: "SC" + Date.now(),

        customerId: user.id || user.email,
        customerName: name,
        customerEmail: email,

        items: products.map(createOrderProductSnapshot),

        address: {
            name,
            email,
            phone,
            address,
            city,
            state,
            pincode
        },

        subtotal,
        shipping,
        total,

        paymentMethod,

        paymentStatus:
            paymentMethod === "Cash on Delivery"
                ? "Pending"
                : "Demo Payment",

        status: "Order Placed",
        date: new Date().toISOString(),
        createdAt: Date.now()
    };

    try {
        let orders = [];

        try {
            orders = JSON.parse(
                localStorage.getItem(CHECKOUT_ORDERS_KEY)
            ) || [];
        } catch (error) {
            orders = [];
        }

        if (!Array.isArray(orders)) {
            orders = [];
        }

        orders.push(order);

        // Save order first
        localStorage.setItem(
            CHECKOUT_ORDERS_KEY,
            JSON.stringify(orders)
        );

        // Save delivery details
        saveCheckoutDetails({
            name,
            email,
            phone,
            address,
            city,
            state,
            pincode
        });

        // Clear cart only after order is saved
        clearCart(true);

        showToast(
            "Your order has been placed successfully!",
            "success"
        );

        // Open My Orders
        showSection("orders");

    } catch (error) {
        console.error("Order placement error:", error);

        showToast(
            "Unable to place your order. Please try again.",
            "error"
        );
    }
}

// Initialize checkout
function initializeCheckout() {
    displayCheckout();
}
