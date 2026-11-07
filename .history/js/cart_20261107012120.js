
const CART_STORAGE_KEY = "showcase_cart";

// Get cart items
function getCart() {
    return getStoredData(CART_STORAGE_KEY, []);
}

// Save cart
function saveCart(cart) {
    saveStoredData(CART_STORAGE_KEY, cart);
    updateCartCount();
}

// Get total quantity
function getCartItemCount() {
    return getCart().reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );
}

// Update cart badge
function updateCartCount() {
    const count = getCartItemCount();

    const cartCount = document.getElementById("cartCount");
    const cartBadge = document.getElementById("cartBadge");

    [cartCount, cartBadge].forEach(element => {
        if (element) {
            element.textContent = count;
            element.style.display = count > 0 ? "inline-flex" : "none";
        }
    });
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = getProducts().find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) {
        showToast("Product not found.", "error");
        return;
    }

    if (product.stock_status === "Out of Stock") {
        showToast("This product is currently out of stock.", "error");
        return;
    }

    quantity = Math.max(1, Number(quantity) || 1);

    const cart = getCart();

    const existingItem = cart.find(
        item => Number(item.id) === Number(productId)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            quantity
        });
    }

    saveCart(cart);

    showToast(product.name + " added to cart!", "success");

    displayCart();
}

// Remove product from cart
function removeFromCart(productId) {
    const updatedCart = getCart().filter(
        item => Number(item.id) !== Number(productId)
    );

    saveCart(updatedCart);
    displayCart();

    showToast("Product removed from cart.", "success");
}

// Update product quantity
function updateCartQuantity(productId, quantity) {
    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
        showToast("Quantity must be at least 1.", "error");
        displayCart();
        return;
    }

    const cart = getCart();

    const item = cart.find(
        product => Number(product.id) === Number(productId)
    );

    if (!item) return;

    item.quantity = quantity;

    saveCart(cart);
    displayCart();
}

// Clear cart
function clearCart() {
    if (getCart().length === 0) return;

    if (!confirm("Are you sure you want to clear your cart?")) {
        return;
    }

    saveCart([]);
    displayCart();

    showToast("Your cart has been cleared.", "success");
}

// Calculate subtotal
function getCartSubtotal() {
    const cart = getCart();
    const products = getProducts();

    return cart.reduce((total, item) => {
        const product = products.find(
            p => Number(p.id) === Number(item.id)
        );

        return product
            ? total + Number(product.price) * Number(item.quantity)
            : total;
    }, 0);
}

// Display cart
function displayCart() {
    const container = document.getElementById("cartContent");

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

    // Remove cart entries for products that no longer exist
    if (cartProducts.length !== cart.length) {
        saveCart(cartProducts.map(item => ({
            id: item.id,
            quantity: item.quantity
        })));
    }

    if (cartProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3>Your Cart is Empty</h3>
                <p>You haven't added any products yet.</p>

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

    const subtotal = cartProducts.reduce(
        (total, product) =>
            total + Number(product.price) * product.quantity,
        0
    );

    const totalItems = cartProducts.reduce(
        (total, product) => total + product.quantity,
        0
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    container.innerHTML = `
        <div class="cart-layout">

            <div class="cart-items">

                <div class="cart-heading">
                    <h3>Shopping Cart</h3>
                    <span>${totalItems} item(s)</span>
                </div>

                ${cartProducts.map(product => `
                    <div class="cart-item">

                        <img
                            src="${escapeHTML(getProductImage(product))}"
                            alt="${escapeHTML(product.name)}"
                            class="cart-product-image"
                        >

                        <div class="cart-item-details">
                            <h4>${escapeHTML(product.name)}</h4>
                            <p>${escapeHTML(product.brand || "")}</p>
                            <strong>${formatPrice(product.price)}</strong>

                            <div class="cart-quantity">
                                <button
                                    onclick="updateCartQuantity(${product.id}, ${product.quantity - 1})"
                                    ${product.quantity <= 1 ? "disabled" : ""}
                                >
                                    −
                                </button>

                                <span>${product.quantity}</span>

                                <button
                                    onclick="updateCartQuantity(${product.id}, ${product.quantity + 1})"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="cart-item-actions">
                            <strong>
                                ${formatPrice(product.price * product.quantity)}
                            </strong>

                            <button
                                class="btn-remove"
                                onclick="removeFromCart(${product.id})"
                            >
                                Remove
                            </button>
                        </div>

                    </div>
                `).join("")}

                <button
                    class="btn-secondary"
                    onclick="clearCart()"
                >
                    Clear Cart
                </button>

            </div>

            <div class="cart-summary">

                <h3>Order Summary</h3>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <strong>${shipping === 0 ? "FREE" : formatPrice(shipping)}</strong>
                </div>

                ${shipping === 0 ? `
                    <p class="free-shipping-message">
                        You have qualified for free shipping!
                    </p>
                ` : `
                    <p class="free-shipping-message">
                        Add ${formatPrice(2000 - subtotal)} more for free shipping.
                    </p>
                `}

                <hr>

                <div class="summary-row summary-total">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                <button
                    class="btn-primary checkout-btn"
                    onclick="proceedToCheckout()"
                >
                    Proceed to Checkout
                </button>

                <button
                    class="btn-secondary"
                    onclick="showSection('products')"
                >
                    Continue Shopping
                </button>

            </div>

        </div>
    `;
}

// Open checkout
function proceedToCheckout() {
    if (getCart().length === 0) {
        showToast("Your cart is empty.", "error");
        return;
    }

    if (typeof showSection === "function") {
        showSection("checkout");
    }

    if (typeof displayCheckout === "function") {
        displayCheckout();
    }
}

// Initialize cart
function initializeCart() {
    updateCartCount();
    displayCart();
}
