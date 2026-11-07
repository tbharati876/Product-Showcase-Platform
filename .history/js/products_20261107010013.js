/* =========================================
   SHOWCASE - PRODUCT MANAGEMENT
========================================= */

let currentProductList = [];

/* ---------- PRODUCT CARD ---------- */

function createProductCard(product) {
    const image = getProductImage(product);
    const isWishlisted = typeof isInWishlist === "function"
        ? isInWishlist(product.id)
        : false;

    return `
        <article class="product-card">
            <div class="product-image-wrapper">
                <img
                    class="product-image"
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x600/f3f1ff/7057e8?text=Image+Unavailable';"
                >

                <span class="product-badge">${escapeHTML(product.category)}</span>

                <div class="product-card-actions">
                    <button
                        type="button"
                        title="Wishlist"
                        onclick="toggleWishlist(${Number(product.id)})"
                    >${isWishlisted ? "❤️" : "♡"}</button>

                    <button
                        type="button"
                        title="Compare"
                        onclick="addToCompare(${Number(product.id)})"
                    >⇄</button>
                </div>
            </div>

            <div class="product-info">
                <p class="product-brand">${escapeHTML(product.brand || "ShowCase")}</p>

                <h3>${escapeHTML(product.name)}</h3>

                <p class="product-description">
                    ${escapeHTML(product.description || "")}
                </p>

                <div class="product-rating">
                    ★ ${Number(product.rating || 0).toFixed(1)} / 5
                </div>

                <div class="product-price-row">
                    <span class="product-price">${formatPrice(product.price)}</span>

                    ${
                        product.original_price
                            ? `<span class="old-price">${formatPrice(product.original_price)}</span>`
                            : ""
                    }
                </div>

                <div class="product-card-buttons">
                    <button
                        type="button"
                        class="btn btn-outline"
                        onclick="viewProductDetails(${Number(product.id)})"
                    >Details</button>

                    <button
                        type="button"
                        class="btn btn-primary"
                        onclick="addToCart(${Number(product.id)})"
                    >Add to Cart</button>
                </div>
            </div>
        </article>
    `;
}

/* ---------- RENDER PRODUCTS ---------- */

function displayProducts(products = getProducts()) {
    const container = document.getElementById("productsContent");

    if (!container) return;

    currentProductList = products;

    if (!products.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>Try changing your search or category.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(createProductCard).join("");
}

/* ---------- FEATURED PRODUCTS ---------- */

function displayFeaturedProducts() {
    const container = document.getElementById("featuredProducts");

    if (!container) return;

    const products = getProducts().slice(0, 4);

    container.innerHTML = products.map(createProductCard).join("");
}

/* ---------- CATEGORY DISPLAY ---------- */

function displayCategories() {
    const containers = [
        document.getElementById("categoriesContent"),
        document.getElementById("homeCategories")
    ];

    const categories = productCategories;

    containers.forEach(container => {
        if (!container) return;

        container.innerHTML = categories.map(category => {
            const count = getProducts().filter(
                product => product.category === category.name
            ).length;

            return `
                <div
                    class="category-card"
                    onclick="selectCategory('${escapeHTML(category.name)}')"
                >
                    <div class="category-icon">${category.icon}</div>
                    <h3>${escapeHTML(category.name)}</h3>
                    <p>${escapeHTML(category.description)}</p>
                    <p>${count} Products</p>
                </div>
            `;
        }).join("");
    });
}

/* ---------- CATEGORY FILTER OPTIONS ---------- */

function initializeCategoryFilter() {
    const select = document.getElementById("categoryFilter");

    if (!select) return;

    const categories = [...new Set(
        getProducts().map(product => product.category)
    )];

    select.innerHTML = `
        <option value="">All Categories</option>
        ${categories.map(category => `
            <option value="${escapeHTML(category)}">
                ${escapeHTML(category)}
            </option>
        `).join("")}
    `;
}

/* ---------- SEARCH AND FILTER ---------- */

function filterProducts() {
    const searchInput = document.getElementById("productSearch");
    const categorySelect = document.getElementById("categoryFilter");
    const sortSelect = document.getElementById("sortProducts");

    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const category = categorySelect ? categorySelect.value : "";
    const sort = sortSelect ? sortSelect.value : "";

    let products = getProducts().filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            (product.description || "").toLowerCase().includes(search) ||
            (product.brand || "").toLowerCase().includes(search) ||
            (product.tags || []).some(tag =>
                String(tag).toLowerCase().includes(search)
            );

        const matchesCategory =
            !category || product.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
        products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
        products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
        products.sort((a, b) => b.rating - a.rating);
    } else if (sort === "name") {
        products.sort((a, b) => a.name.localeCompare(b.name));
    }

    displayProducts(products);
}

/* ---------- CATEGORY SELECTION ---------- */

function selectCategory(category) {
    showSection("products");

    const select = document.getElementById("categoryFilter");

    if (select) {
        select.value = category;
    }

    filterProducts();
}

/* ---------- PRODUCT DETAILS ---------- */

function viewProductDetails(productId) {
    const product = getProducts().find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) {
        showToast("Product not found.", "error");
        return;
    }

    showSection("products");

    const container = document.getElementById("productDetailsContent");

    if (!container) return;

    const specifications = product.specifications || {};

    container.innerHTML = `
        <div class="product-details">
            <div class="product-details-image">
                <img
                    src="${escapeHTML(getProductImage(product))}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x600/f3f1ff/7057e8?text=Image+Unavailable';"
                >
            </div>

            <div class="product-details-info">
                <p class="product-brand">${escapeHTML(product.brand || "ShowCase")}</p>

                <h2>${escapeHTML(product.name)}</h2>

                <div class="product-rating">
                    ★ ${Number(product.rating || 0).toFixed(1)} / 5
                </div>

                <h3 class="product-price">${formatPrice(product.price)}</h3>

                <p>${escapeHTML(product.description || "")}</p>

                <p><strong>Category:</strong> ${escapeHTML(product.category)}</p>

                <p><strong>Availability:</strong> ${escapeHTML(product.stock_status || "In Stock")}</p>

                <h3>Features</h3>

                <ul class="product-features">
                    ${(product.features || []).map(feature => `
                        <li>${escapeHTML(feature)}</li>
                    `).join("")}
                </ul>

                <h3>Specifications</h3>

                <table class="product-specifications">
                    <tbody>
                        ${Object.entries(specifications).map(([key, value]) => `
                            <tr>
                                <td><strong>${escapeHTML(key)}</strong></td>
                                <td>${escapeHTML(value)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <div class="product-card-buttons">
                    <button
                        class="btn btn-primary"
                        onclick="addToCart(${Number(product.id)})"
                    >Add to Cart</button>

                    <button
                        class="btn btn-outline"
                        onclick="showSection('products')"
                    >Back to Products</button>
                </div>
            </div>
        </div>
    `;

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* ---------- PRODUCT INITIALIZATION ---------- */

function initializeProductsPage() {
    initializeProducts();
    initializeCategoryFilter();
    displayProducts();
    displayFeaturedProducts();
    displayCategories();
}