

// SHOWCASE V2 - PRODUCT CATALOGUE

const categoryIcons = {
    "Electronics": "🎧",
    "Fashion": "👕",
    "Books": "📚",
    "Home & Living": "🏠",
    "Sports & Outdoors": "⚽",
    "Gaming": "🎮"
};

function getProducts() {
    return getStoredData(STORAGE_KEYS.products);
}

// Format Indian currency
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(price) || 0);
}

// Render category cards
function displayCategories() {
    const categoryGrid = document.getElementById("categoryGrid");
    const categoryFilter = document.getElementById("categoryFilter");

    if (!categoryGrid) return;

    categoryGrid.innerHTML = categories.map(category => {
        const count = getProducts().filter(
            product => product.category === category
        ).length;

        return `
            <article class="category-card"
                onclick="filterByCategory('${category}')"
                role="button"
                tabindex="0"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();filterByCategory('${category}')}">

                <div class="category-icon">
                    ${categoryIcons[category] || "🛍️"}
                </div>

                <h3>${category}</h3>

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
                <option value="${category}">${category}</option>
            `).join("")}
        `;

        categoryFilter.value = selectedValue;
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

    return `
        <article class="product-card">

            <div class="product-image">
                <img
                    src="${image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x500/eee8ff/6c45d9?text=Image+Unavailable'">

                ${discount > 0
                    ? `<span class="discount-badge">${discount}% OFF</span>`
                    : ""}

                <span class="stock-badge ${stockAvailable ? "in-stock" : "out-stock"}">
                    ${product.stock_status}
                </span>
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-brand">
                    ${product.brand}
                </p>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-rating">
                    ⭐ ${Number(product.rating).toFixed(1)}
                    <span>(${product.reviewsCount || 0} reviews)</span>
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
                        onclick="viewProduct(${product.id})">
                        View Details
                    </button>

                    <button
                        class="btn btn-secondary"
                        onclick="addToWishlist(${product.id})"
                        aria-label="Add ${product.name} to wishlist">
                        ♡ Wishlist
                    </button>

                    <button
                        class="btn btn-secondary"
                        onclick="addToComparison(${product.id})">
                        Compare
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
        item => item.id === productId
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
        feature => `<li>${feature}</li>`
    ).join("");

    const specifications = Object.entries(
        product.specifications || {}
    ).map(([key, value]) => `
        <tr>
            <th>${key}</th>
            <td>${value}</td>
        </tr>
    `).join("");

    const gallery = (product.images || []).map((image, index) => `
        <img
            src="${image}"
            alt="${product.name} image ${index + 1}"
            onclick="document.getElementById('mainProductImage').src='${image}'"
            onerror="this.style.display='none'">
    `).join("");

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
                    src="${product.images?.[0] || ""}"
                    alt="${product.name}"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x500?text=Product'">

                <div class="modal-thumbnails">
                    ${gallery}
                </div>
            </div>

            <div class="modal-product-info">
                <span class="product-category">${product.category}</span>

                <h2>${product.name}</h2>

                <p>Brand: ${product.brand}</p>

                <div class="product-rating">
                    ⭐ ${Number(product.rating).toFixed(1)}
                    (${product.reviewsCount || 0} reviews)
                </div>

                <h3>${formatPrice(product.price)}</h3>

                <p>${product.description}</p>

                <h3>Product Features</h3>
                <ul>${features}</ul>

                <h3>Specifications</h3>
                <table class="comparison-table">
                    <tbody>${specifications}</tbody>
                </table>

                <p><strong>Availability:</strong> ${product.stock_status}</p>

                <div class="product-actions">
                    <button class="btn btn-primary"
                        onclick="addToWishlist(${product.id})">
                        ♡ Add to Wishlist
                    </button>

                    <button class="btn btn-secondary"
                        onclick="addToComparison(${product.id})">
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
