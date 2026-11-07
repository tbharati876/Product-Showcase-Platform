/* =========================================
   SHOWCASE - WISHLIST
========================================= */

const WISHLIST_KEY = "showcase_wishlist";

/* ---------- GET WISHLIST ---------- */

function getWishlist() {
    const wishlist = getStoredData(WISHLIST_KEY, []);
    return Array.isArray(wishlist) ? wishlist : [];
}

/* ---------- SAVE WISHLIST ---------- */

function saveWishlist(wishlist) {
    return saveStoredData(WISHLIST_KEY, wishlist);
}

/* ---------- CHECK WISHLIST ---------- */

function isInWishlist(productId) {
    return getWishlist().some(
        id => Number(id) === Number(productId)
    );
}

/* ---------- TOGGLE WISHLIST ---------- */

function toggleWishlist(productId) {
    let wishlist = getWishlist();

    const exists = wishlist.some(
        id => Number(id) === Number(productId)
    );

    if (exists) {
        wishlist = wishlist.filter(
            id => Number(id) !== Number(productId)
        );

        showToast("Product removed from wishlist.", "success");
    } else {
        wishlist.push(Number(productId));

        showToast("Product added to wishlist.", "success");
    }

    saveWishlist(wishlist);

    displayWishlist();

    if (typeof displayProducts === "function") {
        displayProducts(currentProductList.length
            ? currentProductList
            : getProducts());
    }

    displayFeaturedProducts();
}

/* ---------- DISPLAY WISHLIST ---------- */

function displayWishlist() {
    const container = document.getElementById("wishlistContent");

    if (!container) return;

    const wishlist = getWishlist();

    const products = getProducts().filter(product =>
        wishlist.some(id => Number(id) === Number(product.id))
    );

    if (!products.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Your wishlist is empty</h3>
                <p>Add products you like to see them here.</p>
                <button
                    class="btn btn-primary"
                    onclick="showSection('products')"
                >Explore Products</button>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image-wrapper">
                <img
                    class="product-image"
                    src="${escapeHTML(getProductImage(product))}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x600/f3f1ff/7057e8?text=Image+Unavailable';"
                >
            </div>

            <div class="product-info">
                <p class="product-brand">${escapeHTML(product.brand || "ShowCase")}</p>
                <h3>${escapeHTML(product.name)}</h3>
                <p class="product-description">${escapeHTML(product.description || "")}</p>

                <div class="product-price-row">
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>

                <div class="product-card-buttons">
                    <button
                        class="btn btn-primary"
                        onclick="addToCart(${Number(product.id)})"
                    >Add to Cart</button>

                    <button
                        class="btn btn-outline"
                        onclick="toggleWishlist(${Number(product.id)})"
                    >Remove</button>
                </div>
            </div>
        </article>
    `).join("");
}

/* ---------- INITIALIZE ---------- */

function initializeWishlist() {
    displayWishlist();
}