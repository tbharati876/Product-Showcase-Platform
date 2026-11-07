
/* =========================================
   SHOWCASE - PRODUCTS MODULE
========================================= */

/* ---------- GET PRODUCTS ---------- */

function getProducts() {
    return getStoredData(STORAGE_KEYS.products, []);
}

/* ---------- PRICE FORMAT ---------- */

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(price) || 0);
}

/* ---------- HTML ESCAPING ---------- */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

/* ---------- PRODUCT IMAGE ---------- */

function getProductImage(product, index = 0) {
    if (!product) {
        return "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=85";
    }

    const images = Array.isArray(product.images)
        ? product.images
        : [];

    return images[index] ||
        images[0] ||
        product.image ||
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=85";
}

function productImageHTML(product, className = "product-image") {
    const image = escapeHTML(getProductImage(product));
    const name = escapeHTML(product.name || "Product");

    return `
        <div class="${className}">
            <img
                src="${image}"
                alt="${name}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=85';"
            >
        </div>
    `;
}

/* ---------- PRODUCT CARD ---------- */

function createProductCard(product) {
    const image = escapeHTML(getProductImage(product));
    const name = escapeHTML(product.name);
    const brand = escapeHTML(product.brand || "ShowCase");
    const category = escapeHTML(product.category || "General");

    const isOutOfStock =
        String(product.stock_status || "").toLowerCase().includes("out");

    const wishlist = typeof getWishlist === "function"
        ? getWishlist()
        : [];

    const isWishlisted = wishlist.includes(Number(product.id));

    const rating = Number(product.rating) || 0;
    const reviews = Number(product.reviewsCount) || 0;

    const originalPrice = Number(product.originalPrice) || 0;
    const price = Number(product.price) || 0;

    const discount = originalPrice > price && originalPrice > 0
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;

    return `
        <article class="product-card">

            <div class="product-image">

                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=85';"
                >

                ${
                    discount > 0
                        ? `<span class="product-badge">${discount}% OFF</span>`
                        : ""
                }

                <button
                    class="wishlist-icon"
                    type="button"
                    aria-label="Add to wishlist"
                    onclick="handleWishlist(${Number(product.id)})"
                >
                    ${isWishlisted ? "♥" : "♡"}
                </button>

            </div>

            <div class="product-card-body">

                <span class="product-brand">${brand}</span>

                <h3>${name}</h3>

                <span class="product-category">${category}</span>

                <div class="product-rating">
                    ★★★★★
                    <span>
                        ${rating.toFixed(1)}
                        (${reviews} reviews)
                    </span>
                </div>

                <div class="product-price">
                    <strong>${formatPrice(price)}</strong>

                    ${
                        originalPrice > price
                            ? `<del>${formatPrice(originalPrice)}</del>`
                            : ""
                    }
                </div>

                <span class="product-stock ${
                    isOutOfStock ? "out-of-stock" : ""
                }">
                    ${isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>

                <div class="product-actions">

                    <button
                        type="button"
                        class="btn-view"
                        onclick="viewProduct(${Number(product.id)})"
                    >
                        View Details
                    </button>

                    <button
                        type="button"
                        class="btn-cart"
                        onclick="addToCart(${Number(product.id)})"
                        ${isOutOfStock ? "disabled" : ""}
                    >
                        Add to Cart
                    </button>

                    <button
                        type="button"
                        class="btn-compare"
                        onclick="handleComparison(${Number(product.id)})"
                    >
                        ⇄ Compare
                    </button>

                </div>

            </div>

        </article>
    `;
}

/* ---------- DISPLAY PRODUCTS ---------- */

function displayProducts(products = getProducts()) {
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) return;

    if (!products || products.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No Products Found</h3>
                <p>Try another search or choose a different category.</p>

                <button
                    class="btn-primary"
                    onclick="resetProductFilters()"
                >
                    Show All Products
                </button>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products
        .map(product => createProductCard(product))
        .join("");
}

/* ---------- CATEGORY CARD ---------- */

function createCategoryCard(category) {
    const image = escapeHTML(category.image);
    const name = escapeHTML(category.name);
    const description = escapeHTML(category.description || "");

    return `
        <article
            class="category-card"
            onclick="filterByCategory('${name.replace(/'/g, "\\'")}')"
            role="button"
            tabindex="0"
            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();filterByCategory('${name.replace(/'/g, "\\'")}');}"
        >

            <img
                src="${image}"
                alt="${name}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=85';"
            >

            <div class="category-card-content">
                <h3>${name}</h3>
                <p>${description}</p>
                <p>Explore Collection →</p>
            </div>

            <span class="category-icon">
                ${escapeHTML(category.icon || "✦")}
            </span>

        </article>
    `;
}

/* ---------- DISPLAY CATEGORIES ---------- */

function displayCategories() {
    const categoryGrid = document.getElementById("categoryGrid");
    const allCategories = document.getElementById("allCategories");

    const categoryHTML = categories
        .map(category => createCategoryCard(category))
        .join("");

    if (categoryGrid) {
        categoryGrid.innerHTML = categoryHTML;
    }

    if (allCategories) {
        allCategories.innerHTML = categoryHTML;
    }
}

/* ---------- FILTER BY CATEGORY ---------- */

function filterByCategory(categoryName) {
    const categoryFilter = document.getElementById("categoryFilter");

    if (categoryFilter) {
        const matchingOption = Array.from(categoryFilter.options)
            .find(option =>
                option.value.toLowerCase() === categoryName.toLowerCase()
            );

        if (matchingOption) {
            categoryFilter.value = matchingOption.value;
        }
    }

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.value = "";
    }

    const activeCategory = document.getElementById("activeCategory");

    if (activeCategory) {
        activeCategory.textContent = `Showing: ${categoryName}`;
    }

    applyProductFilters();

    if (typeof showSection === "function") {
        showSection("products");
    }
}

/* ---------- APPLY FILTERS ---------- */

function applyProductFilters() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "all";

    const sortValue = sortFilter
        ? sortFilter.value
        : "default";

    let filteredProducts = [...getProducts()];

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => {
            const searchableText = [
                product.name,
                product.brand,
                product.category,
                product.description,
                ...(product.tags || [])
            ].join(" ").toLowerCase();

            return searchableText.includes(searchTerm);
        });
    }

    if (selectedCategory && selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    switch (sortValue) {
        case "price-low":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;

        case "price-high":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;

        case "rating":
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;

        case "name":
            filteredProducts.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;

        default:
            break;
    }

    const activeCategory = document.getElementById("activeCategory");

    if (activeCategory) {
        activeCategory.textContent =
            selectedCategory === "all"
                ? `Showing ${filteredProducts.length} products`
                : `Showing ${selectedCategory} (${filteredProducts.length})`;
    }

    displayProducts(filteredProducts);
}

/* ---------- RESET FILTERS ---------- */

function resetProductFilters() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (sortFilter) sortFilter.value = "default";

    applyProductFilters();
}

/* ---------- FEATURED PRODUCTS ---------- */

function displayFeaturedProducts() {
    const featuredGrid = document.getElementById("featuredProducts");

    if (!featuredGrid) return;

    const products = getProducts();

    const featuredProducts = [...products]
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 8);

    featuredGrid.innerHTML = featuredProducts
        .map(product => createProductCard(product))
        .join("");
}

/* ---------- VIEW PRODUCT DETAILS ---------- */

function viewProduct(productId) {
    const product = getProducts().find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) {
        if (typeof showToast === "function") {
            showToast("Product not found.", "error");
        }
        return;
    }

    const modal = document.getElementById("productModal");
    const modalContent = document.getElementById("productModalContent");

    if (!modal || !modalContent) return;

    const features = Array.isArray(product.features)
        ? product.features
        : [];

    const specifications = product.specifications || {};

    const isOutOfStock =
        String(product.stock_status || "").toLowerCase().includes("out");

    const featureHTML = features.length
        ? features.map(feature => `<li>${escapeHTML(feature)}</li>`).join("")
        : "<li>Quality product from ShowCase</li>";

    const specificationHTML = Object.entries(specifications)
        .map(([key, value]) => `
            <div class="specification-row">
                <strong>${escapeHTML(key)}</strong>
                <span>${escapeHTML(value)}</span>
            </div>
        `)
        .join("");

    const images = Array.isArray(product.images)
        ? product.images
        : [getProductImage(product)];

    modalContent.innerHTML = `
        <button
            class="modal-close"
            type="button"
            onclick="closeProductModal()"
            aria-label="Close"
        >
            ×
        </button>

        <div class="modal-product-layout">

            <div>
                <img
                    class="modal-product-image"
                    src="${escapeHTML(images[0] || getProductImage(product))}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=85';"
                >

                ${
                    images.length > 1
                        ? `
                            <div class="modal-gallery">
                                ${images.map((image, index) => `
                                    <img
                                        src="${escapeHTML(image)}"
                                        alt="${escapeHTML(product.name)} ${index + 1}"
                                        onclick="changeModalImage(this)"
                                        onerror="this.style.display='none'"
                                    >
                                `).join("")}
                            </div>
                        `
                        : ""
                }
            </div>

            <div class="modal-product-info">

                <span class="product-brand">
                    ${escapeHTML(product.brand || "ShowCase")}
                </span>

                <h2>${escapeHTML(product.name)}</h2>

                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>

                <div class="product-rating">
                    ★★★★★
                    ${Number(product.rating || 0).toFixed(1)}
                    (${Number(product.reviewsCount || 0)} reviews)
                </div>

                <div class="product-price">
                    <strong>${formatPrice(product.price)}</strong>
                    ${
                        Number(product.originalPrice) > Number(product.price)
                            ? `<del>${formatPrice(product.originalPrice)}</del>`
                            : ""
                    }
                </div>

                <p>${escapeHTML(product.description || "")}</p>

                <h3>Key Features</h3>
                <ul class="product-feature-list">
                    ${featureHTML}
                </ul>

                ${
                    specificationHTML
                        ? `
                            <h3>Specifications</h3>
                            <div class="specifications-list">
                                ${specificationHTML}
                            </div>
                        `
                        : ""
                }

                <p class="product-stock ${
                    isOutOfStock ? "out-of-stock" : ""
                }">
                    ${isOutOfStock ? "Out of Stock" : "Available"}
                </p>

                <button
                    class="btn-primary"
                    onclick="addToCart(${Number(product.id)})"
                    ${isOutOfStock ? "disabled" : ""}
                >
                    Add to Cart
                </button>

                <button
                    class="btn-secondary"
                    onclick="handleWishlist(${Number(product.id)})"
                >
                    ♡ Add to Wishlist
                </button>

            </div>

        </div>
    `;

    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

/* ---------- CHANGE MODAL IMAGE ---------- */

function changeModalImage(thumbnail) {
    const mainImage = document.querySelector(".modal-product-image");

    if (mainImage && thumbnail) {
        mainImage.src = thumbnail.src;
    }
}

/* ---------- CLOSE MODAL ---------- */

function closeProductModal() {
    const modal = document.getElementById("productModal");

    if (!modal) return;

    modal.classList.remove("active");
    modal.style.display = "none";
    document.body.style.overflow = "";
}

/* ---------- WISHLIST ACTION ---------- */

function handleWishlist(productId) {
    if (typeof addToWishlist !== "function") return;

    addToWishlist(Number(productId));

    displayProducts(
        getProducts().filter(product => {
            const categoryFilter = document.getElementById("categoryFilter");
            const selectedCategory = categoryFilter?.value || "all";

            return selectedCategory === "all" ||
                product.category.toLowerCase() === selectedCategory.toLowerCase();
        })
    );

    displayFeaturedProducts();
}

/* ---------- COMPARISON ACTION ---------- */

function handleComparison(productId) {
    if (typeof addToComparison !== "function") return;

    addToComparison(Number(productId));
}

/* ---------- PRODUCT EVENT LISTENERS ---------- */

function initializeProductEvents() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) {
        searchInput.addEventListener("input", applyProductFilters);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", applyProductFilters);
    }

    if (sortFilter) {
        sortFilter.addEventListener("change", applyProductFilters);
    }

    const modal = document.getElementById("productModal");

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeProductModal();
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeProductModal();
        }
    });
}

/* ---------- INITIALIZE PRODUCTS ---------- */

function initializeProducts() {
    displayCategories();
    displayProducts();
    displayFeaturedProducts();
    initializeProductEvents();
}
