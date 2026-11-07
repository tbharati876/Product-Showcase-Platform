
// ==========================================
// SHOWCASE ADMIN DASHBOARD
// ==========================================

// Check whether the current user is an administrator
function isAdmin() {
    const user = getCurrentUser();
    return Boolean(user && user.role === "admin");
}

// Format dates
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

// Safely format values
function adminText(value, fallback = "Not available") {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    return escapeHTML(String(value));
}

// Get registered customers
function getAdminCustomers() {
    const users = getStoredData(STORAGE_KEYS.users, defaultUsers);

    return users.filter(user => user.role !== "admin");
}

// Get saved orders
function getAdminOrders() {
    const orders = getStoredData("showcase_orders", []);
    return Array.isArray(orders) ? orders : [];
}

// Get customer information from an order
function getOrderCustomer(order) {
    const customer = order.customer || order.customerDetails || order.user || {};

    return {
        name:
            customer.name ||
            order.customerName ||
            order.name ||
            "Guest Customer",

        email:
            customer.email ||
            order.customerEmail ||
            order.email ||
            "Not available",

        phone:
            customer.phone ||
            order.customerPhone ||
            order.phone ||
            "Not available"
    };
}

// Get products from an order
function getOrderProducts(order) {
    const items = order.items || order.products || order.cartItems || [];

    if (!Array.isArray(items) || items.length === 0) {
        return "Order details unavailable";
    }

    return items.map(item => {
        const name = item.name || item.productName || "Product";
        const quantity = Number(item.quantity || 1);

        return `${adminText(name)} (Qty: ${quantity})`;
    }).join("<br>");
}

// Get order total
function getOrderTotal(order) {
    return Number(
        order.total ??
        order.totalAmount ??
        order.grandTotal ??
        order.amount ??
        0
    );
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================

function displayAdminDashboard() {
    const container = document.getElementById("adminContainer");

    if (!container) return;

    if (!isAdmin()) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Access Denied</h3>
                <p>You must log in as an administrator to access this page.</p>
                <button class="btn-primary" onclick="showAuthPage('login')">
                    Login as Admin
                </button>
            </div>
        `;
        return;
    }

    const products = getProducts();
    const customers = getAdminCustomers();
    const orders = getAdminOrders();
    const reviews = getReviews();

    const totalRevenue = orders.reduce(
        (total, order) => total + getOrderTotal(order),
        0
    );

    container.innerHTML = `
        <div class="admin-dashboard">

            <div class="admin-header">
                <div>
                    <h2>ShowCase Admin Dashboard</h2>
                    <p>Manage customers, orders and your online store.</p>
                </div>

                <button class="btn-secondary" onclick="logoutUser()">
                    Logout
                </button>
            </div>

            <div class="admin-stats">

                <div class="stat-card">
                    <span>Total Products</span>
                    <h3>${products.length}</h3>
                </div>

                <div class="stat-card">
                    <span>Registered Customers</span>
                    <h3>${customers.length}</h3>
                </div>

                <div class="stat-card">
                    <span>Total Orders</span>
                    <h3>${orders.length}</h3>
                </div>

                <div class="stat-card">
                    <span>Total Revenue</span>
                    <h3>${formatPrice(totalRevenue)}</h3>
                </div>

            </div>

            <div class="admin-tabs">

                <button class="admin-tab active"
                    onclick="showAdminTab('overview', this)">
                    Overview
                </button>

                <button class="admin-tab"
                    onclick="showAdminTab('customers', this)">
                    Customer Accounts
                </button>

                <button class="admin-tab"
                    onclick="showAdminTab('orders', this)">
                    Customer Orders
                </button>

                <button class="admin-tab"
                    onclick="showAdminTab('products', this)">
                    Product Management
                </button>

            </div>

            <!-- OVERVIEW -->

            <div id="adminOverview" class="admin-tab-content">

                <div class="admin-panel">
                    <h3>Welcome to ShowCase Admin</h3>
                    <p>Here is your store's current activity.</p>

                    <div class="admin-overview-grid">

                        <div class="admin-overview-card">
                            <h4>Customer Accounts</h4>
                            <p>${customers.length} registered customers</p>
                            <button class="btn-primary"
                                onclick="showAdminTabById('customers')">
                                View Customers
                            </button>
                        </div>

                        <div class="admin-overview-card">
                            <h4>Customer Orders</h4>
                            <p>${orders.length} total orders</p>
                            <button class="btn-primary"
                                onclick="showAdminTabById('orders')">
                                View Orders
                            </button>
                        </div>

                        <div class="admin-overview-card">
                            <h4>Product Management</h4>
                            <p>${products.length} products in your store</p>
                            <button class="btn-primary"
                                onclick="showAdminTabById('products')">
                                Manage Products
                            </button>
                        </div>

                    </div>

                    <div class="admin-summary">
                        <h3>Store Summary</h3>
                        <p><strong>Customers:</strong> ${customers.length}</p>
                        <p><strong>Orders:</strong> ${orders.length}</p>
                        <p><strong>Products:</strong> ${products.length}</p>
                        <p><strong>Reviews:</strong> ${reviews.length}</p>
                        <p><strong>Revenue:</strong> ${formatPrice(totalRevenue)}</p>
                    </div>
                </div>

            </div>

            <!-- CUSTOMER ACCOUNTS -->

            <div id="adminCustomers" class="admin-tab-content" style="display:none">

                <div class="admin-panel">

                    <div class="admin-panel-header">
                        <div>
                            <h3>Customer Accounts</h3>
                            <p>All customers who registered on ShowCase.</p>
                        </div>

                        <span class="admin-count">
                            ${customers.length} Customers
                        </span>
                    </div>

                    <div class="table-responsive">

                        <table class="admin-table">

                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Customer Name</th>
                                    <th>Email Address</th>
                                    <th>Account Type</th>
                                    <th>Registration Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${
                                    customers.length
                                        ? customers.map((user, index) => `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td>${adminText(user.name)}</td>
                                                <td>${adminText(user.email)}</td>
                                                <td>Customer</td>
                                                <td>${formatRegistrationDate(user.createdAt)}</td>
                                            </tr>
                                        `).join("")
                                        : `
                                            <tr>
                                                <td colspan="5">
                                                    No registered customers found.
                                                </td>
                                            </tr>
                                        `
                                }
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            <!-- CUSTOMER ORDERS -->

            <div id="adminOrders" class="admin-tab-content" style="display:none">

                <div class="admin-panel">

                    <div class="admin-panel-header">
                        <div>
                            <h3>Customer Orders</h3>
                            <p>View orders placed by your customers.</p>
                        </div>

                        <span class="admin-count">
                            ${orders.length} Orders
                        </span>
                    </div>

                    <div class="table-responsive">

                        <table class="admin-table">

                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Products</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${
                                    orders.length
                                        ? orders.map((order, index) => {
                                            const customer = getOrderCustomer(order);

                                            return `
                                                <tr>
                                                    <td>${index + 1}</td>

                                                    <td>
                                                        ${adminText(order.id || order.orderId)}
                                                    </td>

                                                    <td>${adminText(customer.name)}</td>

                                                    <td>${adminText(customer.email)}</td>

                                                    <td>${adminText(customer.phone)}</td>

                                                    <td>${getOrderProducts(order)}</td>

                                                    <td>${formatPrice(getOrderTotal(order))}</td>

                                                    <td>
                                                        ${adminText(
                                                            order.paymentMethod ||
                                                            order.payment ||
                                                            order.payment_method
                                                        )}
                                                    </td>

                                                    <td>
                                                        ${adminText(
                                                            order.status ||
                                                            order.orderStatus,
                                                            "Placed"
                                                        )}
                                                    </td>

                                                    <td>
                                                        ${formatRegistrationDate(
                                                            order.createdAt ||
                                                            order.orderDate ||
                                                            order.date
                                                        )}
                                                    </td>
                                                </tr>
                                            `;
                                        }).join("")
                                        : `
                                            <tr>
                                                <td colspan="10">
                                                    No customer orders have been placed yet.
                                                </td>
                                            </tr>
                                        `
                                }
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            <!-- PRODUCT MANAGEMENT -->

            <div id="adminProducts" class="admin-tab-content" style="display:none">

                <div class="admin-panel">

                    <div class="admin-panel-header">
                        <div>
                            <h3>Product Management</h3>
                            <p>Add, update and remove store products.</p>
                        </div>

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
                                                        src="${adminText(getProductImage(product), "")}"
                                                        alt="${adminText(product.name)}"
                                                        class="admin-product-image"
                                                    >
                                                </td>

                                                <td>${adminText(product.name)}</td>
                                                <td>${adminText(product.category)}</td>
                                                <td>${formatPrice(product.price)}</td>
                                                <td>${adminText(product.stock_status || "Available")}</td>

                                                <td>
                                                    <button
                                                        class="btn-small btn-edit"
                                                        onclick="editProduct(${Number(product.id)})">
                                                        Edit
                                                    </button>

                                                    <button
                                                        class="btn-small btn-delete"
                                                        onclick="deleteProduct(${Number(product.id)})">
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

            </div>

        </div>
    `;
}

// ==========================================
// ADMIN TAB NAVIGATION
// ==========================================

function showAdminTab(tab, button) {
    if (!isAdmin()) return;

    const tabs = {
        overview: "adminOverview",
        customers: "adminCustomers",
        orders: "adminOrders",
        products: "adminProducts"
    };

    Object.values(tabs).forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.style.display = "none";
    });

    const selectedPanel = document.getElementById(tabs[tab]);

    if (selectedPanel) {
        selectedPanel.style.display = "block";
    }

    document.querySelectorAll(".admin-tab").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        const matchingButton = Array.from(
            document.querySelectorAll(".admin-tab")
        ).find(item => item.getAttribute("onclick").includes(`'${tab}'`));

        if (matchingButton) {
            matchingButton.classList.add("active");
        }
    }
}

function showAdminTabById(tab) {
    showAdminTab(tab, null);
}

// ==========================================
// ADD / EDIT PRODUCT FORM
// ==========================================

function showAddProductForm(product = null) {
    if (!isAdmin()) return;

    showAdminTabById("products");

    const formContainer = document.getElementById("adminProductForm");

    if (!formContainer) return;

    const editing = Boolean(product);

    formContainer.innerHTML = `
        <form id="adminProductFormElement" class="admin-product-form">

            <h3>${editing ? "Edit Product" : "Add New Product"}</h3>

            <div class="form-grid">

                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" id="adminProductName"
                        value="${editing ? adminText(product.name, "") : ""}" required>
                </div>

                <div class="form-group">
                    <label>Brand</label>
                    <input type="text" id="adminProductBrand"
                        value="${editing ? adminText(product.brand, "") : ""}" required>
                </div>

                <div class="form-group">
                    <label>Category</label>
                    <select id="adminProductCategory" required>
                        ${categories.map(category => `
                            <option value="${adminText(category.name, "")}"
                                ${editing && product.category === category.name ? "selected" : ""}>
                                ${adminText(category.name)}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <div class="form-group">
                    <label>Price</label>
                    <input type="number" id="adminProductPrice"
                        min="1" step="0.01"
                        value="${editing ? Number(product.price) : ""}" required>
                </div>

                <div class="form-group">
                    <label>Original Price</label>
                    <input type="number" id="adminProductOriginalPrice"
                        min="0" step="0.01"
                        value="${editing ? Number(product.originalPrice || product.price) : ""}">
                </div>

                <div class="form-group">
                    <label>Product Image URL</label>
                    <input type="url" id="adminProductImage"
                        value="${editing ? adminText(getProductImage(product), "") : ""}"
                        placeholder="https://example.com/product.jpg" required>
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
                    <input type="number" id="adminProductRating"
                        min="0" max="5" step="0.1"
                        value="${editing ? Number(product.rating || 0) : "4.5"}">
                </div>

            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea id="adminProductDescription" rows="4" required>${editing ? adminText(product.description, "") : ""}</textarea>
            </div>

            <div class="admin-form-actions">
                <button type="submit" class="btn-primary">
                    ${editing ? "Update Product" : "Save Product"}
                </button>

                <button type="button" class="btn-secondary"
                    onclick="cancelProductForm()">
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

// ==========================================
// SAVE PRODUCT
// ==========================================

function saveAdminProduct(productId = null) {
    if (!isAdmin()) return;

    const name = document.getElementById("adminProductName").value.trim();
    const brand = document.getElementById("adminProductBrand").value.trim();
    const category = document.getElementById("adminProductCategory").value;
    const price = Number(document.getElementById("adminProductPrice").value);

    const originalPrice =
        Number(document.getElementById("adminProductOriginalPrice").value) || price;

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
        products.unshift({
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
        });

        showToast("Product added successfully!", "success");
    }

    saveStoredData(STORAGE_KEYS.products, products);

    if (typeof window.products !== "undefined") {
        window.products = products;
    }

    displayAdminDashboard();
    showAdminTabById("products");

    if (typeof displayProducts === "function") displayProducts();
    if (typeof displayFeaturedProducts === "function") displayFeaturedProducts();
    if (typeof displayCategories === "function") displayCategories();
}

// ==========================================
// EDIT PRODUCT
// ==========================================

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

// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(productId) {
    if (!isAdmin()) return;

    const confirmed = confirm("Are you sure you want to delete this product?");

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
    showAdminTabById("products");

    if (typeof displayProducts === "function") displayProducts();
    if (typeof displayFeaturedProducts === "function") displayFeaturedProducts();
}

// ==========================================
// CANCEL PRODUCT FORM
// ==========================================

function cancelProductForm() {
    const formContainer = document.getElementById("adminProductForm");

    if (formContainer) {
        formContainer.innerHTML = "";
    }
}

// ==========================================
// INITIALIZE ADMIN
// ==========================================

function initializeAdmin() {
    displayAdminDashboard();
}
