
// SHOWCASE V2 - ADMIN DASHBOARD

let editingProductId = null;

// ==========================================
// 1. ADMIN ACCESS CONTROL
// ==========================================

function isAdmin() {
    const user = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    return Boolean(user && user.role === "admin");
}

function requireAdmin() {
    if (isAdmin()) return true;

    alert("Access denied. Please login using an admin account.");

    if (typeof showAuthPage === "function") {
        showAuthPage("login");
    }

    return false;
}

// ==========================================
// 2. CREATE ADMIN DASHBOARD
// ==========================================

function createAdminDashboard() {
    let adminSection = document.getElementById("admin");

    if (!adminSection) {
        adminSection = document.createElement("section");
        adminSection.id = "admin";
        adminSection.className = "section-padding page-section";

        const main = document.querySelector("main") || document.body;
        main.appendChild(adminSection);
    }

    adminSection.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <span>SHOWCASE MANAGEMENT</span>
                <h2>Admin Dashboard</h2>
                <p>Manage your products, catalogue and inventory.</p>
            </div>

            <div class="admin-welcome">
                <div>
                    <h2>Welcome, Administrator 👋</h2>
                    <p>Manage your ShowCase store from one place.</p>
                </div>

                <span class="admin-role-badge">ADMIN</span>
            </div>

            <div class="admin-stat-grid">

                <div class="admin-stat-card">
                    <span>📦</span>
                    <p>Total Products</p>
                    <h2 id="adminTotalProducts">0</h2>
                </div>

                <div class="admin-stat-card">
                    <span>🏷️</span>
                    <p>Categories</p>
                    <h2 id="adminTotalCategories">0</h2>
                </div>

                <div class="admin-stat-card">
                    <span>⭐</span>
                    <p>Average Rating</p>
                    <h2 id="adminAverageRating">0</h2>
                </div>

                <div class="admin-stat-card">
                    <span>⚠️</span>
                    <p>Out of Stock</p>
                    <h2 id="adminOutOfStock">0</h2>
                </div>

            </div>

            <div class="admin-toolbar">
                <div>
                    <h2>Product Management</h2>
                    <p>Add, edit and remove products.</p>
                </div>

                <button class="btn btn-primary"
                    onclick="showAdminProductForm()">
                    + Add New Product
                </button>
            </div>

            <div id="adminProductFormContainer" hidden>
                <form id="adminProductForm" class="contact-form">

                    <h3 id="adminFormTitle">Add New Product</h3>

                    <div class="admin-form-grid">

                        <div>
                            <label for="adminProductName">Product Name</label>
                            <input id="adminProductName"
                                type="text"
                                placeholder="Enter product name"
                                required>
                        </div>

                        <div>
                            <label for="adminProductBrand">Brand</label>
                            <input id="adminProductBrand"
                                type="text"
                                placeholder="Enter brand"
                                required>
                        </div>

                        <div>
                            <label for="adminProductCategory">Category</label>
                            <select id="adminProductCategory" required>
                                ${categories.map(category => `
                                    <option value="${category}">
                                        ${category}
                                    </option>
                                `).join("")}
                            </select>
                        </div>

                        <div>
                            <label for="adminProductPrice">Price (INR)</label>
                            <input id="adminProductPrice"
                                type="number"
                                min="1"
                                placeholder="Enter price"
                                required>
                        </div>

                        <div>
                            <label for="adminProductOriginalPrice">
                                Original Price (INR)
                            </label>
                            <input id="adminProductOriginalPrice"
                                type="number"
                                min="1"
                                placeholder="Enter original price"
                                required>
                        </div>

                        <div>
                            <label for="adminProductRating">Rating</label>
                            <input id="adminProductRating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value="4.5"
                                required>
                        </div>

                        <div>
                            <label for="adminProductStock">Stock Status</label>
                            <select id="adminProductStock">
                                <option value="In Stock">In Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>

                        <div>
                            <label for="adminProductReviews">Review Count</label>
                            <input id="adminProductReviews"
                                type="number"
                                min="0"
                                value="0">
                        </div>

                    </div>

                    <label for="adminProductImage">Product Image URL</label>
                    <input id="adminProductImage"
                        type="url"
                        placeholder="https://example.com/product.jpg"
                        required>

                    <label for="adminProductDescription">Description</label>
                    <textarea id="adminProductDescription"
                        rows="3"
                        placeholder="Describe your product"
                        required></textarea>

                    <label for="adminProductFeatures">
                        Features (separate with commas)
                    </label>
                    <input id="adminProductFeatures"
                        type="text"
                        placeholder="Premium quality, Durable, Lightweight">

                    <label for="adminProductTags">
                        Search Tags (separate with commas)
                    </label>
                    <input id="adminProductTags"
                        type="text"
                        placeholder="electronics, premium, wireless">

                    <div class="admin-form-actions">
                        <button type="submit"
                            class="btn btn-primary">
                            Save Product
                        </button>

                        <button type="button"
                            class="btn btn-secondary"
                            onclick="cancelAdminProductForm()">
                            Cancel
                        </button>
                    </div>

                </form>
            </div>

            <div class="admin-search">
                <input type="search"
                    id="adminProductSearch"
                    placeholder="Search products by name or brand...">
            </div>

            <div class="admin-table-wrapper">
                <table class="comparison-table admin-products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody id="adminProductTableBody"></tbody>
                </table>
            </div>

        </div>
    `;

    document.getElementById("adminProductForm")
        .addEventListener("submit", saveAdminProduct);

    document.getElementById("adminProductSearch")
        .addEventListener("input", displayAdminProducts);
}

// ==========================================
// 3. DASHBOARD STATISTICS
// ==========================================

function updateAdminStatistics() {
    const products = getProducts();

    const totalProducts = products.length;

    const averageRating = totalProducts
        ? products.reduce(
            (total, product) => total + Number(product.rating || 0),
            0
        ) / totalProducts
        : 0;

    const outOfStock = products.filter(
        product => product.stock_status !== "In Stock"
    ).length;

    document.getElementById("adminTotalProducts").textContent =
        totalProducts;

    document.getElementById("adminTotalCategories").textContent =
        new Set(products.map(product => product.category)).size;

    document.getElementById("adminAverageRating").textContent =
        averageRating.toFixed(1);

    document.getElementById("adminOutOfStock").textContent =
        outOfStock;
}

// ==========================================
// 4. DISPLAY PRODUCT TABLE
// ==========================================

function displayAdminProducts() {
    const tableBody = document.getElementById(
        "adminProductTableBody"
    );

    if (!tableBody) return;

    const searchTerm = document.getElementById(
        "adminProductSearch"
    )?.value.toLowerCase() || "";

    const filteredProducts = getProducts().filter(product =>
        `${product.name} ${product.brand} ${product.category}`
            .toLowerCase()
            .includes(searchTerm)
    );

    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No products found.</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <div class="admin-product-cell">
                    <img
                        src="${escapeAdminText(product.images?.[0] || "")}"
                        alt=""
                        onerror="this.style.display='none'">

                    <strong>${escapeAdminText(product.name)}</strong>
                </div>
            </td>

            <td>${escapeAdminText(product.category)}</td>

            <td>₹${Number(product.price).toLocaleString("en-IN")}</td>

            <td>⭐ ${Number(product.rating).toFixed(1)}</td>

            <td>
                <span class="admin-stock ${
                    product.stock_status === "In Stock"
                        ? "available"
                        : "unavailable"
                }">
                    ${escapeAdminText(product.stock_status)}
                </span>
            </td>

            <td>
                <div class="admin-action-buttons">
                    <button class="btn btn-secondary"
                        onclick="editAdminProduct(${product.id})">
                        Edit
                    </button>

                    <button class="btn btn-danger"
                        onclick="deleteAdminProduct(${product.id})">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    updateAdminStatistics();
}

// ==========================================
// 5. ADD PRODUCT FORM
// ==========================================

function showAdminProductForm() {
    if (!requireAdmin()) return;

    editingProductId = null;

    const form = document.getElementById("adminProductForm");

    form.reset();

    document.getElementById("adminFormTitle").textContent =
        "Add New Product";

    document.getElementById(
        "adminProductFormContainer"
    ).hidden = false;

    document.getElementById("adminProductName").focus();
}

// ==========================================
// 6. SAVE OR UPDATE PRODUCT
// ==========================================

function saveAdminProduct(event) {
    event.preventDefault();

    if (!requireAdmin()) return;

    const name = document.getElementById(
        "adminProductName"
    ).value.trim();

    const brand = document.getElementById(
        "adminProductBrand"
    ).value.trim();

    const category = document.getElementById(
        "adminProductCategory"
    ).value;

    const price = Number(document.getElementById(
        "adminProductPrice"
    ).value);

    const originalPrice = Number(document.getElementById(
        "adminProductOriginalPrice"
    ).value);

    const rating = Number(document.getElementById(
        "adminProductRating"
    ).value);

    const image = document.getElementById(
        "adminProductImage"
    ).value.trim();

    const description = document.getElementById(
        "adminProductDescription"
    ).value.trim();

    const stock = document.getElementById(
        "adminProductStock"
    ).value;

    const reviewCount = Number(document.getElementById(
        "adminProductReviews"
    ).value || 0);

    const features = document.getElementById(
        "adminProductFeatures"
    ).value.split(",")
        .map(item => item.trim())
        .filter(Boolean);

    const tags = document.getElementById(
        "adminProductTags"
    ).value.split(",")
        .map(item => item.trim())
        .filter(Boolean);

    if (!name || !brand || !description || !image) {
        alert("Please complete all required fields.");
        return;
    }

    if (!Number.isFinite(price) || price <= 0 ||
        !Number.isFinite(originalPrice) ||
        originalPrice < price) {
        alert("Enter valid prices. Original price must be at least the selling price.");
        return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
        alert("Rating must be between 0 and 5.");
        return;
    }

    if (!Number.isFinite(reviewCount) || reviewCount < 0) {
        alert("Review count cannot be negative.");
        return;
    }

    let products = getProducts();

    const productData = {
        name,
        brand,
        category,
        price,
        originalPrice,
        rating,
        reviewsCount: reviewCount,
        stock_status: stock,
        description,
        images: [image],
        features,
        specifications: {},
        tags
    };

    if (editingProductId !== null) {
        products = products.map(product =>
            product.id === editingProductId
                ? { ...product, ...productData }
                : product
        );
    } else {
        productData.id = Date.now();
        products.push(productData);
    }

    saveStoredData(STORAGE_KEYS.products, products);

    cancelAdminProductForm();
    refreshStoreAfterAdminChange();

    alert(
        editingProductId === null
            ? "Product added successfully!"
            : "Product updated successfully!"
    );

    editingProductId = null;
}

// ==========================================
// 7. EDIT PRODUCT
// ==========================================

function editAdminProduct(productId) {
    if (!requireAdmin()) return;

    const product = getProducts().find(
        item => item.id === productId
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    editingProductId = productId;

    document.getElementById("adminFormTitle").textContent =
        "Edit Product";

    document.getElementById("adminProductName").value =
        product.name;

    document.getElementById("adminProductBrand").value =
        product.brand;

    document.getElementById("adminProductCategory").value =
        product.category;

    document.getElementById("adminProductPrice").value =
        product.price;

    document.getElementById("adminProductOriginalPrice").value =
        product.originalPrice || product.price;

    document.getElementById("adminProductRating").value =
        product.rating;

    document.getElementById("adminProductStock").value =
        product.stock_status;

    document.getElementById("adminProductReviews").value =
        product.reviewsCount || 0;

    document.getElementById("adminProductImage").value =
        product.images?.[0] || "";

    document.getElementById("adminProductDescription").value =
        product.description;

    document.getElementById("adminProductFeatures").value =
        (product.features || []).join(", ");

    document.getElementById("adminProductTags").value =
        (product.tags || []).join(", ");

    document.getElementById(
        "adminProductFormContainer"
    ).hidden = false;

    document.getElementById("adminProductName").focus();
}

// ==========================================
// 8. DELETE PRODUCT
// ==========================================

function deleteAdminProduct(productId) {
    if (!requireAdmin()) return;

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const products = getProducts().filter(
        product => product.id !== productId
    );

    saveStoredData(STORAGE_KEYS.products, products);

    saveStoredData(
        STORAGE_KEYS.wishlist,
        getStoredData(STORAGE_KEYS.wishlist).filter(
            id => id !== productId
        )
    );

    saveStoredData(
        STORAGE_KEYS.comparison,
        getStoredData(STORAGE_KEYS.comparison).filter(
            id => id !== productId
        )
    );

    refreshStoreAfterAdminChange();

    alert("Product deleted successfully!");
}

// ==========================================
// 9. CANCEL PRODUCT FORM
// ==========================================

function cancelAdminProductForm() {
    const form = document.getElementById("adminProductForm");

    if (form) form.reset();

    const container = document.getElementById(
        "adminProductFormContainer"
    );

    if (container) container.hidden = true;

    editingProductId = null;
}

// ==========================================
// 10. REFRESH ALL STORE SECTIONS
// ==========================================

function refreshStoreAfterAdminChange() {
    displayAdminProducts();
    displayProducts();
    displayFeaturedProducts();
    displayCategories();

    if (typeof displayWishlist === "function") {
        displayWishlist();
    }

    if (typeof displayComparison === "function") {
        displayComparison();
    }
}

// ==========================================
// 11. SAFE TEXT OUTPUT
// ==========================================

function escapeAdminText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// ==========================================
// 12. INITIALIZE ADMIN DASHBOARD
// ==========================================

function initializeAdmin() {
    createAdminDashboard();
    displayAdminProducts();

    console.log("ShowCase admin dashboard initialized.");
}
