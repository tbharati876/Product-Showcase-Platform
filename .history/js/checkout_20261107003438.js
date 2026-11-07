
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

// Get checkout form element
function getCheckoutElement(...selectors) {
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
    }

    return null;
}

// Get input value
function getCheckoutValue(...selectors) {
    const element = getCheckoutElement(...selectors);
    return element ? element.value.trim() : "";
}

// Fill saved checkout details
function fillCheckoutDetails() {
    const details = getCheckoutDetails();

    const fields = {
        name: ["#checkoutName", "#customerName", '[name="name"]'],
        email: ["#checkoutEmail", "#customerEmail", '[name="email"]'],
        phone: ["#checkoutPhone", "#customerPhone", '[name="phone"]'],
        address: ["#checkoutAddress", "#deliveryAddress", '[name="address"]'],
        city: ["#checkoutCity", "#city", '[name="city"]'],
        state: ["#checkoutState", "#state", '[name="state"]'],
        pincode: ["#checkoutPincode", "#pincode", '[name="pincode"]']
    };

    Object.entries(fields).forEach(([key, selectors]) => {
        const element = getCheckoutElement(...selectors);

        if (element && details[key] && !element.value) {
            element.value = details[key];
        }
    });
}

// Display checkout page
function displayCheckout() {
    const cart = typeof getCart === "function"
        ? getCart()
        : [];

    if (cart.length === 0) {
        const checkoutContainer =
            document.getElementById("checkout");

        if (checkoutContainer) {
            const content =
                checkoutContainer.querySelector(".checkout-content") ||
                checkoutContainer.querySelector(".content-section");

            if (content) {
                content.innerHTML = `
                    <div class="checkout-empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <h2>Your Cart Is Empty</h2>
                        <p>Add products to your cart before proceeding to checkout.</p>
                        <button class="btn btn-primary"
                            onclick="showSection('products')">
                            Continue Shopping
                        </button>
                    </div>
                `;
            }
        }

        return;
    }

    fillCheckoutDetails();

    const summaryContainer =
        document.getElementById("checkoutOrderSummary") ||
        document.getElementById("checkoutSummary");

    if (!summaryContainer) return;

    const subtotal = cart.reduce((total, item) => {
        return total +
            (Number(item.price) || 0) *
            (Number(item.quantity) || 1);
    }, 0);

    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;

    summaryContainer.innerHTML = `
        <div class="checkout-summary">
            <h3>Order Summary</h3>

            <div class="checkout-summary-products">
                ${cart.map(item => {
                    const image =
                        item.image ||
                        (Array.isArray(item.images) ? item.images[0] : "");

                    const name = item.name || item.title || "Product";
                    const quantity = Number(item.quantity) || 1;
                    const price = Number(item.price) || 0;

                    return `
                        <div class="checkout-summary-item">
                            <div class="checkout-summary-image">
                                ${
                                    image
                                        ? `<img src="${ordersEscape(image)}"
                                            alt="${ordersEscape(name)}"
                                            onerror="this.style.display='none'">`
                                        : `<i class="fas fa-box"></i>`
                                }
                            </div>

                            <div class="checkout-summary-info">
                                <h4>${ordersEscape(name)}</h4>
                                <p>Quantity: ${quantity}</p>
                            </div>

                            <strong>
                                ${ordersFormatPrice(price * quantity)}
                            </strong>
                        </div>
                    `;
                }).join("")}
            </div>

            <div class="checkout-summary-row">
                <span>Subtotal</span>
                <strong>${ordersFormatPrice(subtotal)}</strong>
            </div>

            <div class="checkout-summary-row">
                <span>Shipping</span>
                <strong>
                    ${shipping === 0 ? "FREE" : ordersFormatPrice(shipping)}
                </strong>
            </div>

            <div class="checkout-summary-total">
                <span>Total</span>
                <strong>${ordersFormatPrice(total)}</strong>
            </div>
        </div>
    `;
}

// Create a complete product snapshot
function createOrderProductSnapshot(item) {
    const snapshot = {
        ...item,

        id: item.id,
        name: item.name || item.title || "Product",
        description: item.description || "",
        brand: item.brand || "",
        category: item.category || "",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,

        image:
            item.image ||
            (Array.isArray(item.images) ? item.images[0] : "") ||
            item.thumbnail ||
            item.productImage ||
            "",

        images: Array.isArray(item.images)
            ? [...item.images]
            : [],

        features: Array.isArray(item.features)
            ? [...item.features]
            : item.features || [],

        specifications: item.specifications
            ? { ...item.specifications }
            : {},

        tags: Array.isArray(item.tags)
            ? [...item.tags]
            : []
    };

    return snapshot;
}

// Place order
function handlePlaceOrder(event) {
    if (event) {
        event.preventDefault();
    }

    const user = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    if (!user) {
        showToast("Please login before placing an order.", "error");
        showSection("login");
        return;
    }

    const cart = typeof getCart === "function"
        ? getCart()
        : [];

    if (cart.length === 0) {
        showToast("Your cart is empty.", "error");
        showSection("cart");
        return;
    }

    const name = getCheckoutValue(
        "#checkoutName",
        "#customerName",
        '[name="name"]'
    ) || user.name || "";

    const email = getCheckoutValue(
        "#checkoutEmail",
        "#customerEmail",
        '[name="email"]'
    ) || user.email || "";

    const phone = getCheckoutValue(
        "#checkoutPhone",
        "#customerPhone",
        '[name="phone"]'
    );

    const address = getCheckoutValue(
        "#checkoutAddress",
        "#deliveryAddress",
        '[name="address"]'
    );

    const city = getCheckoutValue(
        "#checkoutCity",
        "#city",
        '[name="city"]'
    );

    const state = getCheckoutValue(
        "#checkoutState",
        "#state",
        '[name="state"]'
    );

    const pincode = getCheckoutValue(
        "#checkoutPincode",
        "#pincode",
        '[name="pincode"]'
    );

    const paymentElement = getCheckoutElement(
        "#paymentMethod",
        '[name="paymentMethod"]:checked',
        '[name="payment-method"]:checked'
    );

    const paymentMethod = paymentElement
        ? paymentElement.value
        : "Cash on Delivery";

    if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !pincode
    ) {
        showToast(
            "Please fill in all delivery details.",
            "error"
        );
        return;
    }

    const subtotal = cart.reduce((total, item) => {
        return total +
            (Number(item.price) || 0) *
            (Number(item.quantity) || 1);
    }, 0);

    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;

    // Save complete product information
    const orderItems = cart.map(createOrderProductSnapshot);

    const order = {
        id: "SC" + Date.now(),

        customerId: user.id || user.email,
        customerName: name,
        customerEmail: email,

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

        paymentStatus:
            paymentMethod === "Cash on Delivery"
                ? "Pending"
                : "Demo Payment",

        status: "Order Placed",

        date: new Date().toISOString(),
        createdAt: Date.now()
    };

    // Save order without removing previous orders
    try {
        let existingOrders = [];

        try {
            existingOrders = JSON.parse(
                localStorage.getItem(CHECKOUT_ORDERS_KEY)
            ) || [];
        } catch (error) {
            existingOrders = [];
        }

        if (!Array.isArray(existingOrders)) {
            existingOrders = [];
        }

        existingOrders.push(order);

        localStorage.setItem(
            CHECKOUT_ORDERS_KEY,
            JSON.stringify(existingOrders)
        );

        // Save delivery details for future checkout
        saveCheckoutDetails({
            name,
            email,
            phone,
            address,
            city,
            state,
            pincode
        });

        // Clear cart after successful order saving
        if (typeof clearCart === "function") {
            clearCart(true);
        } else {
            localStorage.removeItem("showcase_cart");
        }

        if (typeof updateCartCount === "function") {
            updateCartCount();
        }

        showToast("Your order has been placed successfully!", "success");

        showSection("orders");

    } catch (error) {
        console.error("Order placement failed:", error);

        showToast(
            "Unable to place your order. Please try again.",
            "error"
        );
    }
}

// Initialize checkout
function initializeCheckout() {
    const checkoutForm = getCheckoutElement(
        "#checkoutForm",
        "#checkout form",
        "form.checkout-form"
    );

    if (checkoutForm) {
        checkoutForm.removeEventListener(
            "submit",
            handlePlaceOrder
        );

        checkoutForm.addEventListener(
            "submit",
            handlePlaceOrder
        );
    }

    displayCheckout();
}
