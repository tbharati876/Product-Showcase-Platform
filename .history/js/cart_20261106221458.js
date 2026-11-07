
const CART_STORAGE_KEY = "showcase_v2_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
    element.style.display = count > 0 ? "inline-flex" : "none";
  });
}

function addToCart(productId) {
  const product = getProducts().find(
    item => String(item.id) === String(productId)
  );

  if (!product) return;

  if (product.stock_status === "Out of Stock") {
    alert("Sorry, this product is currently out of stock.");
    return;
  }

  const cart = getCart();
  const existingItem = cart.find(
    item => String(item.productId) === String(productId)
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(`${product.name} added to your cart!`);
  displayCart();
}

function changeCartQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find(
    entry => String(entry.productId) === String(productId)
  );

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
  displayCart();
}

function removeFromCart(productId) {
  const updatedCart = getCart().filter(
    item => String(item.productId) !== String(productId)
  );

  saveCart(updatedCart);
  displayCart();
}

function clearCart() {
  if (!confirm("Are you sure you want to clear your cart?")) return;

  saveCart([]);
  displayCart();
}

function displayCart() {
  const container = document.getElementById("cartContainer");
  if (!container) return;

  const cart = getCart();
  const products = getProducts();

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find(
      product => String(product.id) === String(item.productId)
    )
  })).filter(item => item.product);

  if (!cartItems.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Explore our products and add something you love.</p>
        <button class="btn btn-primary" onclick="showSection('products')">
          Explore products
        </button>
      </div>`;
    return;
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cartItems.map(item => `
          <article class="cart-item">
            <img
              src="${escapeCartText(item.product.images?.[0] || "")}"
              alt="${escapeCartText(item.product.name)}"
              onerror="this.src='https://placehold.co/160x160?text=Product'">

            <div class="cart-item-details">
              <h3>${escapeCartText(item.product.name)}</h3>
              <p>${escapeCartText(item.product.brand || "")}</p>
              <strong>${formatPrice(item.product.price)}</strong>

              <div class="cart-quantity">
                <button type="button"
                  onclick="changeCartQuantity('${escapeCartText(item.productId)}', -1)"
                  aria-label="Decrease quantity">−</button>
                <span>${item.quantity}</span>
                <button type="button"
                  onclick="changeCartQuantity('${escapeCartText(item.productId)}', 1)"
                  aria-label="Increase quantity">+</button>
              </div>
            </div>

            <button class="cart-remove"
              type="button"
              onclick="removeFromCart('${escapeCartText(item.productId)}')">
              Remove
            </button>
          </article>
        `).join("")}
      </div>

      <aside class="cart-summary">
        <h3>Order summary</h3>
        <div class="cart-summary-line">
          <span>Items (${cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
          <strong>${formatPrice(subtotal)}</strong>
        </div>
        <div class="cart-summary-line">
          <span>Shipping</span>
          <strong>Free</strong>
        </div>
        <div class="cart-summary-total">
          <span>Total</span>
          <strong>${formatPrice(subtotal)}</strong>
        </div>
        <button type="button" class="btn btn-primary cart-checkout"
          onclick="checkoutCart()">
          Proceed to checkout
        </button>
        <button type="button" class="cart-clear" onclick="clearCart()">
          Clear cart
        </button>
      </aside>
    </div>`;
}

function escapeCartText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function checkoutCart() {
  const currentUser = typeof getCurrentUser === "function"
    ? getCurrentUser()
    : null;

  if (!currentUser) {
    alert("Please log in before proceeding to checkout.");
    if (typeof showAuthPage === "function") showAuthPage("login");
    return;
  }

  if (!getCart().length) {
    alert("Your cart is empty.");
    return;
  }

  alert(
    "Checkout demo: Your cart is ready!\n\n" +
    "Online payment and order placement will be added in a later step."
  );
}

function createCartSection() {
  let section = document.getElementById("cart");

  if (!section) {
    section = document.createElement("section");
    section.id = "cart";
    section.className = "page-section";
    section.innerHTML = `
      <div class="section-heading">
        <span class="section-eyebrow">YOUR SHOPPING</span>
        <h2>Shopping Cart</h2>
        <p>Review your selected products before checkout.</p>
      </div>
      <div id="cartContainer"></div>`;

    document.querySelector("main")?.appendChild(section);
  }
}

function initializeCart() {
  createCartSection();
  updateCartCount();
  displayCart();
}

document.addEventListener("DOMContentLoaded", initializeCart);
