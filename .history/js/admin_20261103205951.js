
// SHOWCASE - ADMIN PRODUCT MANAGEMENT

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

function displayAdminProducts() {
    const adminProductList = document.getElementById("adminProductList");

    if (!adminProductList) return;

    if (!isAdmin()) {
        adminProductList.innerHTML = `
            <p class="empty-message">Admin access is required.</p>
        `;
        return;
    }

    const products = getProducts();

    if (products.length === 0) {
        adminProductList.innerHTML = `
            <p class="empty-message">No products available.</p>
        `;
        return;
    }

    adminProductList.innerHTML = `
        <div class="admin-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.category}</td>
                            <td>$${Number(product.price).toFixed(2)}</td>
                            <td>${product.stock_status}</td>
                            <td>
                                <button onclick="editProduct(${product.id})">
                                    Edit
                                </button>
                                <button onclick="deleteProduct(${product.id})">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function addProduct(event) {
    event.preventDefault();

    if (!isAdmin()) {
        alert("Only administrators can add products.");
        return;
    }

    const name = document.getElementById("adminProductName").value.trim();
    const category = document.getElementById("adminProductCategory").value;
    const price = Number(document.getElementById("adminProductPrice").value);
    const image = document.getElementById("adminProductImage").value.trim();
    const description = document.getElementById("adminProductDescription").value.trim();
    const brand = document.getElementById("adminProductBrand").value.trim();
    const stock = document.getElementById("adminProductStock").value;

    if (!name || !category || !image || !description || !brand ||
        !Number.isFinite(price) || price <= 0) {
        alert("Please enter valid information in all product fields.");
        return;
    }

    const products = getProducts();

    const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        brand,
        description,
        images: [image],
        rating: 0,
        stock_status: stock,
        features: [],
        specifications: {},
        tags: [category.toLowerCase(), brand.toLowerCase()]
    };

    products.push(newProduct);

    saveStoredData(STORAGE_KEYS.products, products);

    document.getElementById("adminProductForm").reset();

    refreshProductViews();

    alert("Product added successfully!");
}

function editProduct(productId) {
    if (!isAdmin()) {
        alert("Admin access required.");
        return;
    }

    const products = getProducts();
    const product = products.find(item => item.id === productId);

    if (!product) {
        alert("Product not found.");
        return;
    }

    const updatedName = prompt("Enter product name:", product.name);
    if (updatedName === null) return;

    const updatedPrice = prompt("Enter product price:", product.price);
    if (updatedPrice === null) return;

    const updatedDescription = prompt(
        "Enter product description:",
        product.description
    );
    if (updatedDescription === null) return;

    const price = Number(updatedPrice);

    if (!updatedName.trim() || !Number.isFinite(price) || price <= 0 ||
        !updatedDescription.trim()) {
        alert("Invalid product information.");
        return;
    }

    product.name = updatedName.trim();
    product.price = price;
    product.description = updatedDescription.trim();

    saveStoredData(STORAGE_KEYS.products, products);

    refreshProductViews();

    alert("Product updated successfully!");
}

function deleteProduct(productId) {
    if (!isAdmin()) {
        alert("Admin access required.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const products = getProducts().filter(
        product => product.id !== productId
    );

    saveStoredData(STORAGE_KEYS.products, products);

    const wishlist = getWishlist().filter(id => id !== productId);
    saveStoredData(STORAGE_KEYS.wishlist, wishlist);

    const comparison = getComparisonList().filter(id => id !== productId);
    saveStoredData(STORAGE_KEYS.comparison, comparison);

    const reviews = getReviews().filter(
        review => review.productId !== productId
    );
    saveStoredData(STORAGE_KEYS.reviews, reviews);

    refreshProductViews();

    alert("Product deleted successfully!");
}

function refreshProductViews() {
    displayCategories();
    displayFeaturedProducts();
    displayProducts();
    displayWishlist();
    displayComparison();
    displayReviews();
    displayAdminProducts();
}

function initializeAdmin() {
    const adminProductForm = document.getElementById("adminProductForm");

    if (adminProductForm) {
        adminProductForm.addEventListener("submit", addProduct);
    }

    displayAdminProducts();
}
