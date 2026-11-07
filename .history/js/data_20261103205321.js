
// ==========================================
// SHOWCASE - PRODUCT DATA STORAGE
// ==========================================

// Product Categories
const categories = [
    {
        id: 1,
        name: "Electronics",
        description: "Latest electronic gadgets and devices"
    },
    {
        id: 2,
        name: "Fashion",
        description: "Trendy clothing and accessories"
    },
    {
        id: 3,
        name: "Books",
        description: "Books for learning and entertainment"
    },
    {
        id: 4,
        name: "Home & Living",
        description: "Products for your home"
    },
    {
        id: 5,
        name: "Sports & Outdoors",
        description: "Sports equipment and outdoor products"
    },
    {
        id: 6,
        name: "Gaming",
        description: "Gaming accessories and equipment"
    }
];

// Product Information
let products = [
    {
        id: 1,
        name: "Wireless Headphones Pro",
        description: "High-quality wireless headphones with noise cancellation.",
        category: "Electronics",
        price: 199.99,
        rating: 4.8,
        images: ["assets/images/headphone1.jpg", "assets/images/headphone2.jpg"],
        features: ["Noise Cancellation", "40hr Battery", "Bluetooth 5.0"],
        specifications: {
            weight: "250g",
            color: "Black"
        },
        stock_status: "In Stock",
        brand: "AudioTech",
        tags: ["wireless", "noise-cancelling", "premium"]
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        description: "Advanced smartwatch with health monitoring features.",
        category: "Electronics",
        price: 299.00,
        rating: 4.6,
        images: ["assets/images/watch1.jpg", "assets/images/watch2.jpg"],
        features: ["Heart Rate Monitor", "GPS", "Water Resistant"],
        specifications: {
            display: "1.5 inch",
            battery: "5 days"
        },
        stock_status: "In Stock",
        brand: "WearTech",
        tags: ["smartwatch", "fitness", "health"]
    },
    {
        id: 3,
        name: "Classic Cotton T-Shirt",
        description: "Comfortable premium cotton everyday t-shirt.",
        category: "Fashion",
        price: 24.99,
        rating: 4.5,
        images: ["assets/images/tshirt.jpg"],
        features: ["100% Cotton", "Breathable", "Regular Fit"],
        specifications: {
            material: "Cotton",
            color: "White"
        },
        stock_status: "In Stock",
        brand: "StyleHub",
        tags: ["clothing", "cotton", "casual"]
    },
    {
        id: 4,
        name: "JavaScript Programming Guide",
        description: "A complete guide to modern JavaScript programming.",
        category: "Books",
        price: 39.99,
        rating: 4.9,
        images: ["assets/images/javascript-book.jpg"],
        features: ["Beginner Friendly", "Practical Examples", "Exercises"],
        specifications: {
            pages: "450",
            language: "English"
        },
        stock_status: "In Stock",
        brand: "TechBooks",
        tags: ["programming", "javascript", "education"]
    },
    {
        id: 5,
        name: "Modern Table Lamp",
        description: "Elegant LED table lamp for modern interiors.",
        category: "Home & Living",
        price: 49.99,
        rating: 4.4,
        images: ["assets/images/lamp.jpg"],
        features: ["LED Lighting", "Energy Efficient", "Touch Control"],
        specifications: {
            material: "Metal",
            color: "White"
        },
        stock_status: "In Stock",
        brand: "HomeStyle",
        tags: ["lamp", "lighting", "home"]
    },
    {
        id: 6,
        name: "Professional Football",
        description: "Durable football designed for training and matches.",
        category: "Sports & Outdoors",
        price: 34.99,
        rating: 4.7,
        images: ["assets/images/football.jpg"],
        features: ["Water Resistant", "Durable Material", "Size 5"],
        specifications: {
            size: "5",
            material: "Synthetic Leather"
        },
        stock_status: "In Stock",
        brand: "SportMax",
        tags: ["football", "sports", "training"]
    },
    {
        id: 7,
        name: "RGB Gaming Keyboard",
        description: "Mechanical gaming keyboard with customizable RGB lighting.",
        category: "Gaming",
        price: 89.99,
        rating: 4.8,
        images: ["assets/images/keyboard.jpg"],
        features: ["Mechanical Keys", "RGB Lighting", "Anti-Ghosting"],
        specifications: {
            connection: "USB",
            layout: "Full Size"
        },
        stock_status: "In Stock",
        brand: "GameTech",
        tags: ["gaming", "keyboard", "rgb"]
    },
    {
        id: 8,
        name: "Wireless Gaming Mouse",
        description: "Precision wireless gaming mouse with adjustable DPI.",
        category: "Gaming",
        price: 59.99,
        rating: 4.6,
        images: ["assets/images/mouse.jpg"],
        features: ["Wireless", "Adjustable DPI", "Ergonomic Design"],
        specifications: {
            dpi: "16000",
            connection: "Wireless"
        },
        stock_status: "In Stock",
        brand: "GameTech",
        tags: ["gaming", "mouse", "wireless"]
    }
];

// Customer Reviews
let reviews = [
    {
        id: 1,
        product_id: 1,
        user: "John D.",
        rating: 5,
        comment: "Amazing sound quality!",
        date: "2026-06-15"
    },
    {
        id: 2,
        product_id: 2,
        user: "Sarah M.",
        rating: 4,
        comment: "Great smartwatch with useful features.",
        date: "2026-07-10"
    },
    {
        id: 3,
        product_id: 4,
        user: "David R.",
        rating: 5,
        comment: "Excellent book for learning JavaScript.",
        date: "2026-08-12"
    }
];

// Sample Users
let users = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@showcase.com",
        password: "admin123",
        role: "admin"
    },
    {
        id: 2,
        name: "John Customer",
        email: "john@example.com",
        password: "user123",
        role: "customer"
    }
];

// Data Storage Helper
const STORAGE_KEYS = {
    products: "showcase_products",
    reviews: "showcase_reviews",
    users: "showcase_users",
    wishlist: "showcase_wishlist",
    comparison: "showcase_comparison"
};

// Initialize LocalStorage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.products)) {
        localStorage.setItem(
            STORAGE_KEYS.products,
            JSON.stringify(products)
        );
    }

    if (!localStorage.getItem(STORAGE_KEYS.reviews)) {
        localStorage.setItem(
            STORAGE_KEYS.reviews,
            JSON.stringify(reviews)
        );
    }

    if (!localStorage.getItem(STORAGE_KEYS.users)) {
        localStorage.setItem(
            STORAGE_KEYS.users,
            JSON.stringify(users)
        );
    }

    if (!localStorage.getItem(STORAGE_KEYS.wishlist)) {
        localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.comparison)) {
        localStorage.setItem(STORAGE_KEYS.comparison, JSON.stringify([]));
    }
}

// Retrieve Stored Data
function getStoredData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Save Data
function saveStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Initialize application data
initializeStorage();

console.log("ShowCase product data initialized successfully!");
console.log("Products:", getStoredData(STORAGE_KEYS.products));
console.log("Categories:", categories);
