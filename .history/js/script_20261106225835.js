

// SHOWCASE - MAIN APPLICATION CONTROLLER

const pageSections = [
    "home",
    "categories",
    "products",
    "wishlist",
    "compare",
    "reviews",
    "contact",
    "login",
    "register",
    "admin",
    "cart",
    "checkout"
];

// Navigate between website sections
function showSection(sectionId) {
    if (!pageSections.includes(sectionId)) {
        sectionId = "home";
    }

    const sections = document.querySelectorAll(
        "main > section, .page-section"
    );

    sections.forEach(section => {
        section.style.display =
            section.id === sectionId ? "block" : "none";
    });

    // Update navigation active state
    document.querySelectorAll(
        "[data-section]"
    ).forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );
    });

    // Update URL hash
    if (window.location.hash !== `#${sectionId}`) {
        history.replaceState(
            null,
            "",
            `#${sectionId}`
        );
    }

    // Refresh dynamic sections when opened
    if (sectionId === "cart" &&
        typeof displayCart === "function") {
        displayCart();
    }

    if (sectionId === "checkout" &&
        typeof displayCheckout === "function") {
        displayCheckout();
    }

    if (sectionId === "wishlist" &&
        typeof displayWishlist === "function") {
        displayWishlist();
    }

    if (sectionId === "compare" &&
        typeof displayComparison === "function") {
        displayComparison();
    }

    if (sectionId === "reviews" &&
        typeof displayReviews === "function") {
        displayReviews();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Initialize navigation links
function initializeNavigation() {

    // Links using data-section
    document.querySelectorAll("[data-section]").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const sectionId = this.dataset.section;

            showSection(sectionId);
        });
    });

    // Links using section hashes
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(event) {
            const sectionId = this.getAttribute("href").substring(1);

            if (pageSections.includes(sectionId)) {
                event.preventDefault();
                showSection(sectionId);
            }
        });
    });

    // Browser back and forward navigation
    window.addEventListener("hashchange", function() {
        const sectionId = window.location.hash.substring(1);

        if (pageSections.includes(sectionId)) {
            showSection(sectionId);
        }
    });
}

// Contact form
function initializeContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(contactForm);

        const name = formData.get("name") || "";
        const email = formData.get("email") || "";
        const message = formData.get("message") || "";

        if (!name || !email || !message) {
            alert("Please fill in all contact form fields.");
            return;
        }

        alert(
            "Thank you, " + name +
            "! Your demo message has been received."
        );

        contactForm.reset();
    });
}

// Initialize all website features
function initializeShowCase() {

    console.log("Initializing ShowCase...");

    // Initialize product catalogue
    if (typeof initializeProducts === "function") {
        initializeProducts();
    }

    // Initialize wishlist
    if (typeof initializeWishlist === "function") {
        initializeWishlist();
    }

    // Initialize comparison
    if (typeof initializeComparison === "function") {
        initializeComparison();
    }

    // Initialize reviews
    if (typeof initializeReviews === "function") {
        initializeReviews();
    }

    // Initialize authentication
    if (typeof initializeAuth === "function") {
        initializeAuth();
    }

    // Initialize admin dashboard
    if (typeof initializeAdmin === "function") {
        initializeAdmin();
    }

    // Initialize shopping cart
    if (typeof initializeCart === "function") {
        initializeCart();
    }

    // Initialize checkout
    if (typeof initializeCheckout === "function") {
        initializeCheckout();
    }

    // Initialize navigation
    initializeNavigation();

    // Initialize contact form
    initializeContactForm();

    // Open requested page or homepage
    const requestedSection = window.location.hash.substring(1);

    if (pageSections.includes(requestedSection)) {
        showSection(requestedSection);
    } else {
        showSection("home");
    }

    // Update authentication navigation
    if (typeof updateAuthNavigation === "function") {
        updateAuthNavigation();
    }

    // Update cart count
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    console.log("ShowCase initialized successfully!");
}

// Start application after HTML loads
document.addEventListener(
    "DOMContentLoaded",
    initializeShowCase
);
