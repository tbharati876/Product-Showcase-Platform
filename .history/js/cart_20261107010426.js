// ==========================================
// SHOWCASE - SHOPPING CART
// ==========================================

const CART_KEY = "showcase_cart";

// Get cart items
function getCart() {
    const cart = getStoredData(CART_STORAGE_KEY, []);
    return Array.isArray(cart) ? cart : [];
}

// Save cart items
function saveCart(cart) {
    saveStoredData(CART_STORAGE_KEY, cart);
}

// Get complete product information for cart items
function getCartProducts() {
    const cart = getCart();
    const products = getProducts();

    return cart.map(item => {
        const product = products.find(
            product => Number(product.id) === Number(item.id)
        );

        if (!product) return null;

        return {
            ...product,
            quantity: Math.max(1, Number(item.quantity) || 1)
        };
    }).filter(Boolean);
}

// Get cart item count
function getCartCount() {
    return getCart().reduce(
        (total, item) => total + Math.max(1, Number(item.quantity) || 1),
        0
    );
}

// Update cart count in navigation
function updateCartCount() {
    const countElement = document.getElementById("cartCount");

    if (countElement) {
        countElement.textContent = getCartCount();
    }
}

// Add product to cart
function addToCart(productId) {
    const product = getProducts().find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) {
        showToast("Product not found.", "error");
        return;
    }

    if (
        product.stock_status &&
        product.stock_status.toLowerCase().includes("out")
    ) {
        showToast("This product is currently out of stock.", "warning");
        return;
    }

    const cart = getCart();

    const existingItem = cart.find(
        item => Number(item.id) === Number(productId)
    );

    if (existingItem) {
        existingItem.quantity = Math.max(
            1,
            Number(existingItem.quantity) || 1
        ) + 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    showToast(`${product.name} added to your cart.`, "success");

    displayCart();
}

// Change quantity of a cart item
function updateCartQuantity(productId, change) {
    const cart = getCart();

    const item = cart.find(
        item => Number(item.id) === Number(productId)
    );

    if (!item) return;

    item.quantity = Math.max(
        1,
        Number(item.quantity) || 1
    ) + Number(change);

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart(cart);
    updateCartCount();
    displayCart();
}

// Set an exact quantity
function setCartQuantity(productId, quantity) {
    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
        showToast("Quantity must be at least 1.", "warning");
        displayCart();
        return;
    }

    const cart = getCart();

    const item = cart.find(
        item => Number(item.id) === Number(productId)
    );

    if (!item) return;

    item.quantity = newQuantity;

    saveCart(cart);
    updateCartCount();
    displayCart();
}

// Remove a product from cart
function removeFromCart(productId) {
    const updatedCart = getCart().filter(
        item => Number(item.id) !== Number(productId)
    );

    saveCart(updatedCart);
    updateCartCount();
    displayCart();

    showToast("Product removed from your cart.", "success");
}

// Clear cart
function clearCart(silent = false) {
    saveCart([]);
    updateCartCount();

    if (typeof displayCart === "function") {
        displayCart();
    }

    if (!silent) {
        showToast("Your cart has been cleared.", "success");
    }
}

// Calculate subtotal
function getCartSubtotal() {
    return getCartProducts().reduce(
        (total, product) =>
            total + Number(product.price || 0) * product.quantity,
        0
    );
}

// Calculate shipping
function getCartShipping() {
    const subtotal = getCartSubtotal();

    if (subtotal === 0 || subtotal >= 2000) {
        return 0;
    }

    return 99;
}

// Calculate total
function getCartTotal() {
    return getCartSubtotal() + getCartShipping();
}

// Display shopping cart
function displayCart() {
    const container = document.getElementById("cartContent");

    if (!container) return;

    const cart = getCart();
    const products = getCartProducts();

    // Remove invalid product references
    if (cart.length !== products.length) {
        const validIds = products.map(product => Number(product.id));

        saveCart(
            cart.filter(item => validIds.includes(Number(item.id)))
        );

        updateCartCount();
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Your Cart Is Empty</h3>
                <p>You haven't added any products to your cart yet.</p>

                <button
                    class="btn btn-primary"
                    onclick="showSection('products')"
                >
                    Discover Products
                </button>
            </div>
        `;
        return;
    }

    const subtotal = getCartSubtotal();
    const shipping = getCartShipping();
    const total = getCartTotal();

    container.innerHTML = `
        <div class="cart-layout">

            <div class="cart-items">

                ${products.map(product => `
                    <div class="cart-item">

                        <img
                            src="${escapeHTML(getProductImage(product))}"
                            alt="${escapeHTML(product.name)}"
                            onerror="this.onerror=null;this.src='https://placehold.co/300x300?text=Product';"
                        >

                        <div class="cart-item-details">

                            <h3>${escapeHTML(product.name)}</h3>

                            <p>${escapeHTML(product.brand || "")}</p>

                            <strong>${formatPrice(product.price)}</strong>

                            <div class="quantity-control">

                                <button
                                    type="button"
                                    onclick="updateCartQuantity(${Number(product.id)}, -1)"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>

                                <span>${product.quantity}</span>

                                <button
                                    type="button"
                                    onclick="updateCartQuantity(${Number(product.id)}, 1)"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>

                            </div>

                            <p>
                                Item total:
                                <strong>
                                    ${formatPrice(
                                        Number(product.price) * product.quantity
                                    )}
                                </strong>
                            </p>

                            <button
                                class="btn btn-danger btn-small"
                                onclick="removeFromCart(${Number(product.id)})"
                            >
                                Remove
                            </button>

                        </div>

                    </div>
                `).join("")}

            </div>

            <aside class="cart-summary">

                <h3>Order Summary</h3>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <strong>
                        ${shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </strong>
                </div>

                <div class="summary-row total-row">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                ${
                    subtotal < 2000
                        ? `<p class="shipping-notice">
                            Add ${formatPrice(2000 - subtotal)} more for free shipping.
                        </p>`
                        : `<p class="shipping-notice">
                            You have unlocked free shipping!
                        </p>`
                }

                <button
                    class="btn btn-primary btn-block"
                    onclick="proceedToCheckout()"
                >
                    Proceed to Checkout
                </button>

                <button
                    class="btn btn-secondary btn-block"
                    onclick="showSection('products')"
                >
                    Continue Shopping
                </button>

                <button
                    class="btn btn-danger btn-block"
                    onclick="clearCart()"
                >
                    Clear Cart
                </button>

            </aside>

        </div>
    `;
}

// Proceed to checkout
function proceedToCheckout() {
    const products = getCartProducts();

    if (products.length === 0) {
        showToast("Your cart is empty.", "warning");
        showSection("cart");
        return;
    }

    showSection("checkout");
}

// Initialize cart
function initializeCart() {
    updateCartCount();
    displayCart();
}