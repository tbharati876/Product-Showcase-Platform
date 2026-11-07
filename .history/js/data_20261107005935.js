/* =========================================
   SHOWCASE - DATA AND STORAGE
========================================= */

const USERS_STORAGE_KEY = "showcase_users";
const CURRENT_USER_KEY = "showcase_current_user";
const PRODUCTS_STORAGE_KEY = "showcase_products";
const WISHLIST_STORAGE_KEY = "showcase_wishlist";
const COMPARE_STORAGE_KEY = "showcase_compare";
const REVIEWS_STORAGE_KEY = "showcase_reviews";
const CART_STORAGE_KEY = "showcase_cart";
const ORDERS_STORAGE_KEY = "showcase_orders";
const CHECKOUT_STORAGE_KEY = "showcase_checkout";

/* ---------- DEFAULT PRODUCTS ---------- */

const defaultProducts = [
    {
        id: 1,
        name: "Wireless Headphones Pro",
        description: "Premium wireless headphones with immersive sound and comfortable ear cushions.",
        category: "Electronics",
        price: 2499,
        original_price: 3299,
        rating: 4.8,
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Wireless Bluetooth connectivity",
            "Noise reduction",
            "Long battery life",
            "Comfortable ear cushions"
        ],
        specifications: {
            "Connectivity": "Bluetooth",
            "Battery Life": "30 hours",
            "Type": "Over-ear",
            "Warranty": "1 year"
        },
        stock_status: "In Stock",
        brand: "SoundMax",
        tags: ["headphones", "audio", "wireless"]
    },
    {
        id: 2,
        name: "Smart Watch Series X",
        description: "A stylish smartwatch to track your fitness, notifications and daily activities.",
        category: "Electronics",
        price: 3999,
        original_price: 4999,
        rating: 4.6,
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Fitness tracking",
            "Heart rate monitoring",
            "Smart notifications",
            "Water resistant design"
        ],
        specifications: {
            "Display": "Touchscreen",
            "Connectivity": "Bluetooth",
            "Battery Life": "Up to 7 days",
            "Warranty": "1 year"
        },
        stock_status: "In Stock",
        brand: "TechTime",
        tags: ["watch", "smartwatch", "fitness"]
    },
    {
        id: 3,
        name: "Classic Leather Backpack",
        description: "A versatile backpack with a premium look and spacious compartments.",
        category: "Fashion",
        price: 1799,
        original_price: 2299,
        rating: 4.5,
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Premium finish",
            "Multiple compartments",
            "Adjustable shoulder straps",
            "Everyday use"
        ],
        specifications: {
            "Material": "Leather finish",
            "Capacity": "20 litres",
            "Closure": "Zipper",
            "Warranty": "6 months"
        },
        stock_status: "In Stock",
        brand: "UrbanCarry",
        tags: ["backpack", "bag", "fashion"]
    },
    {
        id: 4,
        name: "Modern Running Shoes",
        description: "Lightweight running shoes designed for comfort and everyday performance.",
        category: "Fashion",
        price: 2199,
        original_price: 2799,
        rating: 4.7,
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Lightweight construction",
            "Cushioned sole",
            "Breathable upper",
            "Flexible grip"
        ],
        specifications: {
            "Material": "Mesh",
            "Sole": "Rubber",
            "Fit": "Regular",
            "Type": "Running"
        },
        stock_status: "In Stock",
        brand: "RunFlex",
        tags: ["shoes", "running", "sports"]
    },
    {
        id: 5,
        name: "Minimal Ceramic Vase",
        description: "A decorative ceramic vase that adds a modern touch to your home.",
        category: "Home & Living",
        price: 899,
        original_price: 1199,
        rating: 4.4,
        images: [
            "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Minimalist design",
            "Durable ceramic",
            "Decorative finish",
            "Suitable for indoor spaces"
        ],
        specifications: {
            "Material": "Ceramic",
            "Colour": "White",
            "Style": "Modern",
            "Usage": "Home decor"
        },
        stock_status: "In Stock",
        brand: "DecorNest",
        tags: ["vase", "decor", "home"]
    },
    {
        id: 6,
        name: "Premium Coffee Maker",
        description: "Make your favourite coffee at home with this convenient coffee maker.",
        category: "Home & Living",
        price: 2899,
        original_price: 3599,
        rating: 4.6,
        images: [
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Easy operation",
            "Compact design",
            "Reusable filter",
            "Quick brewing"
        ],
        specifications: {
            "Type": "Drip coffee maker",
            "Capacity": "1 litre",
            "Power": "800 W",
            "Warranty": "1 year"
        },
        stock_status: "In Stock",
        brand: "BrewMate",
        tags: ["coffee", "kitchen", "appliance"]
    },
    {
        id: 7,
        name: "Professional Camera",
        description: "Capture memorable moments with a versatile digital camera.",
        category: "Electronics",
        price: 15999,
        original_price: 18999,
        rating: 4.9,
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "High-resolution photos",
            "Video recording",
            "Interchangeable lens support",
            "Portable design"
        ],
        specifications: {
            "Type": "Digital camera",
            "Resolution": "24 MP",
            "Video": "4K support",
            "Connectivity": "Wi-Fi"
        },
        stock_status: "In Stock",
        brand: "PixelPro",
        tags: ["camera", "photography", "electronics"]
    },
    {
        id: 8,
        name: "Luxury Sunglasses",
        description: "Contemporary sunglasses with a stylish frame for everyday wear.",
        category: "Fashion",
        price: 1299,
        original_price: 1699,
        rating: 4.3,
        images: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Modern frame",
            "UV protection",
            "Lightweight design",
            "Comfortable fit"
        ],
        specifications: {
            "Frame": "Premium composite",
            "Lens": "UV protection",
            "Style": "Classic",
            "Fit": "Unisex"
        },
        stock_status: "In Stock",
        brand: "SunStyle",
        tags: ["sunglasses", "accessories", "fashion"]
    },
    {
        id: 9,
        name: "Modern Table Lamp",
        description: "A contemporary table lamp that creates a warm atmosphere.",
        category: "Home & Living",
        price: 1499,
        original_price: 1899,
        rating: 4.5,
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Modern design",
            "Warm lighting",
            "Compact size",
            "Suitable for bedrooms and desks"
        ],
        specifications: {
            "Material": "Metal",
            "Light Type": "LED compatible",
            "Style": "Modern",
            "Usage": "Indoor"
        },
        stock_status: "In Stock",
        brand: "GlowHome",
        tags: ["lamp", "lighting", "home"]
    },
    {
        id: 10,
        name: "Portable Bluetooth Speaker",
        description: "Enjoy your favourite music with a compact portable speaker.",
        category: "Electronics",
        price: 1899,
        original_price: 2499,
        rating: 4.6,
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Bluetooth connectivity",
            "Portable design",
            "Rechargeable battery",
            "Clear sound output"
        ],
        specifications: {
            "Connectivity": "Bluetooth",
            "Battery": "Rechargeable",
            "Type": "Portable speaker",
            "Warranty": "1 year"
        },
        stock_status: "In Stock",
        brand: "BeatBox",
        tags: ["speaker", "music", "audio"]
    },
    {
        id: 11,
        name: "Fitness Yoga Mat",
        description: "A comfortable exercise mat for yoga, stretching and workouts.",
        category: "Sports",
        price: 799,
        original_price: 999,
        rating: 4.4,
        images: [
            "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Non-slip surface",
            "Comfortable cushioning",
            "Easy to carry",
            "Suitable for home workouts"
        ],
        specifications: {
            "Material": "Foam",
            "Thickness": "6 mm",
            "Usage": "Yoga and exercise",
            "Type": "Fitness mat"
        },
        stock_status: "In Stock",
        brand: "FitLife",
        tags: ["yoga", "fitness", "sports"]
    },
    {
        id: 12,
        name: "Stainless Steel Water Bottle",
        description: "A reusable insulated bottle for keeping drinks at your preferred temperature.",
        category: "Sports",
        price: 699,
        original_price: 899,
        rating: 4.5,
        images: [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85"
        ],
        features: [
            "Reusable design",
            "Leak-resistant lid",
            "Easy to carry",
            "Durable construction"
        ],
        specifications: {
            "Material": "Stainless steel",
            "Capacity": "750 ml",
            "Lid": "Screw cap",
            "Usage": "Everyday"
        },
        stock_status: "In Stock",
        brand: "HydroGo",
        tags: ["bottle", "water", "sports"]
    }
];

/* ---------- STORAGE HELPERS ---------- */

function getStoredData(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error("Storage read error:", key, error);
        return fallback;
    }
}

function saveStoredData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Storage save error:", key, error);
        showToast("Unable to save data. Check browser storage.", "error");
        return false;
    }
}

/* ---------- PRODUCT STORAGE ---------- */

function initializeProducts() {
    const savedProducts = getStoredData(PRODUCTS_STORAGE_KEY, null);

    if (!Array.isArray(savedProducts) || savedProducts.length === 0) {
        saveStoredData(PRODUCTS_STORAGE_KEY, defaultProducts);
    }
}

function getProducts() {
    const products = getStoredData(PRODUCTS_STORAGE_KEY, defaultProducts);
    return Array.isArray(products) ? products : defaultProducts;
}

function saveProducts(products) {
    return saveStoredData(PRODUCTS_STORAGE_KEY, products);
}

/* ---------- GENERAL INITIALIZATION ---------- */

function initializeStorage() {
    initializeProducts();

    const defaultArrays = [
        USERS_STORAGE_KEY,
        WISHLIST_STORAGE_KEY,
        COMPARE_STORAGE_KEY,
        REVIEWS_STORAGE_KEY,
        CART_STORAGE_KEY,
        ORDERS_STORAGE_KEY
    ];

    defaultArrays.forEach(key => {
        if (localStorage.getItem(key) === null) {
            saveStoredData(key, []);
        }
    });

    if (localStorage.getItem(CHECKOUT_STORAGE_KEY) === null) {
        saveStoredData(CHECKOUT_STORAGE_KEY, {});
    }
}

/* ---------- GENERAL HELPERS ---------- */

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(amount) || 0);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

function getProductImage(product) {
    if (!product) {
        return "https://placehold.co/600x600/f3f1ff/7057e8?text=ShowCase";
    }

    const image =
        product.image ||
        product.thumbnail ||
        (Array.isArray(product.images) ? product.images[0] : "");

    return image || "https://placehold.co/600x600/f3f1ff/7057e8?text=ShowCase";
}

function generateId(prefix = "ID") {
    return prefix + "-" + Date.now() + "-" +
        Math.random().toString(36).slice(2, 8).toUpperCase();
}

/* ---------- CATEGORY DATA ---------- */

const productCategories = [
    {
        name: "Electronics",
        icon: "🎧",
        description: "Technology and gadgets"
    },
    {
        name: "Fashion",
        icon: "👟",
        description: "Style and accessories"
    },
    {
        name: "Home & Living",
        icon: "🏠",
        description: "Make your home special"
    },
    {
        name: "Sports",
        icon: "🏃",
        description: "Fitness and outdoor"
    }
];