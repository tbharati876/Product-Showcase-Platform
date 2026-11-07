
// ==========================================
// SHOWCASE - WISHLIST MANAGEMENT
// ==========================================

// Get wishlist
function getWishlist() {
    return getStoredData(STORAGE_KEYS.wishlist);
}

// Add product to wishlist
function addToWishlist(productId) {

    const wishlist = getWishlist();

    if (wishlist.includes(productId)) {
        alert("This product is already in your wishlist!");
        return;
    }

    const productExists = getProducts().some(
        product => product.id === productId
    );

    if (!productExists) {
        alert("Product not found!");
        return;
    }

    wishlist.push(productId);

    saveStoredData(STORAGE_KEYS.wishlist, wishlist);

    displayWishlist();

    alert("Product added to your wishlist!");
}

// Remove product from wishlist
function removeFromWishlist(productId) {

    let wishlist = getWishlist();

    wishlist = wishlist.filter(
        id => id !== productId
    );

    saveStoredData(STORAGE_KEYS.wishlist, wishlist);

    displayWishlist();

    alert("Product removed from wishlist!");
}

// Display wishlist products
function displayWishlist() {

    const wishlistGrid =
        document.getElementById("wishlistGrid");

    if (!wishlistGrid) return;

    const wishlist = getWishlist();

    const wishlistProducts = getProducts().filter(
        product => wishlist.includes(product.id)
    );

    if (wishlistProducts.length === 0) {

        wishlistGrid.innerHTML = `
            <p class="empty-message">
                Your wishlist is empty.
                Start adding your favourite products!
            </p>
        `;

        return;
    }

    wishlistGrid.innerHTML = wishlistProducts.map(product => `

        <article class="product-card">

            <div class="product-image">
                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/eee8ff/6c45d9?text=Product+Image'">
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="product-rating">
                    ⭐ ${product.rating} / 5
                </div>

                <div class="product-price">
                    $${Number(product.price).toFixed(2)}
                </div>

                <div class="product-actions">

                    <button onclick="viewProduct(${product.id})">
                        View Details
                    </button>

                    <button onclick="removeFromWishlist(${product.id})">
                        Remove ♡
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}

// Initialize wishlist
function initializeWishlist() {
    displayWishlist();
}
