
// ==========================================
// SHOWCASE - PRODUCT CATALOG
// ==========================================

// Category icons
const categoryIcons = {
    "Electronics": "💻",
    "Fashion": "👕",
    "Books": "📚",
    "Home & Living": "🏠",
    "Sports & Outdoors": "⚽",
    "Gaming": "🎮"
};

// Get product data
function getProducts() {
    return getStoredData(STORAGE_KEYS.products);
}

// Display categories
function displayCategories() {
    const categoryGrid = document.getElementById("categoryGrid");
    const categoryFilter = document.getElementById("categoryFilter");

    if (!categoryGrid || !categoryFilter) return;

    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card"
             onclick="filterByCategory('${category.name}')">

            <div class="category-icon">
                ${categoryIcons[category.name] || "🛍️"}
            </div>

            <h3>${category.name}</h3>

            <p>${category.description}</p>

        </div>
    `).join("");

    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(category => `
            <option value="${category.name}">
                ${category.name}
            </option>
        `).join("")}
    `;
}

// Display product cards
function createProductCard(product) {
    const image = product.images && product.images.length
        ? product.images[0]
        : "";

    const safeName = String(product.name).replace(/'/g, "\\'");

    return `
        <article class="product-card">

            <div class="product-image">
                <img
                    src="${image}"
                    alt="${product.name}"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/eee8ff/6c45d9?text=Product+Image'">
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

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

                    <button onclick="addToWishlist(${product.id})">
                        ♡ Wishlist
                    </button>

                    <button onclick="addToComparison(${product.id})">
                        Compare
                    </button>

                </div>

            </div>

        </article>
    `;
}

// Display all products
function displayProducts(productList = getProducts()) {
    const productGrid = document.getElementById("productGrid");
    const noProducts = document.getElementById("noProducts");

    if (!productGrid) return;

    if (productList.length === 0) {
        productGrid.innerHTML = "";

        if (noProducts) {
            noProducts.hidden = false;
        }

        return;
    }

    if (noProducts) {
        noProducts.hidden = true;
    }

    productGrid.innerHTML = productList
        .map(createProductCard)
        .join("");
}

// Display featured products
function displayFeaturedProducts() {
    const featuredContainer =
        document.getElementById("featuredProducts");

    if (!featuredContainer) return;

    const featured = getProducts().slice(0, 3);

    featuredContainer.innerHTML = featured
        .map(createProductCard)
        .join("");
}

// Search products
function searchProducts() {
    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const searchTerm = searchInput.value
        .toLowerCase()
        .trim();

    const selectedCategory = categoryFilter.value;

    const sortValue = sortFilter.value;

    let filteredProducts = getProducts().filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag =>
                tag.toLowerCase().includes(searchTerm)
            );

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Sorting
    if (sortValue === "price-low") {
        filteredProducts.sort(
            (a, b) => a.price - b.price
        );
    }

    if (sortValue === "price-high") {
        filteredProducts.sort(
            (a, b) => b.price - a.price
        );
    }

    if (sortValue === "rating") {
        filteredProducts.sort(
            (a, b) => b.rating - a.rating
        );
    }

    displayProducts(filteredProducts);
}

// Filter by category
function filterByCategory(category) {
    const categoryFilter =
        document.getElementById("categoryFilter");

    categoryFilter.value = category;

    searchProducts();

    document.getElementById("products")
        .scrollIntoView({ behavior: "smooth" });
}

// View product details
function viewProduct(productId) {
    const product = getProducts().find(
        item => item.id === productId
    );

    if (!product) return;

    alert(
        `Product: ${product.name}\n\n` +
        `Brand: ${product.brand}\n` +
        `Category: ${product.category}\n` +
        `Price: $${Number(product.price).toFixed(2)}\n` +
        `Rating: ${product.rating}/5\n\n` +
        `Description: ${product.description}\n\n` +
        `Features: ${product.features.join(", ")}`
    );
}

// Initialize product catalog
function initializeProducts() {
    displayCategories();
    displayFeaturedProducts();
    displayProducts();

    document.getElementById("searchInput")
        .addEventListener("input", searchProducts);

    document.getElementById("categoryFilter")
        .addEventListener("change", searchProducts);

    document.getElementById("sortFilter")
        .addEventListener("change", searchProducts);
}
