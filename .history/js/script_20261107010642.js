// ==========================================
// SHOWCASE - MAIN WEBSITE SCRIPT
// ==========================================

// Display website sections
function showSection(sectionId) {
    const sections = document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionId);

    if (!targetSection) {
        console.warn("Section not found:", sectionId);
        return;
    }

    targetSection.classList.add("active");

    // Close mobile navigation
    const mainNav = document.getElementById("mainNav");

    if (mainNav) {
        mainNav.classList.remove("show");
    }

    // Close account dropdown
    const accountMenu = document.getElementById("accountMenu");

    if (accountMenu) {
        accountMenu.classList.remove("show");
    }

    // Render the selected section
    switch (sectionId) {
        case "home":
            displayCategories();
            displayFeaturedProducts();
            break;

        case "categories":
            displayCategories();
            break;

        case "products":
            initializeCategoryFilter();
            displayProducts(getProducts());
            break;

        case "wishlist":
            displayWishlist();
            break;

        case "compare":
            displayComparison();
            break;

        case "reviews":
            displayReviews();
            break;

        case "cart":
            displayCart();
            break;

        case "checkout":
            displayCheckout();
            break;

        case "orders":
            displayOrders();
            break;

        case "orderDetails":
            // Order details are rendered by viewOrderDetails().
            break;

        case "profile":
            displayProfile();
            break;

        case "admin":
            displayAdmin();
            break;
    }

    // Update account and cart indicators
    if (typeof updateAccountUI === "function") {
        updateAccountUI();
    }

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Display toast notification
function showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Toggle account dropdown
function toggleAccountMenu() {
    const menu = document.getElementById("accountMenu");

    if (!menu) return;

    menu.classList.toggle("show");
}

// Toggle mobile navigation
function toggleMobileMenu() {
    const nav = document.getElementById("mainNav");

    if (!nav) return;

    nav.classList.toggle("show");
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
        showToast("Please complete all contact form fields.", "warning");
        return;
    }

    showToast("Thank you! Your message has been received.", "success");

    form.reset();
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const searchTerm = searchInput.value.trim().toLowerCase();

    showSection("products");

    const filteredProducts = getProducts().filter(product => {
        const searchableText = [
            product.name,
            product.description,
            product.category,
            product.brand,
            ...(product.tags || [])
        ].join(" ").toLowerCase();

        return searchableText.includes(searchTerm);
    });

    displayProducts(filteredProducts);

    if (filteredProducts.length === 0) {
        showToast("No matching products found.", "warning");
    }
}

// Handle Enter key in search
function initializeSearch() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            searchProducts();
        }
    });
}

// Update current year in footer
function updateFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize all website features
function initializeWebsite() {
    // Initialize local storage data
    initializeStorage();

    // Initialize authentication
    initializeAuth();

    // Initialize cart
    initializeCart();

    // Initialize product sections
    initializeProductsPage();

    // Initialize wishlist
    initializeWishlist();

    // Initialize comparison
    initializeComparison();

    // Initialize reviews
    initializeReviews();

    // Initialize checkout
    initializeCheckout();

    // Initialize orders
    initializeOrders();

    // Initialize admin
    initializeAdmin();

    // Search
    initializeSearch();

    // Footer year
    updateFooterYear();

    // Show home page
    showSection("home");

    console.log("ShowCase website initialized successfully.");
}

// Website event listeners
document.addEventListener("DOMContentLoaded", () => {
    initializeWebsite();

    const menuToggle = document.getElementById("menuToggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMobileMenu);
    }

    // Close account menu when clicking outside
    document.addEventListener("click", event => {
        const accountMenu = document.getElementById("accountMenu");
        const accountButton = document.getElementById("accountButton");

        if (
            accountMenu &&
            !accountMenu.contains(event.target) &&
            !accountButton?.contains(event.target)
        ) {
            accountMenu.classList.remove("show");
        }
    });
});