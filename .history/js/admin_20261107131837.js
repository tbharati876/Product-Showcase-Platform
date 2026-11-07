
// Check whether the current user is an administrator
function isAdmin() {
    const user = getCurrentUser();
    return Boolean(user && user.role === "admin");
}

// Format registration date
function formatRegistrationDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// Display the admin dashboard
function displayAdminDashboard() {
    const container = document.getElementById("adminContainer");

    if (!container) return;

    if (!isAdmin()) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Access Denied</h3>
                <p>You must be logged in as an administrator to access this page.</p>
                <button class="btn-primary" onclick="showAuthPage('login')">
                    Login as Admin
                </button>
            </div>
        `;
        return;
    }

    const products = getProducts();
    const users = getStoredData(STORAGE_KEYS.users, defaultUsers);
    const reviews = getReviews();

    const orders = getStoredData("showcase_orders", []);
    const totalRevenue = orders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    const customerCount = users.filter(
        user => user.role !== "admin"
    ).length;

    container.innerHTML = `
        <div class="admin-dashboard">

            <div class="admin-header">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p>Manage your ShowCase store and registered users.</p>
                </div>

                <button class="btn-primary" onclick="showSection('products')">
                    View Store
                </button>
            </div>

            <div class="admin-stats">

                <div class="stat-card">
                    <span>Total Products</span>
                    <h3>${products.length}</h3>
                </div>

                <div class="stat-card">
                    <span>Registered Customers</span>
                    <h3>${customerCount}</h3>
                </div>

                <div class="stat-card">
                    <span>Total Reviews</span>
                    <h3>${reviews.length}</h3>
                </div>

                <div class="stat-card">
                    <span>Total Revenue</span>
                    <h3>${formatPrice(totalRevenue)}</h3>
                </div>

            </div>

            <div class="admin-panel">

                <div class="admin-panel-header">
                    <h3>Product Management</h3>

                    <button class="btn-primary" onclick="showAddProductForm()">
                        + Add Product
                    </button>
                </div>

                <div id="adminProductForm"></div>

                <div class="table-responsive">
                    <table class="admin-table">

                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${
                                products.length
                                    ? products.map(product => `
                                        <tr>
                                            <td>
                                                <img
                                                    src="${escapeHTML(getProductImage(product))}"
                                                    alt="${escapeHTML(product.name)}"
                                                    class="admin-product-image"
                                                >
                                            </td>

                                            <td>${escapeHTML(product.name)}</td>
                                            <td>${escapeHTML(product.category)}</td>
                                            <td>${formatPrice(product.price)}</td>
                                            <td>${escapeHTML(product.stock_status || "Available")}</td>

                                            <td>
                                                <button
                                                    class="btn-small btn-edit"
                                                    onclick="editProduct(${Number(product.id)})"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    class="btn-small btn-delete"
                                                    onclick="deleteProduct(${Number(product.id)})"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    `).join("")
                                    : `
                                        <tr>
                                            <td colspan="6">No products available.</td>
                                        </tr>
                                    `
                            }
                        </tbody>

                    </table>
                </div>

            </div>

            <div class="admin-panel">

                <div class="admin-panel-header">
                    <div>
                        <h3>Registered Users</h3>
                        <p>View customers who have registered on ShowCase.</p>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="admin-table">

                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registration Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${
                                users.length
                                    ? users.map((user, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${escapeHTML(user.name || "Not available")}</td>
                                            <td>${escapeHTML(user.email || "Not available")}</td>
                                            <td>${escapeHTML(user.role || "customer")}</td>
                                            <td>${formatRegistrationDate(user.createdAt)}</td>
                                        </tr>
                                    `).join("")
                                    : `
                                        <tr>
                                            <td colspan="5">No registered users found.</td>
                                        </tr>
                                    `
                            }
                        </tbody>

                    </table>
                </div>

            </div>

        </div>
    `;
}

// Display add product form
function showAddProductForm(product = null) {
    if (!isAdmin()) return;

    const formContainer = document.getElementById("adminProductForm");

    if (!formContainer) return;

    const editing = Boolean(product);

    formContainer.innerHTML = `
        <form id="adminProductFormElement" class="admin-product-form">

            <h3>${editing ? "Edit Product" : "Add New Product"}</h3>

            <div class="form-grid">

                <div class="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        id="adminProductName"
                        value="${editing ? escapeHTML(product.name) : ""}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>Brand</label>
                    <input
                        type="text"
                        id="adminProductBrand"
                        value="${editing ? escapeHTML(product.brand || "") : ""}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>Category</label>
                    <select id="adminProductCategory" required>
                        ${categories.map(category => `
                            <option
                                value="${escapeHTML(category.name)}"
                                ${editing && product.category === category.name ? "selected" : ""}
                            >
                                ${escapeHTML(category.name)}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <div class="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        id="adminProductPrice"
                        min="1"
                        step="0.01"
                        value="${editing ? Number(product.price) : ""}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>Original Price</label>
                    <input
                        type="number"
                        id="adminProductOriginalPrice"
                        min="0"
                        step="0.01"
                        value="${editing ? Number(product.originalPrice || product.price) : ""}"
                    >
                </div>

                <div class="form-group">
                    <label>Product Image URL</label>
                    <input
                        type="url"
                        id="adminProductImage"
                        value="${editing ? escapeHTML(getProductImage(product)) : ""}"
                        placeholder="https://example.com/product.jpg"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>Stock Status</label>
                    <select id="adminProductStock">
                        <option value="In Stock" ${editing && product.stock_status === "In Stock" ? "selected" : ""}>In Stock</option>
                        <option value="Out of Stock" ${editing && product.stock_status === "Out of Stock" ? "selected" : ""}>Out of Stock</option>
                        <option value="Limited Stock" ${editing && product.stock_status === "Limited Stock" ? "selected" : ""}>Limited Stock</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Rating</label>
                    <input
                        type="number"
                        id="adminProductRating"
                        min="0"
                        max="5"
                        step="0.1"
                        value="${editing ? Number(product.rating || 0) : "4.5"}"
                    >
                </div>

            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea id="adminProductDescription" rows="4" required>${editing ? escapeHTML(product.description || "") : ""}</textarea>
            </div>

            <div class="admin-form-actions">
                <button type="submit" class="btn-primary">
                    ${editing ? "Update Product" : "Save Product"}
                </button>

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="cancelProductForm()"
                >
                    Cancel
                </button>
            </div>

        </form>
    `;

    document.getElementById("adminProductFormElement")
        .addEventListener("submit", function(event) {
            event.preventDefault();
            saveAdminProduct(product ? product.id : null);
        });

    formContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Save or update product
function saveAdminProduct(productId = null) {
    if (!isAdmin()) return;

    const name = document.getElementById("adminProductName").value.trim();
    const brand = document.getElementById("adminProductBrand").value.trim();
    const category = document.getElementById("adminProductCategory").value;
    const price = Number(document.getElementById("adminProductPrice").value);

    const originalPrice = Number(
        document.getElementById("adminProductOriginalPrice").value
    ) || price;

    const image = document.getElementById("adminProductImage").value.trim();
    const stock = document.getElementById("adminProductStock").value;
    const rating = Number(document.getElementById("adminProductRating").value);
    const description = document.getElementById("adminProductDescription").value.trim();

    if (!name || !brand || !image || !description || price <= 0) {
        showToast("Please complete all required product fields.", "error");
        return;
    }

    if (!/^https?:\/\//i.test(image)) {
        showToast("Please enter a valid image URL.", "error");
        return;
    }

    if (rating < 0 || rating > 5) {
        showToast("Rating must be between 0 and 5.", "error");
        return;
    }

    const products = getProducts();

    if (productId !== null) {
        const index = products.findIndex(
            product => Number(product.id) === Number(productId)
        );

        if (index === -1) return;

        products[index] = {
            ...products[index],
            name,
            brand,
            category,
            price,
            originalPrice,
            images: [image],
            rating,
            description,
            stock_status: stock
        };

        showToast("Product updated successfully!", "success");

    } else {
        const newProduct = {
            id: Date.now(),
            name,
            brand,
            category,
            price,
            originalPrice,
            rating,
            reviewsCount: 0,
            images: [image],
            description,
            stock_status: stock,
            features: [],
            specifications: {},
            tags: [category.toLowerCase()]
        };

        products.unshift(newProduct);

        showToast("Product added successfully!", "success");
    }

    saveStoredData(STORAGE_KEYS.products, products);

    if (typeof window.products !== "undefined") {
        window.products = products;
    }

    displayAdminDashboard();
    displayProducts();
    displayFeaturedProducts();
    displayCategories();
}

// Edit product
function editProduct(productId) {
    if (!isAdmin()) return;

    const product = getProducts().find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) {
        showToast("Product not found.", "error");
        return;
    }

    showAddProductForm(product);
}

// Delete product
function deleteProduct(productId) {
    if (!isAdmin()) return;

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const products = getProducts().filter(
        product => Number(product.id) !== Number(productId)
    );

    saveStoredData(STORAGE_KEYS.products, products);

    if (typeof window.products !== "undefined") {
        window.products = products;
    }

    showToast("Product deleted successfully.", "success");

    displayAdminDashboard();
    displayProducts();
    displayFeaturedProducts();
}

// Cancel product form
function cancelProductForm() {
    const formContainer = document.getElementById("adminProductForm");

    if (formContainer) {
        formContainer.innerHTML = "";
    }
}

// Initialize admin dashboard
function initializeAdmin() {
    displayAdminDashboard();
}
