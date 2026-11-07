
// SHOWCASE - MAIN APPLICATION SCRIPT

function showSection(sectionId) {
    const sections = document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.hidden = section.id !== sectionId;
    });

    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        targetSection.hidden = false;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (sectionId === "wishlist") {
        displayWishlist();
    }

    if (sectionId === "compare") {
        displayComparison();
    }

    if (sectionId === "admin") {
        displayAdminProducts();
    }
}

function initializeNavigation() {
    document.querySelectorAll("[data-section]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const sectionId = link.dataset.section;
            showSection(sectionId);
            history.replaceState(null, "", `#${sectionId}`);
        });
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !message) {
            alert("Please complete all contact form fields.");
            return;
        }

        alert("Thank you for contacting ShowCase! Your message has been received.");

        contactForm.reset();
    });
}

function initializePageNavigation() {
    const initialSection = window.location.hash.replace("#", "");

    const availableSections = [
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

    if (availableSections.includes(initialSection)) {
        showSection(initialSection);
    } else {
        showSection("home");
    }
}

function initializeShowCase() {
    initializeNavigation();

    initializeProducts();
    initializeWishlist();
    initializeComparison();
    initializeReviews();
    initializeAuth();
    initializeAdmin();

    initializeContactForm();
    updateAuthUI();

    initializePageNavigation();

    console.log("ShowCase application initialized successfully.");
}

document.addEventListener("DOMContentLoaded", initializeShowCase);
