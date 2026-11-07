// ==========================================
// SHOWCASE - PRODUCT COMPARISON
// ==========================================

const COMPARE_KEY = "showcase_compare";
const MAX_COMPARE_PRODUCTS = 4;

// Get comparison product IDs
function getCompareList() {
    const compareList = getStoredData(COMPARE_KEY, []);
    return Array.isArray(compareList) ? compareList : [];
}

// Save comparison product IDs
function saveCompareList(compareList) {
    saveStoredData(COMPARE_KEY, compareList);
}

// Check whether a product is in comparison
function isInCompare(productId) {
    return getCompareList().some(
        id => Number(id) === Number(productId)
    );
}

// Add or remove a product from comparison
function addToCompare(productId) {
    const compareList = getCompareList();
    const existingIndex = compareList.findIndex(
        id => Number(id) === Number(productId)
    );

    if (existingIndex !== -1) {
        compareList.splice(existingIndex, 1);
        saveCompareList(compareList);

        if (typeof showToast === "function") {
            showToast("Product removed from comparison.", "success");
        }
    } else {
        if (compareList.length >= MAX_COMPARE_PRODUCTS) {
            if (typeof showToast === "function") {
                showToast(
                    `You can compare up to ${MAX_COMPARE_PRODUCTS} products.`,
                    "warning"
                );
            }
            return;
        }

        const productExists = getProducts().some(
            product => Number(product.id) === Number(productId)
        );

        if (!productExists) {
            if (typeof showToast === "function") {
                showToast("Product not found.", "error");
            }
            return;
        }

        compareList.push(productId);
        saveCompareList(compareList);

        if (typeof showToast === "function") {
            showToast("Product added to comparison.", "success");
        }
    }

    if (typeof displayProducts === "function") {
        displayProducts(
            currentProductList.length
                ? currentProductList
                : getProducts()
        );
    }

    if (typeof displayComparison === "function") {
        displayComparison();
    }
}

// Remove one product from comparison
function removeFromCompare(productId) {
    const updatedList = getCompareList().filter(
        id => Number(id) !== Number(productId)
    );

    saveCompareList(updatedList);
    displayComparison();

    if (typeof displayProducts === "function") {
        displayProducts(
            currentProductList.length
                ? currentProductList
                : getProducts()
        );
    }

    if (typeof showToast === "function") {
        showToast("Product removed from comparison.", "success");
    }
}

// Clear all comparison products
function clearComparison() {
    saveCompareList([]);
    displayComparison();

    if (typeof displayProducts === "function") {
        displayProducts(
            currentProductList.length
                ? currentProductList
                : getProducts()
        );
    }

    if (typeof showToast === "function") {
        showToast("Comparison list cleared.", "success");
    }
}

// Get complete comparison products
function getComparisonProducts() {
    const compareIds = getCompareList();

    return getProducts().filter(product =>
        compareIds.some(id => Number(id) === Number(product.id))
    );
}

// Display comparison table
function displayComparison() {
    const container = document.getElementById("compareContent");

    if (!container) return;

    const products = getComparisonProducts();

    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Products to Compare</h3>
                <p>Add products from the Discover Products section to compare them here.</p>
                <button class="btn btn-primary" onclick="showSection('products')">
                    Discover Products
                </button>
            </div>
        `;
        return;
    }

    const rows = [
        {
            label: "Product",
            value: product => `
                <div class="compare-product">
                    <img
                        src="${escapeHTML(getProductImage(product))}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.onerror=null;this.src='https://placehold.co/300x300?text=Product';"
                    >
                    <h4>${escapeHTML(product.name)}</h4>
                    <button
                        class="btn btn-small btn-primary"
                        onclick="viewProductDetails(${Number(product.id)})"
                    >
                        View Product
                    </button>
                </div>
            `
        },
        {
            label: "Brand",
            value: product => escapeHTML(product.brand || "Not specified")
        },
        {
            label: "Category",
            value: product => escapeHTML(product.category || "Not specified")
        },
        {
            label: "Price",
            value: product => `
                <strong>${formatPrice(product.price)}</strong>
                ${
                    product.original_price &&
                    Number(product.original_price) > Number(product.price)
                        ? `<br><del>${formatPrice(product.original_price)}</del>`
                        : ""
                }
            `
        },
        {
            label: "Rating",
            value: product => `
                ⭐ ${Number(product.rating || 0).toFixed(1)} / 5
            `
        },
        {
            label: "Availability",
            value: product => escapeHTML(product.stock_status || "Available")
        },
        {
            label: "Description",
            value: product => escapeHTML(product.description || "No description available.")
        },
        {
            label: "Features",
            value: product => {
                const features = Array.isArray(product.features)
                    ? product.features
                    : [];

                return features.length
                    ? `<ul>${features.map(feature =>
                        `<li>${escapeHTML(feature)}</li>`
                    ).join("")}</ul>`
                    : "Not specified";
            }
        },
        {
            label: "Specifications",
            value: product => {
                const specifications = product.specifications || {};

                if (
                    typeof specifications !== "object" ||
                    Object.keys(specifications).length === 0
                ) {
                    return "Not specified";
                }

                return `
                    <ul>
                        ${Object.entries(specifications).map(([key, value]) => `
                            <li>
                                <strong>${escapeHTML(key)}:</strong>
                                ${escapeHTML(String(value))}
                            </li>
                        `).join("")}
                    </ul>
                `;
            }
        },
        {
            label: "Action",
            value: product => `
                <div class="compare-actions">
                    <button
                        class="btn btn-primary btn-small"
                        onclick="addToCart(${Number(product.id)})"
                    >
                        Add to Cart
                    </button>

                    <button
                        class="btn btn-danger btn-small"
                        onclick="removeFromCompare(${Number(product.id)})"
                    >
                        Remove
                    </button>
                </div>
            `
        }
    ];

    container.innerHTML = `
        <div class="comparison-header">
            <div>
                <h3>Compare Products</h3>
                <p>${products.length} of ${MAX_COMPARE_PRODUCTS} products selected</p>
            </div>

            <button
                class="btn btn-secondary"
                onclick="clearComparison()"
            >
                Clear All
            </button>
        </div>

        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <tbody>
                    ${rows.map(row => `
                        <tr>
                            <th>${row.label}</th>
                            ${products.map(product => `
                                <td>${row.value(product)}</td>
                            `).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>

        ${
            products.length < MAX_COMPARE_PRODUCTS
                ? `<p class="compare-hint">You can add ${MAX_COMPARE_PRODUCTS - products.length} more product(s) to compare.</p>`
                : ""
        }
    `;
}

// Initialize comparison section
function initializeComparison() {
    displayComparison();
}