
// SHOWCASE - PRODUCT COMPARISON

function getComparisonList() {
    return getStoredData(STORAGE_KEYS.comparison);
}

function addToComparison(productId) {
    const comparison = getComparisonList();

    if (comparison.includes(productId)) {
        alert("This product is already in your comparison list!");
        return;
    }

    if (comparison.length >= 3) {
        alert("You can compare a maximum of 3 products at a time.");
        return;
    }

    const productExists = getProducts().some(
        product => product.id === productId
    );

    if (!productExists) {
        alert("Product not found!");
        return;
    }

    comparison.push(productId);
    saveStoredData(STORAGE_KEYS.comparison, comparison);

    displayComparison();
    alert("Product added to comparison!");
}

function removeFromComparison(productId) {
    const comparison = getComparisonList();

    const updatedComparison = comparison.filter(
        id => id !== productId
    );

    saveStoredData(STORAGE_KEYS.comparison, updatedComparison);
    displayComparison();
}

function displayComparison() {
    const container = document.getElementById("comparisonContainer");

    if (!container) return;

    const comparison = getComparisonList();

    const selectedProducts = getProducts().filter(
        product => comparison.includes(product.id)
    );

    if (selectedProducts.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                No products selected for comparison.
                Add products using the Compare button.
            </p>
        `;
        return;
    }

    const specifications = [
        { label: "Brand", key: "brand" },
        { label: "Category", key: "category" },
        { label: "Price", key: "price", format: value => `$${Number(value).toFixed(2)}` },
        { label: "Rating", key: "rating", format: value => `⭐ ${value} / 5` },
        { label: "Availability", key: "stock_status" },
        { label: "Description", key: "description" }
    ];

    container.innerHTML = `
        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Product Details</th>
                        ${selectedProducts.map(product => `
                            <th>
                                ${product.name}
                                <button
                                    class="remove-compare-btn"
                                    onclick="removeFromComparison(${product.id})"
                                    aria-label="Remove ${product.name} from comparison">
                                    ✕
                                </button>
                            </th>
                        `).join("")}
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>Image</th>
                        ${selectedProducts.map(product => `
                            <td>
                                <img
                                    src="${product.images[0]}"
                                    alt="${product.name}"
                                    width="120"
                                    onerror="this.onerror=null;this.src='https://placehold.co/300x200/eee8ff/6c45d9?text=Product'">
                            </td>
                        `).join("")}
                    </tr>

                    ${specifications.map(item => `
                        <tr>
                            <th>${item.label}</th>
                            ${selectedProducts.map(product => {
                                const value = product[item.key] ?? "Not available";
                                const formattedValue = item.format
                                    ? item.format(value)
                                    : value;

                                return `<td>${formattedValue}</td>`;
                            }).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function initializeComparison() {
    displayComparison();
}
