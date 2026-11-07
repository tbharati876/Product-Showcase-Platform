


// SHOWCASE V3 - PRODUCT CATALOGUE + SHOPPING CART

const categoryIcons = {
    "Electronics": "🎧",
    "Fashion": "👕",
    "Books": "📚",
    "Home & Living": "🏠",
    "Sports & Outdoors": "⚽",
    "Gaming": "🎮"
};

function getProducts() {
    return getStoredData(STORAGE_KEYS.products) || [];
}

// Format Indian currency
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(price) || 0);
}

// Safely display text in HTML
function escapeProductText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Render category cards
function displayCategories() {
    const categoryGrid = document.getElementById("categoryGrid");
    const categoryFilter = document.getElementById("categoryFilter");

    if (!categoryGrid) return;

    categoryGrid.innerHTML = categories.map(category => {
        const safeCategory = escapeProductText(category);

        const count = getProducts().filter(
            product => product.category === category
        ).length;

        return `
            <article class="category-card"
                onclick="filterByCategory('${safeCategory}')"
                role="button"
                tabindex="0"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();filterByCategory('${safeCategory}')}">

                <div class="category-icon">
                    ${categoryIcons[category] || "🛍️"}
                </div>

                <h3>${safeCategory}</h3>

                <p>${count} products available</p>

                <span class="category-shop-link">
                    Explore Collection →
                </span>
            </article>
        `;
    }).join("");

    if (categoryFilter) {
        const selectedValue = categoryFilter.value || "all";

        categoryFilter.innerHTML = `
            <option value="all">All Categories</option>
            ${categories.map(category => `
                <option value="${escapeProductText(category)}">
                    ${escapeProductText(category)}
                </option>
            `).join("")}
        `;

        categoryFilter.value = selectedValue;
    }
}

// Add product to shopping cart
function addProductToCart(productId) {
    if (typeof addToCart === "function") {
        addToCart(productId);
    } else {
        alert("Shopping cart is not initialized. Please refresh the page.");
    }
}

// Create an individual product card
function createProductCard(product) {
    const image = product.images?.[0] ||
        "https://placehold.co/600x500?text=Product";

    const discount = product.originalPrice > product.price
        ? Math.round(
            ((product.originalPrice - product.price) /
            product.originalPrice) * 100
        )
        : 0;

    const stockAvailable = product.stock_status === "In Stock";

    const safeId = JSON.stringify(product.id);

    return `
        <article class="product-card">

            <div class="product-image">
                <img
                    src="${escapeProductText(image)}"
                    alt="${escapeProductText(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x500/eee8ff/6c45d9?text=Image+Unavailable'">

                ${discount > 0
                    ? `<span class="discount-badge">${discount}% OFF</span>`
                    : ""}

                <span class="stock-badge ${stockAvailable ? "in-stock" : "out-stock"}">
                    ${escapeProductText(product.stock_status)}
                </span>
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeProductText(product.category)}
                </span>

                <h3>${escapeProductText(product.name)}</h3>

                <p class="product-brand">
                    ${escapeProductText(product.brand)}
                </p>

                <p class="product-description">
                    ${escapeProductText(product.description)}
                </p>

                <div class="product-rating">
                    ⭐ ${Number(product.rating || 0).toFixed(1)}
                    <span>(${Number(product.reviewsCount || 0)} reviews)</span>
                </div>

                <div class="product-price">
                    ${formatPrice(product.price)}

                    ${product.originalPrice > product.price
                        ? `<del>${formatPrice(product.originalPrice)}</del>`
                        : ""}
                </div>

                <div class="product-actions">

                    <button
                        class="btn btn-primary"
                        onclick='viewProduct(${safeId})'>
                        View Details
                    </button>

                    <button
                        class="btn btn-secondary"
                        onclick='addToWishlist(${safeId})'>
                        ♡ Wishlist
                    </button>

                    <button
                        class="btn btn-secondary"
                        onclick='addToComparison(${safeId})'>
                        Compare
                    </button>

                    <button
                        class="btn btn-cart"
                        onclick='addProductToCart(${safeId})'
                        ${stockAvailable ? "" : "disabled"}>
                        🛒 ${stockAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>

                </div>

            </div>
        </article>
    `;
}

// Display products in the catalogue
function displayProducts(productList = getProducts()) {
    const productGrid = document.getElementById("productGrid");
    const noProducts = document.getElementById("noProducts");

    if (!productGrid) return;

    productGrid.innerHTML = productList.map(
        product => createProductCard(product)
    ).join("");

    if (noProducts) {
        noProducts.hidden = productList.length !== 0;
    }
}

// Display featured products on homepage
function displayFeaturedProducts() {
    const featuredContainer =
        document.getElementById("featuredProducts");

    if (!featuredContainer) return;

    const featuredProducts = [...getProducts()]
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 6);

    featuredContainer.innerHTML = featuredProducts.map(
        product => createProductCard(product)
    ).join("");
}

// Search, category filtering and sorting
function searchProducts() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    const searchTerm = searchInput?.value.trim().toLowerCase() || "";
    const selectedCategory = categoryFilter?.value || "all";
    const selectedSort = sortFilter?.value || "default";

    let filteredProducts = getProducts().filter(product => {
        const searchableText = [
            product.name,
            product.brand,
            product.category,
            product.description,
            ...(product.tags || [])
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (selectedSort === "low-high") {
        filteredProducts.sort(
            (a, b) => Number(a.price) - Number(b.price)
        );
    }

    if (selectedSort === "high-low") {
        filteredProducts.sort(
            (a, b) => Number(b.price) - Number(a.price)
        );
    }

    if (selectedSort === "rating") {
        filteredProducts.sort(
            (a, b) => Number(b.rating) - Number(a.rating)
        );
    }

    displayProducts(filteredProducts);
}

// Open a category from category cards
function filterByCategory(category) {
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");

    if (categoryFilter) {
        categoryFilter.value = category;
    }

    if (searchInput) {
        searchInput.value = "";
    }

    searchProducts();

    if (typeof showSection === "function") {
        showSection("products");
    }

    history.replaceState(null, "", "#products");
}

// Product detail popup
function viewProduct(productId) {
    const product = getProducts().find(
        item => String(item.id) === String(productId)
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    let modal = document.getElementById("productDetailModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "productDetailModal";
        modal.className = "product-modal";
        document.body.appendChild(modal);
    }

    const features = (product.features || []).map(
        feature => `<li>${escapeProductText(feature)}</li>`
    ).join("");

    const specifications = Object.entries(
        product.specifications || {}
    ).map(([key, value]) => `
        <tr>
            <th>${escapeProductText(key)}</th>
            <td>${escapeProductText(value)}</td>
        </tr>
    `).join("");

    const gallery = (product.images || []).map((image, index) => `
        <img
            src="${escapeProductText(image)}"
            alt="${escapeProductText(product.name)} image ${index + 1}"
            onclick="document.getElementById('mainProductImage').src=this.src"
            onerror="this.style.display='none'">
    `).join("");

    const safeId = JSON.stringify(product.id);
    const stockAvailable = product.stock_status === "In Stock";

    modal.innerHTML = `
        <div class="product-modal-content">

            <button class="modal-close"
                onclick="closeProductModal()"
                aria-label="Close product details">
                ✕
            </button>

            <div class="modal-gallery">
                <img
                    id="mainProductImage"
                    class="modal-main-image"
                    src="${escapeProductText(product.images?.[0] || "https://placehold.co/600x500?text=Product")}"
                    alt="${escapeProductText(product.name)}"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x500?text=Product'">

                <div class="modal-thumbnails">
                    ${gallery}
                </div>
            </div>

            <div class="modal-product-info">

                <span class="product-category">
                    ${escapeProductText(product.category)}
                </span>

                <h2>${escapeProductText(product.name)}</h2>

                <p>Brand: ${escapeProductText(product.brand)}</p>

                <div class="product-rating">
                    ⭐ ${Number(product.rating || 0).toFixed(1)}
                    (${Number(product.reviewsCount || 0)} reviews)
                </div>

                <h3>${formatPrice(product.price)}</h3>

                <p>${escapeProductText(product.description)}</p>

                <h3>Product Features</h3>
                <ul>${features}</ul>

                <h3>Specifications</h3>
                <table class="comparison-table">
                    <tbody>${specifications}</tbody>
                </table>

                <p>
                    <strong>Availability:</strong>
                    ${escapeProductText(product.stock_status)}
                </p>

                <div class="product-actions">

                    <button class="btn btn-cart"
                        onclick='addProductToCart(${safeId})'
                        ${stockAvailable ? "" : "disabled"}>
                        🛒 ${stockAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <button class="btn btn-secondary"
                        onclick='addToWishlist(${safeId})'>
                        ♡ Add to Wishlist
                    </button>

                    <button class="btn btn-secondary"
                        onclick='addToComparison(${safeId})'>
                        Compare Product
                    </button>

                </div>
            </div>

        </div>
    `;

    modal.hidden = false;
    document.body.classList.add("modal-open");
}

function closeProductModal() {
    const modal = document.getElementById("productDetailModal");

    if (modal) {
        modal.hidden = true;
    }

    document.body.classList.remove("modal-open");
}

// Initialize catalogue and event listeners
function initializeProducts() {
    displayCategories();
    displayFeaturedProducts();
    displayProducts();

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) {
        searchInput.addEventListener("input", searchProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", searchProducts);
    }

    if (sortFilter) {
        sortFilter.addEventListener("change", searchProducts);
    }

    console.log("ShowCase product catalogue initialized.");
}
