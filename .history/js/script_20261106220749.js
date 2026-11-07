
// SHOWCASE V2 - MAIN APPLICATION CONTROLLER

// ==========================================
// 1. PAGE / SECTION NAVIGATION
// ==========================================

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
    "admin"
];

function showSection(sectionId) {
    if (!pageSections.includes(sectionId)) {
        sectionId = "home";
    }

    // Hide all main page sections
    document.querySelectorAll(
        "main > section, .page-section"
    ).forEach(section => {
        section.hidden = section.id !== sectionId;
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.hidden = false;
    }

    // Update navigation active state
    document.querySelectorAll("[data-section]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );
    });

    // Update URL hash
    if (window.location.hash !== `#${sectionId}`) {
        history.replaceState(null, "", `#${sectionId}`);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ==========================================
// 2. NAVIGATION EVENT LISTENERS
// ==========================================

function initializeNavigation() {
    document.querySelectorAll("[data-section]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const sectionId = link.dataset.section;

            if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    // Support regular navigation links with section hashes
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.hasAttribute("data-section")) return;

        link.addEventListener("click", event => {
            const sectionId = link.getAttribute("href").slice(1);

            if (pageSections.includes(sectionId)) {
                event.preventDefault();
                showSection(sectionId);
            }
        });
    });

    // Browser back/forward navigation
    window.addEventListener("hashchange", () => {
        const sectionId = window.location.hash.slice(1);

        if (pageSections.includes(sectionId)) {
            showSection(sectionId);
        }
    });
}

// ==========================================
// 3. CONTACT FORM
// ==========================================

function initializeContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = contactForm.querySelector(
            '[name="name"], #contactName'
        )?.value.trim();

        const email = contactForm.querySelector(
            '[name="email"], #contactEmail'
        )?.value.trim();

        const message = contactForm.querySelector(
            '[name="message"], #contactMessage'
        )?.value.trim();

        if (!name || !email || !message) {
            alert("Please complete all required contact fields.");
            return;
        }

        // Demo behaviour: no backend/email service is connected.
        alert(
            `Thank you, ${name}! Your message has been received in this demo.`
        );

        contactForm.reset();
    });
}

// ==========================================
// 4. INITIALIZE ALL SHOWCASE MODULES
// ==========================================

function initializeShowCase() {
    console.log("Starting ShowCase application...");

    // Product catalogue
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

    // Product reviews
    if (typeof initializeReviews === "function") {
        initializeReviews();
    }

    // Authentication - LOGIN AND REGISTRATION
    if (typeof initializeAuth === "function") {
        initializeAuth();
    }

    // Admin dashboard
    if (typeof initializeAdmin === "function") {
        initializeAdmin();
    }

    // Navigation and contact form
    initializeNavigation();
    initializeContactForm();

    // Display the appropriate initial section
    const requestedSection = window.location.hash.slice(1);

    if (pageSections.includes(requestedSection)) {
        showSection(requestedSection);
    } else {
        showSection("home");
    }

    // Refresh authentication navigation
    if (typeof updateAuthNavigation === "function") {
        updateAuthNavigation();
    }

    console.log("ShowCase application initialized successfully!");
}

// ==========================================
// 5. START APPLICATION AFTER HTML LOADS
// ==========================================

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeShowCase
    );
} else {
    initializeShowCase();
}
