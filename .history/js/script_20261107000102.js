
// ==========================================
// SHOWCASE MAIN APPLICATION
// ==========================================

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = type === "error"
        ? "fa-exclamation-circle"
        : "fa-check-circle";

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${escapeHTML(String(message))}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-hide");

        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// PAGE NAVIGATION
// ==========================================

function showSection(sectionId) {
    const target = document.getElementById(sectionId);

    if (!target || !target.classList.contains("page-section")) {
        return;
    }

    // Restrict admin page
    if (sectionId === "admin" && typeof isAdmin === "function" && !isAdmin()) {
        showToast("Admin access required.", "error");
        sectionId = "login";
    }

    // Prevent checkout with an empty cart
    if (sectionId === "checkout" && typeof getCart === "function") {
        if (getCart().length === 0) {
            showToast("Your cart is empty.", "error");
            sectionId = "cart";
        }
    }

    // Hide all sections
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active");
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Update active navigation
    document.querySelectorAll("[data-section]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );
    });

    // Refresh the selected page
    switch (sectionId) {
        case "home":
            if (typeof displayFeaturedProducts === "function") {
                displayFeaturedProducts();
            }

            if (typeof displayCategories === "function") {
                displayCategories();
            }
            break;

        case "categories":
            if (typeof displayCategories === "function") {
                displayCategories();
            }
            break;

        case "products":
            if (typeof displayProducts === "function") {
                applyProductFilters();
            }
            break;

        case "wishlist":
            if (typeof displayWishlist === "function") {
                displayWishlist();
            }
            break;

        case "comparison":
            if (typeof displayComparison === "function") {
                displayComparison();
            }
            break;

        case "cart":
            if (typeof displayCart === "function") {
                displayCart();
            }
            break;

        case "checkout":
            if (typeof displayCheckout === "function") {
                displayCheckout();
            }
            break;

        case "orders":
            if (typeof displayOrders === "function") {
                displayOrders();
            }
            break;

        case "profile":
            if (typeof displayProfile === "function") {
                displayProfile();
            }
            break;

        case "admin":
            if (typeof displayAdminDashboard === "function") {
                displayAdminDashboard();
            }
            break;

        case "reviews":
            if (typeof displayReviews === "function") {
                displayReviews();
            }
            break;
    }

    // Close mobile navigation
    const nav = document.querySelector(".nav-links");

    if (nav) {
        nav.classList.remove("open");
    }

    const menuToggle = document.getElementById("menuToggle");

    if (menuToggle) {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Update URL hash without reloading
    if (window.location.hash !== "#" + sectionId) {
        history.replaceState(null, "", "#" + sectionId);
    }
}

// ==========================================
// NAVIGATION EVENT LISTENERS
// ==========================================

function initializeNavigation() {
    if (document.body.dataset.navigationReady === "true") {
        return;
    }

    document.body.dataset.navigationReady = "true";

    // One delegated listener handles header and footer links,
    // including links rendered inside the login/register forms.
    document.addEventListener("click", function(event) {
        const link = event.target.closest("[data-section]");

        if (!link) return;

        event.preventDefault();

        const sectionId = link.dataset.section;

        if (sectionId) {
            showSection(sectionId);
        }
    });
}

// ==========================================
// MOBILE MENU
// ==========================================

function initializeMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const nav = document.querySelector(".nav-links");

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener("click", function() {
        nav.classList.toggle("open");

        menuToggle.innerHTML = nav.classList.contains("open")
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

// ==========================================
// CONTACT FORM
// ==========================================

function initializeContactForm() {
    const form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !message) {
            showToast("Please complete all contact details.", "error");
            return;
        }

        showToast("Thank you! Your message has been recorded in this demo.", "success");

        form.reset();
    });
}

// ==========================================
// FOOTER
// ==========================================

function initializeFooter() {
    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

// ==========================================
// SCROLL TO TOP
// ==========================================

function initializeScrollToTop() {
    const button = document.getElementById("scrollToTop");

    if (!button) return;

    window.addEventListener("scroll", function() {
        button.classList.toggle("visible", window.scrollY > 300);
    });

    button.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ==========================================
// HANDLE BROWSER BACK / FORWARD
// ==========================================

function initializeHashNavigation() {
    window.addEventListener("hashchange", function() {
        const sectionId = window.location.hash.replace("#", "");

        if (sectionId && document.getElementById(sectionId)) {
            showSection(sectionId);
        }
    });
}

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

function initializeShowCase() {
    if (window.showCaseInitialized) return;

    window.showCaseInitialized = true;

    // Initialize products and shopping features
    if (typeof initializeProducts === "function") {
        initializeProducts();
    }

    if (typeof initializeWishlist === "function") {
        initializeWishlist();
    }

    if (typeof initializeComparison === "function") {
        initializeComparison();
    }

    if (typeof initializeReviews === "function") {
        initializeReviews();
    }

    // Initialize authentication and profile
    if (typeof initializeAuth === "function") {
        initializeAuth();
    }

    // Initialize admin
    if (typeof initializeAdmin === "function") {
        initializeAdmin();
    }

    // Initialize cart and checkout
    if (typeof initializeCart === "function") {
        initializeCart();
    }

    if (typeof initializeCheckout === "function") {
        initializeCheckout();
    }

    // Initialize orders
    if (typeof initializeOrders === "function") {
        initializeOrders();
    }

    // Initialize navigation and other features
    initializeNavigation();
    initializeMobileMenu();
    initializeContactForm();
    initializeFooter();
    initializeScrollToTop();
    initializeHashNavigation();

    // Open the page requested in the URL, or Home by default
    const requestedSection = window.location.hash.replace("#", "");

    if (requestedSection &&
        document.getElementById(requestedSection) &&
        document.getElementById(requestedSection).classList.contains("page-section")) {
        showSection(requestedSection);
    } else {
        showSection("home");
    }

    // Refresh account-related information
    if (typeof updateAuthNavigation === "function") {
        updateAuthNavigation();
    }

    if (typeof displayProfile === "function") {
        displayProfile();
    }

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    if (typeof updateWishlistCount === "function") {
        updateWishlistCount();
    }

    if (typeof updateOrders === "function") {
        updateOrders();
    }

    console.log("ShowCase initialized successfully.");
}

// ==========================================
// START APPLICATION
// ==========================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeShowCase);
} else {
    initializeShowCase();
}
