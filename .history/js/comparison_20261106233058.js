
// ==========================================
// SHOWCASE - PRODUCT COMPARISON MODULE
// ==========================================

// Maximum products allowed in comparison.
const MAX_COMPARE_PRODUCTS = 4;

// ==========================================
// GET COMPARISON LIST
// ==========================================

function getComparison() {
  const comparison = getStoredData(STORAGE_KEYS.comparison, []);

  return Array.isArray(comparison)
    ? comparison.map(Number)
    : [];
}

// ==========================================
// SAVE COMPARISON LIST
// ==========================================

function saveComparison(comparison) {
  return saveStoredData(STORAGE_KEYS.comparison, comparison);
}

// ==========================================
// ADD PRODUCT TO COMPARISON
// ==========================================

function addToComparison(productId) {
  productId = Number(productId);

  const product = getProducts().find(
    item => Number(item.id) === productId
  );

  if (!product) {
    showToast("Product not found", "error");
    return;
  }

  const comparison = getComparison();

  if (comparison.includes(productId)) {
    showToast("Product is already in comparison", "info");
    return;
  }

  if (comparison.length >= MAX_COMPARE_PRODUCTS) {
    showToast(
      `You can compare a maximum of ${MAX_COMPARE_PRODUCTS} products`,
      "error"
    );
    return;
  }

  comparison.push(productId);
  saveComparison(comparison);

  showToast("Product added to comparison!", "success");

  displayComparison();
}

// ==========================================
// REMOVE PRODUCT FROM COMPARISON
// ==========================================

function removeFromComparison(productId) {
  productId = Number(productId);

  const updatedComparison = getComparison().filter(
    id => id !== productId
  );

  saveComparison(updatedComparison);

  showToast("Product removed from comparison", "success");

  displayComparison();

  if (typeof applyProductFilters === "function") {
    applyProductFilters();
  }

  if (typeof displayFeaturedProducts === "function") {
    displayFeaturedProducts();
  }
}

// ==========================================
// CLEAR COMPARISON
// ==========================================

function clearComparison() {
  saveComparison([]);

  displayComparison();

  if (typeof applyProductFilters === "function") {
    applyProductFilters();
  }

  if (typeof displayFeaturedProducts === "function") {
    displayFeaturedProducts();
  }

  showToast("Comparison list cleared", "success");
}

// ==========================================
// COMPARISON TABLE
// ==========================================

function displayComparison() {
  const container = document.getElementById("comparisonContainer");

  if (!container) return;

  const comparisonIds = getComparison();

  const comparisonProducts = getProducts().filter(product =>
    comparisonIds.includes(Number(product.id))
  );

  if (comparisonProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">

        <div class="empty-state-icon">⇄</div>

        <h3>No Products to Compare</h3>

        <p>
          Add products to your comparison list to see their features,
          prices and specifications side by side.
        </p>

        <button
          class="btn-primary"
          onclick="showSection('products')"
        >
          Explore Products
        </button>

      </div>
    `;

    return;
  }

  const specificationKeys = new Set();

  comparisonProducts.forEach(product => {
    Object.keys(product.specifications || {}).forEach(key => {
      specificationKeys.add(key);
    });
  });

  const specificationRows = [...specificationKeys].map(key => `
    <tr>
      <th>${escapeHTML(key)}</th>

      ${comparisonProducts.map(product => `
        <td>
          ${escapeHTML(
            product.specifications?.[key] || "Not specified"
          )}
        </td>
      `).join("")}

    </tr>
  `).join("");

  container.innerHTML = `
    <div class="comparison-wrapper">

      <div class="comparison-heading">

        <div>
          <h3>Product Comparison</h3>
          <p>Compare product features and choose the right one.</p>
        </div>

        <button
          class="btn-clear"
          onclick="clearComparison()"
        >
          Clear All
        </button>

      </div>

      <div class="comparison-table-container">

        <table class="comparison-table">

          <thead>

            <tr>

              <th>Product Details</th>

              ${comparisonProducts.map(product => `
                <th>

                  <div class="comparison-product">

                    <div class="comparison-product-image">
                      ${productImageHTML(product)}
                    </div>

                    <h4>${escapeHTML(product.name)}</h4>

                    <p>${escapeHTML(product.brand || "")}</p>

                    <button
                      class="btn-remove-compare"
                      onclick="removeFromComparison(${Number(product.id)})"
                    >
                      Remove
                    </button>

                  </div>

                </th>
              `).join("")}

            </tr>

          </thead>

          <tbody>

            <tr>
              <th>Price</th>

              ${comparisonProducts.map(product => `
                <td class="comparison-price">
                  ${formatPrice(product.price)}
                </td>
              `).join("")}
            </tr>

            <tr>
              <th>Original Price</th>

              ${comparisonProducts.map(product => `
                <td>
                  ${formatPrice(product.originalPrice || product.price)}
                </td>
              `).join("")}
            </tr>

            <tr>
              <th>Category</th>

              ${comparisonProducts.map(product => `
                <td>${escapeHTML(product.category)}</td>
              `).join("")}
            </tr>

            <tr>
              <th>Rating</th>

              ${comparisonProducts.map(product => `
                <td>
                  ★ ${Number(product.rating || 0).toFixed(1)}
                  (${Number(product.reviewsCount) || 0} reviews)
                </td>
              `).join("")}
            </tr>

            <tr>
              <th>Availability</th>

              ${comparisonProducts.map(product => `
                <td>${escapeHTML(product.stock_status || "In Stock")}</td>
              `).join("")}
            </tr>

            <tr>
              <th>Description</th>

              ${comparisonProducts.map(product => `
                <td class="comparison-description">
                  ${escapeHTML(product.description || "No description available")}
                </td>
              `).join("")}
            </tr>

            ${specificationRows}

            <tr>
              <th>Actions</th>

              ${comparisonProducts.map(product => `
                <td>
                  <button
                    class="btn-view"
                    onclick="viewProduct(${Number(product.id)})"
                  >
                    View Details
                  </button>

                  <button
                    class="btn-cart"
                    onclick="addToCart(${Number(product.id)})"
                  >
                    Add to Cart
                  </button>
                </td>
              `).join("")}

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  `;
}

// ==========================================
// INITIALIZE COMPARISON
// ==========================================

function initializeComparison() {
  displayComparison();
}
