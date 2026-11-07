
/* =========================================
   SHOWCASE - MAIN APPLICATION CONTROLLER
========================================= */

// Show notification messages
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

        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


// Navigate between website sections
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

    // Refresh relevant section content
    switch (sectionId) {
        case "products":
            if (typeof displayProducts === "function") {
                displayProducts();
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

        case "reviews":
            if (typeof displayReviews === "function") {
                displayReviews();
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

        case "admin":
            if (typeof displayAdminDashboard === "function") {
                displayAdminDashboard();
            }
            break;
    }

    // Update navigation links
    document.querySelectorAll("[data-section]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );
    });

    // Close mobile menu
    const navLinks = document.querySelector(".nav-links");

    if (navLinks) {
        navLinks.classList.remove("open");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Initialize navigation
function initializeNavigation() {
    document.querySelectorAll("[data-section]").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const section = this.dataset.section;

            if (!section) return;

            if (section === "admin" && !isAdmin()) {
                showToast("Admin login required.", "error");
                showAuthPage("login");
                return;
            }

            if (section === "checkout" && getCart().length === 0) {
                showToast("Your cart is empty.", "error");
                showSection("products");
                return;
            }

            showSection(section);
        });
    });
}


// Mobile navigation
function initializeMobileMenu() {
    const menuButton = document.querySelector(
        ".menu-toggle, .mobile-menu-toggle, #menuToggle"
    );

    const navLinks = document.querySelector(".nav-links");

    if (!menuButton || !navLinks) return;

    menuButton.addEventListener("click", function() {
        navLinks.classList.toggle("open");
    });
}


// Contact form
function initializeContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = this.querySelector(
            '[name="name"], #contactName'
        )?.value.trim();

        const email = this.querySelector(
            '[name="email"], #contactEmail'
        )?.value.trim();

        const message = this.querySelector(
            '[name="message"], #contactMessage'
        )?.value.trim();

        if (!name || !email || !message) {
            showToast("Please complete all contact fields.", "error");
            return;
        }

        showToast("Thank you! Your message has been received.", "success");

        this.reset();
    });
}


// Footer year
function initializeFooter() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


// Scroll to top button
function initializeScrollToTop() {
    const button = document.getElementById("scrollToTop");

    if (!button) return;

    window.addEventListener("scroll", function() {
        button.style.display =
            window.scrollY > 400 ? "flex" : "none";
    });

    button.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// Initialize all website modules
function initializeShowCase() {

    // Product catalog and categories
    if (typeof initializeProducts === "function") {
        initializeProducts();
    }

    // Wishlist
    if (typeof initializeWishlist === "function") {
        initializeWishlist();
    }

    // Product comparison
    if (typeof initializeComparison === "function") {
        initializeComparison();
    }

    // Reviews
    if (typeof initializeReviews === "function") {
        initializeReviews();
    }

    // Authentication
    if (typeof initializeAuth === "function") {
        initializeAuth();
    }

    // Admin dashboard
    if (typeof initializeAdmin === "function") {
        initializeAdmin();
    }

    // Shopping cart
    if (typeof initializeCart === "function") {
        initializeCart();
    }

    // Checkout
    if (typeof initializeCheckout === "function") {
        initializeCheckout();
    }

    // Orders
    if (typeof initializeOrders === "function") {
        initializeOrders();
    }

    // Navigation and general features
    initializeNavigation();
    initializeMobileMenu();
    initializeContactForm();
    initializeFooter();
    initializeScrollToTop();

    // Show home page initially
    showSection("home");

    console.log("ShowCase website initialized successfully!");
}


// Start application after HTML loads
document.addEventListener("DOMContentLoaded", initializeShowCase);
