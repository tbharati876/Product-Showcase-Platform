
// ==========================================
// SHOWCASE - WISHLIST MODULE
// ==========================================

// Get wishlist product IDs.
function getWishlist() {
  const wishlist = getStoredData(STORAGE_KEYS.wishlist, []);

  return Array.isArray(wishlist)
    ? wishlist.map(Number)
    : [];
}

// Save wishlist product IDs.
function saveWishlist(wishlist) {
  return saveStoredData(STORAGE_KEYS.wishlist, wishlist);
}

// ==========================================
// ADD PRODUCT TO WISHLIST
// ==========================================

function addToWishlist(productId) {
  productId = Number(productId);

  const product = getProducts().find(
    item => Number(item.id) === productId
  );

  if (!product) {
    if (typeof showToast === "function") {
      showToast("Product not found", "error");
    }
    return;
  }

  const wishlist = getWishlist();

  if (wishlist.includes(productId)) {
    if (typeof showToast === "function") {
      showToast("Product is already in your wishlist", "info");
    }
    return;
  }

  wishlist.push(productId);
  saveWishlist(wishlist);

  if (typeof updateWishlistCount === "function") {
    updateWishlistCount();
  }

  if (typeof showToast === "function") {
    showToast("Product added to wishlist!", "success");
  }

  displayWishlist();
}

// ==========================================
// REMOVE PRODUCT FROM WISHLIST
// ==========================================

function removeFromWishlist(productId) {
  productId = Number(productId);

  const updatedWishlist = getWishlist().filter(
    id => id !== productId
  );

  saveWishlist(updatedWishlist);

  if (typeof updateWishlistCount === "function") {
    updateWishlistCount();
  }

  if (typeof showToast === "function") {
    showToast("Product removed from wishlist", "success");
  }

  displayWishlist();

  if (typeof applyProductFilters === "function") {
    applyProductFilters();
  }

  if (typeof displayFeaturedProducts === "function") {
    displayFeaturedProducts();
  }
}

// ==========================================
// UPDATE WISHLIST COUNT
// ==========================================

function updateWishlistCount() {
  const count = getWishlist().length;

  const wishlistCount = document.getElementById("wishlistCount");

  if (wishlistCount) {
    wishlistCount.textContent = count;
  }

  const wishlistBadge = document.getElementById("wishlistBadge");

  if (wishlistBadge) {
    wishlistBadge.textContent = count;
  }
}

// ==========================================
// DISPLAY WISHLIST PRODUCTS
// ==========================================

function displayWishlist() {
  const wishlistGrid = document.getElementById("wishlistGrid");

  if (!wishlistGrid) return;

  const wishlistIds = getWishlist();

  const wishlistProducts = getProducts().filter(product =>
    wishlistIds.includes(Number(product.id))
  );

  if (wishlistProducts.length === 0) {
    wishlistGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">♡</div>
        <h3>Your Wishlist Is Empty</h3>
        <p>
          Save your favourite products here and find them easily later.
        </p>
        <button
          class="btn-primary"
          onclick="showSection('products')"
        >
          Explore Products
        </button>
      </div>
    `;

    updateWishlistCount();
    return;
  }

  wishlistGrid.innerHTML = wishlistProducts.map(product => `
    <div class="wishlist-item">

      ${createProductCard(product)}

      <button
        class="btn-remove-wishlist"
        onclick="removeFromWishlist(${Number(product.id)})"
      >
        Remove from Wishlist
      </button>

    </div>
  `).join("");

  updateWishlistCount();
}

// ==========================================
// INITIALIZE WISHLIST
// ==========================================

function initializeWishlist() {
  displayWishlist();
  updateWishlistCount();
}
