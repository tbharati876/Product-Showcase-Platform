
// ==========================================
// SHOWCASE CHECKOUT SYSTEM
// ==========================================

const CHECKOUT_STORAGE_KEY = "showcase_checkout";
const ORDERS_STORAGE_KEY = "showcase_orders";

// Get checkout details
function getCheckoutDetails() {
    try {
        return JSON.parse(localStorage.getItem(CHECKOUT_STORAGE_KEY)) || {};
    } catch (error) {
        return {};
    }
}

// Save checkout details
function saveCheckoutDetails(details) {
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(details));
}

// ==========================================
// DISPLAY CHECKOUT
// ==========================================

function displayCheckout() {
    const container = document.getElementById("checkoutContent");
    if (!container) return;

    const cart = getCart();

    if (!cart.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Your cart is empty</h3>
                <p>Add products before proceeding to checkout.</p>
                <button class="btn btn-primary" onclick="showSection('products')">
                    Continue Shopping
                </button>
            </div>
        `;
        return;
    }

    const user = getCurrentUser();
    const saved = getCheckoutDetails();

    const subtotal = getCartSubtotal();
    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    container.innerHTML = `
        <div class="checkout-layout">
            <div class="checkout-form-wrapper">

                <h3><i class="fas fa-truck"></i> Delivery Information</h3>

                ${!user ? `
                    <div class="checkout-login-notice">
                        <p>
                            Please
                            <a href="#login" onclick="showSection('login'); return false;">login</a>
                            before placing your order.
                        </p>
                    </div>
                ` : `
                    <p class="checkout-user-info">
                        Ordering as <strong>${escapeHTML(user.name)}</strong>
                        (${escapeHTML(user.email)})
                    </p>
                `}

                <form id="checkoutForm" class="checkout-form">

                    <div class="form-group">
                        <label for="checkoutName">Full Name</label>
                        <input type="text" id="checkoutName"
                            value="${escapeHTML(saved.name || (user ? user.name : ""))}"
                            placeholder="Enter your full name" required>
                    </div>

                    <div class="form-group">
                        <label for="checkoutEmail">Email Address</label>
                        <input type="email" id="checkoutEmail"
                            value="${escapeHTML(saved.email || (user ? user.email : ""))}"
                            placeholder="Enter your email" required>
                    </div>

                    <div class="form-group">
                        <label for="checkoutPhone">Phone Number</label>
                        <input type="tel" id="checkoutPhone"
                            value="${escapeHTML(saved.phone || "")}"
                            placeholder="Enter your phone number"
                            pattern="[0-9+ -]{10,15}" required>
                    </div>

                    <div class="form-group">
                        <label for="checkoutAddress">Delivery Address</label>
                        <textarea id="checkoutAddress"
                            placeholder="House number, street, area"
                            rows="3" required>${escapeHTML(saved.address || "")}</textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="checkoutCity">City</label>
                            <input type="text" id="checkoutCity"
                                value="${escapeHTML(saved.city || "")}"
                                placeholder="City" required>
                        </div>

                        <div class="form-group">
                            <label for="checkoutState">State</label>
                            <input type="text" id="checkoutState"
                                value="${escapeHTML(saved.state || "")}"
                                placeholder="State" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="checkoutPincode">PIN Code</label>
                        <input type="text" id="checkoutPincode"
                            value="${escapeHTML(saved.pincode || "")}"
                            placeholder="6-digit PIN code"
                            pattern="[0-9]{6}" maxlength="6" required>
                    </div>

                    <h3><i class="fas fa-credit-card"></i> Payment Method</h3>

                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod"
                                value="Cash on Delivery"
                                ${!saved.paymentMethod || saved.paymentMethod === "Cash on Delivery" ? "checked" : ""}>
                            <span>Cash on Delivery</span>
                        </label>

                        <label class="payment-option">
                            <input type="radio" name="paymentMethod"
                                value="UPI"
                                ${saved.paymentMethod === "UPI" ? "checked" : ""}>
                            <span>UPI</span>
                        </label>

                        <label class="payment-option">
                            <input type="radio" name="paymentMethod"
                                value="Card"
                                ${saved.paymentMethod === "Card" ? "checked" : ""}>
                            <span>Credit / Debit Card</span>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary checkout-submit">
                        Place Order - ${formatPrice(total)}
                        <i class="fas fa-arrow-right"></i>
                    </button>

                </form>
            </div>

            <div class="checkout-summary">
                <h3>Order Summary</h3>

                <div class="checkout-summary-items">
                    ${cart.map(item => `
                        <div class="checkout-summary-item">
                            <span>${escapeHTML(item.name)} × ${item.quantity}</span>
                            <strong>${formatPrice(item.price * item.quantity)}</strong>
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

                <div class="summary-row summary-total">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                <p class="shipping-note">
                    <i class="fas fa-truck"></i>
                    ${shipping === 0
                        ? "You qualify for free shipping!"
                        : "Free shipping on orders above ₹2,000."}
                </p>
            </div>
        </div>
    `;

    const form = document.getElementById("checkoutForm");

    if (form) {
        form.addEventListener("submit", handlePlaceOrder);
    }
}

// ==========================================
// PLACE ORDER
// ==========================================

function handlePlaceOrder(event) {
    event.preventDefault();

    const user = getCurrentUser();

    if (!user) {
        showToast("Please login before placing your order.", "error");
        showSection("login");
        return;
    }

    const cart = getCart();

    if (!cart.length) {
        showToast("Your cart is empty.", "error");
        showSection("cart");
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

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
        showToast("Please complete all delivery details.", "error");
        return;
    }

    if (email.toLowerCase() !== user.email.toLowerCase()) {
        showToast("Please use your registered account email.", "error");
        return;
    }

    const subtotal = getCartSubtotal();
    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image || (item.images && item.images[0]) || "",
        quantity: Number(item.quantity)
    }));

    const order = {
        id: "SC" + Date.now(),
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        items: orderItems,

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

        paymentStatus: paymentMethod === "Cash on Delivery"
            ? "Pending"
            : "Demo - Not Processed",

        status: "Order Placed",
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    // SAVE ORDER BEFORE CLEARING CART
    try {
        let orders = JSON.parse(
            localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(orders)) {
            orders = [];
        }

        orders.push(order);

        localStorage.setItem(
            ORDERS_STORAGE_KEY,
            JSON.stringify(orders)
        );

    } catch (error) {
        console.error("Order saving failed:", error);
        showToast("Unable to save your order. Please try again.", "error");
        return;
    }

    // SAVE DELIVERY DETAILS
    saveCheckoutDetails({
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        paymentMethod
    });

    // CLEAR CART WITHOUT CONFIRMATION POPUP
    localStorage.removeItem("showcase_cart");

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    // SUCCESS MESSAGE
    showToast("Order placed successfully!", "success");

    // OPEN MY ORDERS AUTOMATICALLY
    showSection("orders");
}

// ==========================================
// INITIALIZE CHECKOUT
// ==========================================

function initializeCheckout() {
    displayCheckout();
}
