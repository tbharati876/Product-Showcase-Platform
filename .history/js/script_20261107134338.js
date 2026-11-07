
// =========================================
// SHOWCASE - MAIN APPLICATION SCRIPT
// =========================================

// ---------- TOAST NOTIFICATIONS ----------

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

// ---------- PAGE NAVIGATION ----------

function showSection(sectionId) {
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) {
        showToast("Page not found.", "error");
        return;
    }

    // Prevent unauthorized access to admin dashboard.
    if (sectionId === "admin" && !isAdmin()) {
        showToast("Admin access is required.", "error");
        showSection("login");
        return;
    }

    // Prevent unauthorized access to profile.
    if (sectionId === "profile" && !getCurrentUser()) {
        showToast("Please login to view your profile.", "info");
        showSection("login");
        return;
    }

    // Hide all page sections.
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active");
    });

    // Display selected section.
    targetSection.classList.add("active");

    // Update active navigation link.
    document.querySelectorAll("[data-section]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );
    });

    // Refresh page content when opening a section.
    switch (sectionId) {
        case "home":
            displayFeaturedProducts();
            break;

        case "products":
            applyProductFilters();
            break;

        case "categories":
            displayCategories();
            break;

        case "wishlist":
            displayWishlist();
            break;

        case "comparison":
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

        case "profile":
            displayProfile();
            break;

        case "admin":
            displayAdminDashboard();
            break;

        case "login":
        case "register":
            // Forms are rendered by initializeAuth()
            // or showAuthPage(). Do not call showAuthPage()
            // here, because it calls showSection() again.
            break;

        default:
            break;
    }

    // Close mobile navigation after navigation.
    const navLinks = document.querySelector(".nav-links");
    const menuToggle = document.querySelector(".menu-toggle");

    if (navLinks) {
        navLinks.classList.remove("open");
    }

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ---------- NAVIGATION EVENTS ----------

function initializeNavigation() {
    document.querySelectorAll("[data-section]").forEach(link => {

        // Avoid registering the same event twice.
        if (link.dataset.navigationReady === "true") return;

        link.dataset.navigationReady = "true";

        link.addEventListener("click", event => {
            event.preventDefault();

            const sectionId = link.dataset.section;

            if (!sectionId) return;

            // Admin access check.
            if (sectionId === "admin" && !isAdmin()) {
                showToast("Admin access is required.", "error");
                showSection("login");
                return;
            }

            // Profile access check.
            if (sectionId === "profile" && !getCurrentUser()) {
                showToast("Please login to view your profile.", "info");
                showSection("login");
                return;
            }

            // Checkout requires at least one cart item.
            if (
                sectionId === "checkout" &&
                getCart().length === 0
            ) {
                showToast("Your cart is empty.", "info");
                showSection("cart");
                return;
            }

            showSection(sectionId);
        });
    });
}

// ---------- MOBILE MENU ----------

function initializeMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });
}

// ---------- CONTACT FORM ----------

function initializeContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName")?.value.trim();
        const email = document.getElementById("contactEmail")?.value.trim();
        const message = document.getElementById("contactMessage")?.value.trim();

        if (!name || !email || !message) {
            showToast("Please complete all contact fields.", "error");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        // Front-end demo: no message is sent to a server.
        showToast("Thank you! Your message has been recorded.", "success");

        contactForm.reset();
    });
}

// ---------- FOOTER ----------

function initializeFooter() {
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// ---------- SCROLL TO TOP ----------

function initializeScrollToTop() {
    const scrollButton = document.getElementById("scrollToTop");

    if (!scrollButton) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            scrollButton.style.display = "flex";
        } else {
            scrollButton.style.display = "none";
        }
    });

    scrollButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ---------- GLOBAL ERROR HANDLING ----------

window.addEventListener("error", event => {
    console.error("ShowCase error:", event.message);
});

// ---------- INITIALIZE WEBSITE ----------

function initializeShowCase() {
    console.log("Initializing ShowCase website...");

    // Product and category data.
    initializeProducts();

    // Wishlist.
    initializeWishlist();

    // Product comparison.
    initializeComparison();

    // Reviews.
    initializeReviews();

    // Authentication.
    initializeAuth();

    // Admin dashboard.
    initializeAdmin();

    // Shopping cart.
    initializeCart();

    // Checkout.
    initializeCheckout();

    // Navigation.
    initializeNavigation();

    // Mobile menu.
    initializeMobileMenu();

    // Contact form.
    initializeContactForm();

    // Footer.
    initializeFooter();

    // Scroll to top.
    initializeScrollToTop();

    // Display homepage.
    showSection("home");

    console.log("ShowCase website initialized successfully.");
}

// ---------- DOM READY ----------

document.addEventListener("DOMContentLoaded", () => {
    initializeShowCase();
});
