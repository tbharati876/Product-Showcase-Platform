
// ==========================================
// SHOWCASE - PRODUCTS MODULE
// ==========================================

// Get all products from local storage.
function getProducts() {
  return getStoredData(STORAGE_KEYS.products, products);
}

// Format prices in Indian Rupees.
function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(price) || 0);
}

// Safely display text inside HTML.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

// Get the first product image.
function getProductImage(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  if (typeof product.images === "string" && product.images.trim()) {
    return product.images;
  }

  return "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";
}

// Display product image with fallback.
function productImageHTML(product, extraClass = "") {
  const image = escapeHTML(getProductImage(product));
  const name = escapeHTML(product.name);

  return `
    <img
      class="${extraClass}"
      src="${image}"
      alt="${name}"
      loading="lazy"
      onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85';"
    >
  `;
}

// ==========================================
// PRODUCT CARD
// ==========================================

function createProductCard(product) {
  const isWishlisted =
    typeof getWishlist === "function" &&
    getWishlist().includes(Number(product.id));

  const isCompared =
    typeof getComparison === "function" &&
    getComparison().includes(Number(product.id));

  const rating = Number(product.rating) || 0;
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || 0;

  return `
    <article class="product-card">

      <div class="product-image">

        ${productImageHTML(product)}

        <span class="product-badge">
          ${originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100) + "% OFF"
            : "POPULAR"}
        </span>

        <button
          class="wishlist-icon ${isWishlisted ? "active" : ""}"
          onclick="handleWishlist(${Number(product.id)})"
          title="Add to Wishlist"
          aria-label="Add to Wishlist"
        >
          ${isWishlisted ? "♥" : "♡"}
        </button>

      </div>

      <div class="product-card-body">

        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <h3>${escapeHTML(product.name)}</h3>

        <p class="product-brand">
          ${escapeHTML(product.brand || "ShowCase")}
        </p>

        <div class="product-rating">
          <span>★</span>
          <strong>${rating.toFixed(1)}</strong>
          <small>(${Number(product.reviewsCount) || 0} reviews)</small>
        </div>

        <div class="product-price">

          <strong>${formatPrice(price)}</strong>

          ${originalPrice > price
            ? `<del>${formatPrice(originalPrice)}</del>`
            : ""}

        </div>

        <p class="product-stock">
          ${escapeHTML(product.stock_status || "In Stock")}
        </p>

        <div class="product-actions">

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

        </div>

        <button
          class="btn-compare ${isCompared ? "active" : ""}"
          onclick="handleComparison(${Number(product.id)})"
        >
          ${isCompared ? "✓ Added to Compare" : "⇄ Compare"}
        </button>

      </div>

    </article>
  `;
}

// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList = getProducts()) {
  const productGrid = document.getElementById("productGrid");
  const noProducts = document.getElementById("noProducts");

  if (!productGrid) return;

  if (!productList.length) {
    productGrid.innerHTML = "";

    if (noProducts) {
      noProducts.style.display = "block";
      noProducts.innerHTML = `
        <h3>No products found</h3>
        <p>Try another search or select a different category.</p>
      `;
    }

    return;
  }

  if (noProducts) {
    noProducts.style.display = "none";
  }

  productGrid.innerHTML = productList
    .map(product => createProductCard(product))
    .join("");
}

// ==========================================
// CATEGORY CARD
// ==========================================

function createCategoryCard(category) {
  return `
    <article
      class="category-card"
      onclick="filterByCategory('${escapeHTML(category.name)}')"
      role="button"
      tabindex="0"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();filterByCategory('${escapeHTML(category.name)}');}"
    >

      <img
        src="${escapeHTML(category.image)}"
        alt="${escapeHTML(category.name)}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85';"
      >

      <div class="category-card-content">

        <span class="category-icon">
          ${category.icon}
        </span>

        <h3>${escapeHTML(category.name)}</h3>

        <p>${escapeHTML(category.description)}</p>

        <span class="category-shop-link">
          Shop Now →
        </span>

      </div>

    </article>
  `;
}

// ==========================================
// DISPLAY CATEGORIES
// ==========================================

function displayCategories() {
  const categoryGrid = document.getElementById("categoryGrid");
  const allCategories = document.getElementById("allCategories");

  const categoryHTML = categories
    .map(category => createCategoryCard(category))
    .join("");

  if (categoryGrid) {
    categoryGrid.innerHTML = categoryHTML;
  }

  if (allCategories) {
    allCategories.innerHTML = categoryHTML;
  }
}

// ==========================================
// CATEGORY FILTERING
// ==========================================

function filterByCategory(categoryName) {
  const categoryFilter = document.getElementById("categoryFilter");

  if (categoryFilter) {
    categoryFilter.value = categoryName;
  }

  const activeCategory = document.getElementById("activeCategory");

  if (activeCategory) {
    activeCategory.textContent = `Showing: ${categoryName}`;
  }

  applyProductFilters();

  if (typeof showSection === "function") {
    showSection("products");
  } else {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth"
    });
  }
}

// ==========================================
// SEARCH AND SORT
// ==========================================

function applyProductFilters() {
  let filteredProducts = getProducts();

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const selectedCategory = categoryFilter
    ? categoryFilter.value
    : "all";

  const sortValue = sortFilter
    ? sortFilter.value
    : "default";

  // Search products.
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product => {
      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.description,
        ...(product.tags || [])
      ].join(" ").toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  // Filter category.
  if (selectedCategory && selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  // Sort products.
  switch (sortValue) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;

    case "name":
      filteredProducts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "default":
    default:
      break;
  }

  const activeCategory = document.getElementById("activeCategory");

  if (activeCategory) {
    activeCategory.textContent =
      selectedCategory !== "all"
        ? `Showing: ${selectedCategory}`
        : "Showing All Products";
  }

  displayProducts(filteredProducts);
}

// ==========================================
// RESET FILTERS
// ==========================================

function resetProductFilters() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";
  if (sortFilter) sortFilter.value = "default";

  applyProductFilters();
}

// ==========================================
// FEATURED PRODUCTS
// ==========================================

function displayFeaturedProducts() {
  const featuredContainer = document.getElementById("featuredProducts");

  if (!featuredContainer) return;

  const featuredProducts = getProducts()
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  featuredContainer.innerHTML = featuredProducts
    .map(product => createProductCard(product))
    .join("");
}

// ==========================================
// PRODUCT DETAILS MODAL
// ==========================================

function viewProduct(productId) {
  const product = getProducts().find(
    item => Number(item.id) === Number(productId)
  );

  if (!product) {
    showToast("Product not found", "error");
    return;
  }

  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("productModalContent");

  if (!modal || !modalContent) return;

  const features = (product.features || [])
    .map(feature => `<li>✓ ${escapeHTML(feature)}</li>`)
    .join("");

  const specifications = Object.entries(product.specifications || {})
    .map(([key, value]) => `
      <div class="specification-row">
        <strong>${escapeHTML(key)}</strong>
        <span>${escapeHTML(value)}</span>
      </div>
    `)
    .join("");

  const images = Array.isArray(product.images) ? product.images : [];

  modalContent.innerHTML = `
    <div class="product-detail-layout">

      <div class="product-detail-image">

        ${productImageHTML(product)}

      </div>

      <div class="product-detail-info">

        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <h2>${escapeHTML(product.name)}</h2>

        <p class="product-brand">
          Brand: ${escapeHTML(product.brand)}
        </p>

        <div class="product-rating">
          <span>★</span>
          <strong>${Number(product.rating || 0).toFixed(1)}</strong>
          <small>(${Number(product.reviewsCount) || 0} reviews)</small>
        </div>

        <div class="product-price">
          <strong>${formatPrice(product.price)}</strong>
          ${product.originalPrice > product.price
            ? `<del>${formatPrice(product.originalPrice)}</del>`
            : ""}
        </div>

        <p>${escapeHTML(product.description)}</p>

        <h3>Product Features</h3>
        <ul class="product-feature-list">
          ${features}
        </ul>

        <h3>Specifications</h3>
        <div class="product-specifications">
          ${specifications}
        </div>

        <p class="product-stock">
          ${escapeHTML(product.stock_status || "In Stock")}
        </p>

        <button
          class="btn-cart"
          onclick="addToCart(${Number(product.id)})"
        >
          Add to Cart
        </button>

      </div>

    </div>
  `;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  const modal = document.getElementById("productModal");

  if (modal) {
    modal.style.display = "none";
  }

  document.body.style.overflow = "";
}

// ==========================================
// WISHLIST AND COMPARISON BUTTON HANDLERS
// ==========================================

function handleWishlist(productId) {
  if (typeof addToWishlist !== "function") return;

  const currentWishlist = getWishlist();

  if (currentWishlist.includes(Number(productId))) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(productId);
  }

  applyProductFilters();
  displayFeaturedProducts();

  if (typeof displayWishlist === "function") {
    displayWishlist();
  }
}

function handleComparison(productId) {
  if (typeof addToComparison !== "function") return;

  const currentComparison = getComparison();

  if (currentComparison.includes(Number(productId))) {
    removeFromComparison(productId);
  } else {
    addToComparison(productId);
  }

  applyProductFilters();
  displayFeaturedProducts();

  if (typeof displayComparison === "function") {
    displayComparison();
  }
}

// ==========================================
// PRODUCT EVENT LISTENERS
// ==========================================

function initializeProductEvents() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (searchInput) {
    searchInput.addEventListener("input", applyProductFilters);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyProductFilters);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", applyProductFilters);
  }

  // Close modal when clicking outside the content.
  const modal = document.getElementById("productModal");

  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeProductModal();
      }
    });
  }

  // Close modal using Escape key.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeProductModal();
    }
  });
}

// ==========================================
// INITIALIZE PRODUCTS MODULE
// ==========================================

function initializeProducts() {
  displayCategories();
  displayProducts();
  displayFeaturedProducts();
  initializeProductEvents();
}
