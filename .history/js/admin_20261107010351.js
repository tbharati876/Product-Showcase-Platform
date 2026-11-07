// ==========================================
// SHOWCASE - ADMIN DASHBOARD
// ==========================================

const ADMIN_EMAIL = "admin@showcase.com";

// Check whether the current user is the admin
function isAdmin() {
    const currentUser = getCurrentUser();

    return Boolean(
        currentUser &&
        currentUser.email?.toLowerCase() === ADMIN_EMAIL
    );
}

// Display admin dashboard
function displayAdmin() {
    const container = document.getElementById("adminContent");

    if (!container) return;

    if (!isAdmin()) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Admin Access Required</h3>
                <p>You must login with the admin account to access this section.</p>
                <button
                    class="btn btn-primary"
                    onclick="showSection('login')"
                >
                    Login
                </button>
            </div>
        `;
        return;
    }

    const products = getProducts();
    const users = getUsers();
    const orders = getStoredData(ORDERS_STORAGE_KEY, []);

    const totalRevenue = orders
        .filter(order => order.status !== "Cancelled")
        .reduce((sum, order) => sum + Number(order.total || 0), 0);

    container.innerHTML = `
        <div class="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Manage your ShowCase store.</p>

            <div class="admin-stats">
                <div class="admin-stat-card">
                    <h3>${products.length}</h3>
                    <p>Total Products</p>
                </div>

                <div class="admin-stat-card">
                    <h3>${users.length}</h3>
                    <p>Registered Users</p>
                </div>

                <div class="admin-stat-card">
                    <h3>${orders.length}</h3>
                    <p>Total Orders</p>
                </div>

                <div class="admin-stat-card">
                    <h3>${formatPrice(totalRevenue)}</h3>
                    <p>Order Revenue</p>
                </div>
            </div>

            <section class="admin-section">
                <h3>Add New Product</h3>

                <form
                    id="adminProductForm"
                    class="admin-form"
                    onsubmit="addAdminProduct(event)"
                >
                    <div class="form-group">
                        <label for="adminProductName">Product Name</label>
                        <input
                            id="adminProductName"
                            name="name"
                            type="text"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="adminProductBrand">Brand</label>
                        <input
                            id="adminProductBrand"
                            name="brand"
                            type="text"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="adminProductCategory">Category</label>
                        <input
                            id="adminProductCategory"
                            name="category"
                            type="text"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="adminProductPrice">Price (₹)</label>
                        <input
                            id="adminProductPrice"
                            name="price"
                            type="number"
                            min="1"
                            step="0.01"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="adminProductImage">Product Image URL</label>
                        <input
                            id="adminProductImage"
                            name="image"
                            type="url"
                            placeholder="https://example.com/product.jpg"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="adminProductDescription">Description</label>
                        <textarea
                            id="adminProductDescription"
                            name="description"
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Add Product
                    </button>
                </form>
            </section>

            <section class="admin-section">
                <h3>Manage Products</h3>

                <div class="admin-product-list">
                    ${products.map(product => `
                        <div class="admin-product-row">
                            <img
                                src="${escapeHTML(getProductImage(product))}"
                                alt="${escapeHTML(product.name)}"
                                onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=Product';"
                            >

                            <div class="admin-product-info">
                                <strong>${escapeHTML(product.name)}</strong>
                                <span>${formatPrice(product.price)}</span>
                            </div>

                            <button
                                class="btn btn-danger btn-small"
                                onclick="deleteAdminProduct(${Number(product.id)})"
                            >
                                Remove
                            </button>
                        </div>
                    `).join("")}
                </div>
            </section>

            <section class="admin-section">
                <h3>Recent Orders</h3>

                ${
                    orders.length
                        ? `
                            <div class="admin-order-list">
                                ${orders.slice(0, 10).map(order => `
                                    <div class="admin-order-row">
                                        <div>
                                            <strong>${escapeHTML(order.orderNumber || order.id || "Order")}</strong>
                                            <p>${escapeHTML(order.customerName || "Customer")}</p>
                                        </div>

                                        <div>
                                            <strong>${formatPrice(order.total || 0)}</strong>
                                            <p>${escapeHTML(order.status || "Placed")}</p>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        `
                        : "<p>No orders have been placed yet.</p>"
                }
            </section>
        </div>
    `;
}

// Add a product through admin dashboard
function addAdminProduct(event) {
    event.preventDefault();

    if (!isAdmin()) {
        showToast("Admin access required.", "error");
        return;
    }

    const form = event.target;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const price = Number(formData.get("price"));
    const image = String(formData.get("image") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!name || !brand || !category || !description || !image || price <= 0) {
        showToast("Please enter valid product details.", "warning");
        return;
    }

    const products = getProducts();

    const newProduct = {
        id: generateId(),
        name,
        brand,
        category,
        price,
        original_price: price,
        rating: 0,
        description,
        image,
        images: [image],
        features: [],
        specifications: {},
        stock_status: "In Stock",
        tags: [category.toLowerCase()]
    };

    products.push(newProduct);
    saveProducts(products);

    form.reset();

    showToast("Product added successfully.", "success");

    displayAdmin();

    if (typeof initializeCategoryFilter === "function") {
        initializeCategoryFilter();
    }

    if (typeof displayProducts === "function") {
        displayProducts(getProducts());
    }
}

// Delete a product
function deleteAdminProduct(productId) {
    if (!isAdmin()) {
        showToast("Admin access required.", "error");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to remove this product?"
    );

    if (!confirmed) return;

    const products = getProducts().filter(
        product => Number(product.id) !== Number(productId)
    );

    saveProducts(products);

    // Remove product from wishlist and comparison
    const wishlist = getStoredData(WISHLIST_STORAGE_KEY, [])
        .filter(id => Number(id) !== Number(productId));

    saveStoredData(WISHLIST_STORAGE_KEY, wishlist);

    const comparison = getStoredData(COMPARE_STORAGE_KEY, [])
        .filter(id => Number(id) !== Number(productId));

    saveStoredData(COMPARE_STORAGE_KEY, comparison);

    showToast("Product removed successfully.", "success");

    displayAdmin();

    if (typeof displayProducts === "function") {
        displayProducts(getProducts());
    }
}

// Initialize admin dashboard
function initializeAdmin() {
    displayAdmin();
}