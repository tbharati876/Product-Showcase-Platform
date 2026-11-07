
// SHOWCASE - PRODUCT DATABASE V2

const categories = [
    "Electronics",
    "Fashion",
    "Books",
    "Home & Living",
    "Sports & Outdoors",
    "Gaming"
];

const products = [
    {
        id: 1,
        name: "Sony Wireless Headphones",
        brand: "Sony",
        category: "Electronics",
        price: 8999,
        originalPrice: 11999,
        rating: 4.8,
        reviewsCount: 245,
        stock_status: "In Stock",
        description: "Premium wireless headphones with immersive sound and noise cancellation.",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900"
        ],
        features: ["Active noise cancellation", "Bluetooth connectivity", "30-hour battery", "Built-in microphone"],
        specifications: { Connectivity: "Bluetooth", Battery: "30 hours", Type: "Over-ear" },
        tags: ["headphones", "audio", "wireless"]
    },
    {
        id: 2,
        name: "Premium Smart Watch",
        brand: "Samsung",
        category: "Electronics",
        price: 12999,
        originalPrice: 15999,
        rating: 4.7,
        reviewsCount: 189,
        stock_status: "In Stock",
        description: "Smart fitness watch with health tracking and elegant design.",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900"],
        features: ["Heart rate monitoring", "Fitness tracking", "Notifications", "Water resistant"],
        specifications: { Display: "AMOLED", Connectivity: "Bluetooth", Battery: "Up to 5 days" },
        tags: ["watch", "fitness", "smartwatch"]
    },
    {
        id: 3,
        name: "Professional Digital Camera",
        brand: "Canon",
        category: "Electronics",
        price: 45999,
        originalPrice: 52999,
        rating: 4.9,
        reviewsCount: 156,
        stock_status: "In Stock",
        description: "Capture detailed photographs with this versatile digital camera.",
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900"],
        features: ["High-resolution sensor", "Optical zoom", "4K video", "Wi-Fi sharing"],
        specifications: { Video: "4K", Connectivity: "Wi-Fi", Type: "Digital camera" },
        tags: ["camera", "photography"]
    },
    {
        id: 4,
        name: "Mechanical Gaming Keyboard",
        brand: "Logitech",
        category: "Gaming",
        price: 5499,
        originalPrice: 6999,
        rating: 4.6,
        reviewsCount: 112,
        stock_status: "In Stock",
        description: "Responsive mechanical keyboard with customizable RGB lighting.",
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900"],
        features: ["Mechanical switches", "RGB lighting", "Durable keys", "Gaming mode"],
        specifications: { Connection: "USB", Lighting: "RGB", Layout: "Full size" },
        tags: ["keyboard", "gaming", "computer"]
    },
    {
        id: 5,
        name: "Wireless Gaming Mouse",
        brand: "Logitech",
        category: "Gaming",
        price: 2499,
        originalPrice: 3299,
        rating: 4.5,
        reviewsCount: 98,
        stock_status: "In Stock",
        description: "Precision wireless mouse designed for comfortable gaming.",
        images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=900"],
        features: ["Adjustable DPI", "Wireless connection", "Ergonomic design"],
        specifications: { Connection: "Wireless", DPI: "Adjustable", Type: "Gaming mouse" },
        tags: ["mouse", "gaming"]
    },
    {
        id: 6,
        name: "Classic Cotton T-Shirt",
        brand: "Urban Style",
        category: "Fashion",
        price: 799,
        originalPrice: 1199,
        rating: 4.5,
        reviewsCount: 75,
        stock_status: "In Stock",
        description: "Comfortable everyday cotton t-shirt with a modern fit.",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900"],
        features: ["Soft cotton", "Regular fit", "Breathable fabric"],
        specifications: { Material: "Cotton", Fit: "Regular", Gender: "Unisex" },
        tags: ["shirt", "clothing", "fashion"]
    },
    {
        id: 7,
        name: "Premium Running Shoes",
        brand: "Nike",
        category: "Fashion",
        price: 4999,
        originalPrice: 6499,
        rating: 4.8,
        reviewsCount: 201,
        stock_status: "In Stock",
        description: "Lightweight running shoes with cushioned support.",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900"],
        features: ["Lightweight construction", "Cushioned sole", "Breathable upper"],
        specifications: { Type: "Running", Sole: "Rubber", Closure: "Lace-up" },
        tags: ["shoes", "running", "sneakers"]
    },
    {
        id: 8,
        name: "Luxury Leather Backpack",
        brand: "TravelPro",
        category: "Fashion",
        price: 2799,
        originalPrice: 3999,
        rating: 4.4,
        reviewsCount: 63,
        stock_status: "In Stock",
        description: "Stylish everyday backpack with spacious storage.",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900"],
        features: ["Multiple compartments", "Laptop storage", "Adjustable straps"],
        specifications: { Material: "Leather-style", Capacity: "20 litres", Type: "Backpack" },
        tags: ["bag", "backpack", "travel"]
    },
    {
        id: 9,
        name: "JavaScript Programming Guide",
        brand: "Tech Books",
        category: "Books",
        price: 599,
        originalPrice: 899,
        rating: 4.9,
        reviewsCount: 143,
        stock_status: "In Stock",
        description: "Learn modern JavaScript programming through practical examples.",
        images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900"],
        features: ["Beginner friendly", "Practical examples", "Modern JavaScript"],
        specifications: { Format: "Paperback", Language: "English", Subject: "Programming" },
        tags: ["javascript", "coding", "programming"]
    },
    {
        id: 10,
        name: "Modern Interior Design Book",
        brand: "Design House",
        category: "Books",
        price: 749,
        originalPrice: 999,
        rating: 4.6,
        reviewsCount: 48,
        stock_status: "In Stock",
        description: "Explore beautiful interior design concepts and inspiration.",
        images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900"],
        features: ["Design inspiration", "Colour concepts", "Room layouts"],
        specifications: { Format: "Hardcover", Language: "English", Subject: "Interior design" },
        tags: ["design", "book", "interior"]
    },
    {
        id: 11,
        name: "Modern Table Lamp",
        brand: "HomeGlow",
        category: "Home & Living",
        price: 1599,
        originalPrice: 2199,
        rating: 4.5,
        reviewsCount: 67,
        stock_status: "In Stock",
        description: "Elegant table lamp that adds warmth to your living space.",
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900"],
        features: ["Modern design", "Warm lighting", "Compact size"],
        specifications: { Type: "Table lamp", Power: "LED", Style: "Modern" },
        tags: ["lamp", "lighting", "home"]
    },
    {
        id: 12,
        name: "Minimal Ceramic Vase",
        brand: "HomeGlow",
        category: "Home & Living",
        price: 899,
        originalPrice: 1299,
        rating: 4.3,
        reviewsCount: 39,
        stock_status: "In Stock",
        description: "Minimal decorative vase for modern interiors.",
        images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900"],
        features: ["Minimal design", "Decorative finish", "Versatile styling"],
        specifications: { Material: "Ceramic", Style: "Minimal", Use: "Decoration" },
        tags: ["vase", "decor", "home"]
    },
    {
        id: 13,
        name: "Professional Football",
        brand: "SportsPro",
        category: "Sports & Outdoors",
        price: 1299,
        originalPrice: 1799,
        rating: 4.7,
        reviewsCount: 85,
        stock_status: "In Stock",
        description: "Durable football suitable for training and recreational matches.",
        images: ["https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900"],
        features: ["Durable construction", "Good grip", "Match-style design"],
        specifications: { Sport: "Football", Type: "Training", Surface: "Multi-surface" },
        tags: ["football", "sports", "ball"]
    },
    {
        id: 14,
        name: "Yoga Fitness Mat",
        brand: "FitLife",
        category: "Sports & Outdoors",
        price: 999,
        originalPrice: 1499,
        rating: 4.6,
        reviewsCount: 91,
        stock_status: "In Stock",
        description: "Comfortable non-slip exercise mat for yoga and workouts.",
        images: ["https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=900"],
        features: ["Non-slip surface", "Lightweight", "Easy to carry"],
        specifications: { Material: "Foam", Use: "Yoga and fitness", Thickness: "6 mm" },
        tags: ["yoga", "fitness", "exercise"]
    },
    {
        id: 15,
        name: "Portable Bluetooth Speaker",
        brand: "SoundWave",
        category: "Electronics",
        price: 1999,
        originalPrice: 2799,
        rating: 4.6,
        reviewsCount: 122,
        stock_status: "In Stock",
        description: "Portable speaker with clear sound for indoor and outdoor use.",
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900"],
        features: ["Bluetooth audio", "Portable design", "Rechargeable battery"],
        specifications: { Connectivity: "Bluetooth", Type: "Portable speaker" },
        tags: ["speaker", "audio", "bluetooth"]
    },
    {
        id: 16,
        name: "Premium Sunglasses",
        brand: "Urban Style",
        category: "Fashion",
        price: 1499,
        originalPrice: 1999,
        rating: 4.4,
        reviewsCount: 58,
        stock_status: "In Stock",
        description: "Contemporary sunglasses for everyday style.",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900"],
        features: ["UV protection", "Lightweight frame", "Classic styling"],
        specifications: { Type: "Sunglasses", Style: "Classic", Gender: "Unisex" },
        tags: ["sunglasses", "fashion", "accessories"]
    },
    {
        id: 17,
        name: "Wireless Earbuds",
        brand: "SoundWave",
        category: "Electronics",
        price: 2299,
        originalPrice: 2999,
        rating: 4.5,
        reviewsCount: 107,
        stock_status: "In Stock",
        description: "Compact wireless earbuds for music, calls and everyday listening.",
        images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900"],
        features: ["Wireless audio", "Compact charging case", "Touch controls"],
        specifications: { Connectivity: "Bluetooth", Type: "In-ear" },
        tags: ["earbuds", "audio", "wireless"]
    },
    {
        id: 18,
        name: "Gaming Controller",
        brand: "GameZone",
        category: "Gaming",
        price: 3499,
        originalPrice: 4299,
        rating: 4.7,
        reviewsCount: 89,
        stock_status: "In Stock",
        description: "Comfortable controller for immersive gaming sessions.",
        images: ["https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=900"],
        features: ["Ergonomic design", "Responsive controls", "Wireless support"],
        specifications: { Type: "Game controller", Connectivity: "Wireless" },
        tags: ["gaming", "controller"]
    }
];

const reviews = [
    {
        id: 1,
        productId: 1,
        userName: "Aarav",
        rating: 5,
        comment: "Excellent sound quality and comfortable design.",
        date: "2026-10-12"
    },
    {
        id: 2,
        productId: 7,
        userName: "Priya",
        rating: 5,
        comment: "Very comfortable shoes. Great for daily use.",
        date: "2026-10-18"
    },
    {
        id: 3,
        productId: 9,
        userName: "Rahul",
        rating: 4,
        comment: "A useful book with practical coding examples.",
        date: "2026-10-21"
    }
];

// Demo accounts only. Do not use real passwords here.
const users = [
    {
        id: 1,
        name: "ShowCase Admin",
        email: "admin@showcase.com",
        password: "admin123",
        role: "admin"
    },
    {
        id: 2,
        name: "Demo Customer",
        email: "customer@showcase.com",
        password: "user123",
        role: "customer"
    }
];

// Versioned storage keys ensure the upgraded catalogue is initialized.
const STORAGE_KEYS = {
    products: "showcase_v2_products",
    reviews: "showcase_v2_reviews",
    users: "showcase_v2_users",
    wishlist: "showcase_v2_wishlist",
    comparison: "showcase_v2_comparison"
};

function initializeStorage() {
    const defaults = {
        [STORAGE_KEYS.products]: products,
        [STORAGE_KEYS.reviews]: reviews,
        [STORAGE_KEYS.users]: users,
        [STORAGE_KEYS.wishlist]: [],
        [STORAGE_KEYS.comparison]: []
    };

    Object.entries(defaults).forEach(([key, value]) => {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });
}

function getStoredData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error("Could not read local data:", key, error);
        return [];
    }
}

function saveStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

initializeStorage();

console.log("ShowCase V2 database initialized.");
