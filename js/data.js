
// ==========================================
// SHOWCASE - PRODUCT DATA
// ==========================================

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "💻",
    description: "Discover the latest technology and gadgets.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "👕",
    description: "Upgrade your style with modern fashion.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "books",
    name: "Books",
    icon: "📚",
    description: "Explore books that inspire and educate.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "home",
    name: "Home & Living",
    icon: "🏡",
    description: "Make your home beautiful and comfortable.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    icon: "🏃",
    description: "Gear up for fitness and outdoor adventures.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    description: "Explore gaming accessories and equipment.",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85"
  }
];

let products = [
  // ==========================================
  // ELECTRONICS
  // ==========================================

  {
    id: 1,
    name: "Wireless Headphones Pro",
    brand: "SoundMax",
    category: "Electronics",
    price: 2499,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 245,
    stock_status: "In Stock",
    description: "Experience immersive sound with premium wireless headphones featuring active noise cancellation, deep bass and comfortable ear cushions.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Active Noise Cancellation",
      "Bluetooth 5.3",
      "40-hour battery life",
      "Built-in microphone",
      "Fast charging"
    ],
    specifications: {
      "Brand": "SoundMax",
      "Connectivity": "Bluetooth 5.3",
      "Battery Life": "40 Hours",
      "Type": "Over-Ear",
      "Warranty": "1 Year"
    },
    tags: ["headphones", "audio", "wireless", "electronics"]
  },

  {
    id: 2,
    name: "Smart Watch Ultra",
    brand: "TechFit",
    category: "Electronics",
    price: 3299,
    originalPrice: 4999,
    rating: 4.6,
    reviewsCount: 189,
    stock_status: "In Stock",
    description: "Track your health, fitness and daily activities with this stylish smartwatch featuring a bright display and multiple sports modes.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Heart rate monitoring",
      "Sleep tracking",
      "Multiple sports modes",
      "Water resistant",
      "Smart notifications"
    ],
    specifications: {
      "Brand": "TechFit",
      "Display": "AMOLED",
      "Battery Life": "7 Days",
      "Connectivity": "Bluetooth",
      "Warranty": "1 Year"
    },
    tags: ["watch", "smartwatch", "fitness", "electronics"]
  },

  {
    id: 3,
    name: "Professional DSLR Camera",
    brand: "CapturePro",
    category: "Electronics",
    price: 42999,
    originalPrice: 49999,
    rating: 4.9,
    reviewsCount: 112,
    stock_status: "In Stock",
    description: "Capture stunning photographs and videos with a professional camera designed for creators and photography enthusiasts.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "24MP image sensor",
      "4K video recording",
      "Interchangeable lenses",
      "Autofocus system",
      "Wi-Fi connectivity"
    ],
    specifications: {
      "Brand": "CapturePro",
      "Resolution": "24MP",
      "Video": "4K",
      "Connectivity": "Wi-Fi",
      "Warranty": "2 Years"
    },
    tags: ["camera", "photography", "dslr", "electronics"]
  },

  {
    id: 4,
    name: "Ultra Slim Laptop",
    brand: "NovaTech",
    category: "Electronics",
    price: 58999,
    originalPrice: 69999,
    rating: 4.7,
    reviewsCount: 156,
    stock_status: "In Stock",
    description: "A powerful and lightweight laptop for productivity, programming, entertainment and everyday computing.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "16GB RAM",
      "512GB SSD",
      "Full HD display",
      "Lightweight design",
      "Fast charging"
    ],
    specifications: {
      "Brand": "NovaTech",
      "RAM": "16GB",
      "Storage": "512GB SSD",
      "Display": "15.6 Inch",
      "Warranty": "1 Year"
    },
    tags: ["laptop", "computer", "programming", "electronics"]
  },

  // ==========================================
  // FASHION
  // ==========================================

  {
    id: 5,
    name: "Premium Running Sneakers",
    brand: "UrbanStep",
    category: "Fashion",
    price: 1899,
    originalPrice: 2999,
    rating: 4.5,
    reviewsCount: 320,
    stock_status: "In Stock",
    description: "Comfortable everyday sneakers featuring a modern design, breathable material and cushioned sole.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Lightweight construction",
      "Breathable upper",
      "Cushioned sole",
      "Modern sporty design",
      "Durable material"
    ],
    specifications: {
      "Brand": "UrbanStep",
      "Material": "Mesh and Rubber",
      "Type": "Running Shoes",
      "Color": "Red",
      "Warranty": "6 Months"
    },
    tags: ["shoes", "sneakers", "fashion", "sports"]
  },

  {
    id: 6,
    name: "Classic Leather Handbag",
    brand: "StyleCraft",
    category: "Fashion",
    price: 2799,
    originalPrice: 3999,
    rating: 4.7,
    reviewsCount: 143,
    stock_status: "In Stock",
    description: "An elegant handbag with a spacious interior, premium finish and versatile design for everyday use.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Premium finish",
      "Spacious compartments",
      "Durable handles",
      "Elegant design",
      "Everyday functionality"
    ],
    specifications: {
      "Brand": "StyleCraft",
      "Material": "Faux Leather",
      "Type": "Handbag",
      "Color": "Brown",
      "Warranty": "6 Months"
    },
    tags: ["handbag", "bag", "fashion", "accessories"]
  },

  {
    id: 7,
    name: "Casual Cotton T-Shirt",
    brand: "TrendWear",
    category: "Fashion",
    price: 599,
    originalPrice: 999,
    rating: 4.4,
    reviewsCount: 278,
    stock_status: "In Stock",
    description: "A soft and comfortable cotton T-shirt with a versatile design suitable for casual everyday outfits.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Soft cotton fabric",
      "Breathable material",
      "Comfortable fit",
      "Easy maintenance",
      "Casual styling"
    ],
    specifications: {
      "Brand": "TrendWear",
      "Material": "Cotton",
      "Fit": "Regular",
      "Sleeve": "Half Sleeve",
      "Warranty": "No Warranty"
    },
    tags: ["tshirt", "clothing", "cotton", "fashion"]
  },

  {
    id: 8,
    name: "Travel Backpack",
    brand: "Explorer",
    category: "Fashion",
    price: 1499,
    originalPrice: 2299,
    rating: 4.6,
    reviewsCount: 205,
    stock_status: "In Stock",
    description: "A versatile backpack with multiple compartments, comfortable straps and plenty of space for travel essentials.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Multiple compartments",
      "Padded shoulder straps",
      "Laptop compartment",
      "Water-resistant fabric",
      "Travel-friendly design"
    ],
    specifications: {
      "Brand": "Explorer",
      "Capacity": "30 Litres",
      "Material": "Polyester",
      "Laptop Support": "15.6 Inch",
      "Warranty": "1 Year"
    },
    tags: ["backpack", "travel", "bag", "fashion"]
  },

  // ==========================================
  // BOOKS
  // ==========================================

  {
    id: 9,
    name: "The Art of Programming",
    brand: "Knowledge House",
    category: "Books",
    price: 499,
    originalPrice: 799,
    rating: 4.8,
    reviewsCount: 187,
    stock_status: "In Stock",
    description: "A practical learning resource covering programming concepts, problem solving and software development fundamentals.",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Programming fundamentals",
      "Practical examples",
      "Problem-solving exercises",
      "Beginner-friendly explanations",
      "Learning projects"
    ],
    specifications: {
      "Publisher": "Knowledge House",
      "Format": "Paperback",
      "Language": "English",
      "Pages": "320",
      "Category": "Technology"
    },
    tags: ["programming", "coding", "technology", "books"]
  },

  {
    id: 10,
    name: "Business Success Guide",
    brand: "Bright Reads",
    category: "Books",
    price: 349,
    originalPrice: 599,
    rating: 4.5,
    reviewsCount: 96,
    stock_status: "In Stock",
    description: "Explore practical ideas for leadership, productivity, decision-making and building successful business habits.",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Leadership principles",
      "Productivity strategies",
      "Business insights",
      "Practical examples",
      "Personal development"
    ],
    specifications: {
      "Publisher": "Bright Reads",
      "Format": "Paperback",
      "Language": "English",
      "Pages": "250",
      "Category": "Business"
    },
    tags: ["business", "success", "leadership", "books"]
  },

  {
    id: 11,
    name: "Creative Thinking Handbook",
    brand: "MindWorks",
    category: "Books",
    price: 399,
    originalPrice: 650,
    rating: 4.6,
    reviewsCount: 118,
    stock_status: "In Stock",
    description: "Develop creativity and learn techniques to approach challenges with fresh ideas and innovative thinking.",
    images: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Creative exercises",
      "Innovation techniques",
      "Critical thinking",
      "Practical activities",
      "Easy-to-follow chapters"
    ],
    specifications: {
      "Publisher": "MindWorks",
      "Format": "Paperback",
      "Language": "English",
      "Pages": "280",
      "Category": "Self Development"
    },
    tags: ["creativity", "thinking", "learning", "books"]
  },

  {
    id: 12,
    name: "Modern Web Development",
    brand: "Code Academy Press",
    category: "Books",
    price: 699,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 164,
    stock_status: "In Stock",
    description: "Learn modern web development concepts, frontend technologies and practical techniques for building websites.",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "HTML and CSS concepts",
      "JavaScript fundamentals",
      "Frontend development",
      "Project-based learning",
      "Modern development practices"
    ],
    specifications: {
      "Publisher": "Code Academy Press",
      "Format": "Paperback",
      "Language": "English",
      "Pages": "420",
      "Category": "Technology"
    },
    tags: ["web development", "javascript", "html", "books"]
  },

  // ==========================================
  // HOME & LIVING
  // ==========================================

  {
    id: 13,
    name: "Modern Comfort Sofa",
    brand: "HomeStyle",
    category: "Home & Living",
    price: 18999,
    originalPrice: 24999,
    rating: 4.7,
    reviewsCount: 82,
    stock_status: "In Stock",
    description: "A contemporary sofa designed to bring comfort and elegance to your living room.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Modern design",
      "Comfortable cushioning",
      "Durable frame",
      "Easy-care upholstery",
      "Spacious seating"
    ],
    specifications: {
      "Brand": "HomeStyle",
      "Material": "Fabric",
      "Seating": "3 Seater",
      "Color": "Grey",
      "Warranty": "2 Years"
    },
    tags: ["sofa", "furniture", "living room", "home"]
  },

  {
    id: 14,
    name: "Decorative Table Lamp",
    brand: "GlowSpace",
    category: "Home & Living",
    price: 899,
    originalPrice: 1499,
    rating: 4.4,
    reviewsCount: 132,
    stock_status: "In Stock",
    description: "Add a warm and stylish touch to your bedroom or living room with this decorative table lamp.",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Elegant design",
      "Warm lighting",
      "Compact size",
      "Easy operation",
      "Suitable for bedrooms"
    ],
    specifications: {
      "Brand": "GlowSpace",
      "Type": "Table Lamp",
      "Light": "LED",
      "Material": "Metal",
      "Warranty": "1 Year"
    },
    tags: ["lamp", "lighting", "decor", "home"]
  },

  {
    id: 15,
    name: "Minimalist Wall Clock",
    brand: "TimeCraft",
    category: "Home & Living",
    price: 699,
    originalPrice: 1199,
    rating: 4.5,
    reviewsCount: 91,
    stock_status: "In Stock",
    description: "A clean and minimalist wall clock that complements modern home interiors.",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Minimalist appearance",
      "Quiet movement",
      "Easy wall mounting",
      "Clear number markings",
      "Lightweight construction"
    ],
    specifications: {
      "Brand": "TimeCraft",
      "Type": "Wall Clock",
      "Material": "Wood and Metal",
      "Power": "AA Battery",
      "Warranty": "1 Year"
    },
    tags: ["clock", "wall clock", "decor", "home"]
  },

  {
    id: 16,
    name: "Premium Cushion Set",
    brand: "CozyNest",
    category: "Home & Living",
    price: 799,
    originalPrice: 1299,
    rating: 4.6,
    reviewsCount: 108,
    stock_status: "In Stock",
    description: "Refresh your living space with soft decorative cushions designed for comfort and style.",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Soft fabric",
      "Comfortable filling",
      "Decorative appearance",
      "Removable covers",
      "Easy maintenance"
    ],
    specifications: {
      "Brand": "CozyNest",
      "Material": "Polyester",
      "Set": "2 Cushions",
      "Color": "Neutral",
      "Warranty": "No Warranty"
    },
    tags: ["cushion", "pillows", "decor", "home"]
  },

  // ==========================================
  // SPORTS & OUTDOORS
  // ==========================================

  {
    id: 17,
    name: "Professional Yoga Mat",
    brand: "FlexFit",
    category: "Sports & Outdoors",
    price: 899,
    originalPrice: 1499,
    rating: 4.7,
    reviewsCount: 212,
    stock_status: "In Stock",
    description: "Improve your yoga and workout sessions with a comfortable, non-slip exercise mat.",
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Non-slip surface",
      "Comfortable cushioning",
      "Lightweight design",
      "Easy to roll",
      "Suitable for yoga and exercise"
    ],
    specifications: {
      "Brand": "FlexFit",
      "Material": "TPE",
      "Thickness": "6mm",
      "Type": "Exercise Mat",
      "Warranty": "6 Months"
    },
    tags: ["yoga", "fitness", "exercise", "sports"]
  },

  {
    id: 18,
    name: "Adjustable Dumbbell Set",
    brand: "PowerZone",
    category: "Sports & Outdoors",
    price: 2499,
    originalPrice: 3499,
    rating: 4.8,
    reviewsCount: 176,
    stock_status: "In Stock",
    description: "Build strength at home with a versatile dumbbell set designed for different workout routines.",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Adjustable weight",
      "Comfortable grip",
      "Durable construction",
      "Home workout friendly",
      "Compact storage"
    ],
    specifications: {
      "Brand": "PowerZone",
      "Type": "Dumbbell Set",
      "Weight": "20 KG",
      "Material": "Metal",
      "Warranty": "1 Year"
    },
    tags: ["dumbbells", "gym", "fitness", "sports"]
  },

  {
    id: 19,
    name: "Outdoor Adventure Backpack",
    brand: "TrailMaster",
    category: "Sports & Outdoors",
    price: 1799,
    originalPrice: 2599,
    rating: 4.5,
    reviewsCount: 87,
    stock_status: "In Stock",
    description: "A practical outdoor backpack with generous storage and comfortable support for hiking and adventure trips.",
    images: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Large storage space",
      "Adjustable straps",
      "Multiple pockets",
      "Outdoor-friendly design",
      "Lightweight construction"
    ],
    specifications: {
      "Brand": "TrailMaster",
      "Capacity": "35 Litres",
      "Material": "Nylon",
      "Type": "Hiking Backpack",
      "Warranty": "1 Year"
    },
    tags: ["hiking", "outdoor", "backpack", "sports"]
  },

  {
    id: 20,
    name: "Fitness Training Shoes",
    brand: "ActiveStep",
    category: "Sports & Outdoors",
    price: 2199,
    originalPrice: 3299,
    rating: 4.6,
    reviewsCount: 143,
    stock_status: "In Stock",
    description: "Versatile training shoes offering comfort, stability and support for gym workouts and everyday fitness.",
    images: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Lightweight design",
      "Flexible sole",
      "Comfortable fit",
      "Breathable upper",
      "Training-friendly support"
    ],
    specifications: {
      "Brand": "ActiveStep",
      "Type": "Training Shoes",
      "Material": "Mesh",
      "Sole": "Rubber",
      "Warranty": "6 Months"
    },
    tags: ["shoes", "training", "fitness", "sports"]
  },

  // ==========================================
  // GAMING
  // ==========================================

  {
    id: 21,
    name: "RGB Gaming Keyboard",
    brand: "GameCore",
    category: "Gaming",
    price: 1799,
    originalPrice: 2699,
    rating: 4.7,
    reviewsCount: 198,
    stock_status: "In Stock",
    description: "Enhance your gaming setup with a responsive keyboard featuring RGB lighting and a comfortable typing experience.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "RGB backlighting",
      "Responsive keys",
      "Gaming mode",
      "Durable construction",
      "USB connectivity"
    ],
    specifications: {
      "Brand": "GameCore",
      "Type": "Gaming Keyboard",
      "Lighting": "RGB",
      "Connectivity": "USB",
      "Warranty": "1 Year"
    },
    tags: ["keyboard", "gaming", "rgb", "computer"]
  },

  {
    id: 22,
    name: "Wireless Gaming Mouse",
    brand: "PixelPlay",
    category: "Gaming",
    price: 999,
    originalPrice: 1599,
    rating: 4.5,
    reviewsCount: 165,
    stock_status: "In Stock",
    description: "Enjoy precise control and smooth movement with an ergonomic wireless mouse designed for gaming.",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Wireless connectivity",
      "Adjustable DPI",
      "Ergonomic design",
      "Responsive buttons",
      "Rechargeable battery"
    ],
    specifications: {
      "Brand": "PixelPlay",
      "Type": "Gaming Mouse",
      "Connectivity": "Wireless",
      "DPI": "Up to 6400",
      "Warranty": "1 Year"
    },
    tags: ["mouse", "gaming", "wireless", "computer"]
  },

  {
    id: 23,
    name: "Gaming Headset Pro",
    brand: "GameSound",
    category: "Gaming",
    price: 2299,
    originalPrice: 3499,
    rating: 4.8,
    reviewsCount: 221,
    stock_status: "In Stock",
    description: "Experience immersive gaming audio with a comfortable headset featuring a built-in microphone and powerful sound.",
    images: [
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Surround sound experience",
      "Noise-reducing microphone",
      "Comfortable ear cushions",
      "Adjustable headband",
      "Multi-platform support"
    ],
    specifications: {
      "Brand": "GameSound",
      "Type": "Gaming Headset",
      "Connectivity": "Wired",
      "Microphone": "Built-in",
      "Warranty": "1 Year"
    },
    tags: ["headset", "gaming", "audio", "microphone"]
  },

  {
    id: 24,
    name: "Gaming Controller",
    brand: "NextPlay",
    category: "Gaming",
    price: 1599,
    originalPrice: 2499,
    rating: 4.6,
    reviewsCount: 134,
    stock_status: "In Stock",
    description: "Take control of your favourite games with an ergonomic controller designed for comfortable and responsive gameplay.",
    images: [
      "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=900&q=85"
    ],
    features: [
      "Ergonomic design",
      "Responsive buttons",
      "Comfortable grip",
      "Wireless connectivity",
      "Multi-game support"
    ],
    specifications: {
      "Brand": "NextPlay",
      "Type": "Gaming Controller",
      "Connectivity": "Wireless",
      "Compatibility": "PC and Supported Devices",
      "Warranty": "1 Year"
    },
    tags: ["controller", "gaming", "gamepad", "accessories"]
  }
];

// ==========================================
// SAMPLE CUSTOMER REVIEWS
// ==========================================

const defaultReviews = [
  {
    id: 1,
    productId: 1,
    userName: "Rahul",
    rating: 5,
    comment: "Excellent sound quality and very comfortable. Battery backup is impressive.",
    date: "2026-10-12"
  },
  {
    id: 2,
    productId: 2,
    userName: "Priya",
    rating: 5,
    comment: "Beautiful design and useful fitness tracking features. Great value.",
    date: "2026-10-15"
  },
  {
    id: 3,
    productId: 5,
    userName: "Arjun",
    rating: 4,
    comment: "Comfortable shoes with a stylish look. Good for everyday use.",
    date: "2026-10-18"
  },
  {
    id: 4,
    productId: 21,
    userName: "Sneha",
    rating: 5,
    comment: "The RGB lighting looks great and the keyboard feels responsive.",
    date: "2026-10-20"
  }
];

// ==========================================
// DEMO USERS
// ==========================================

const defaultUsers = [
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
    email: "user@showcase.com",
    password: "user123",
    role: "customer"
  }
];

// ==========================================
// LOCAL STORAGE CONFIGURATION
// ==========================================

const STORAGE_KEYS = {
  products: "showcase_v2_products",
  reviews: "showcase_v2_reviews",
  users: "showcase_v2_users",
  wishlist: "showcase_v2_wishlist",
  comparison: "showcase_v2_comparison"
};

// ==========================================
// STORAGE HELPER FUNCTIONS
// ==========================================

function getStoredData(key, fallbackData = []) {
  try {
    const savedData = localStorage.getItem(key);

    if (savedData === null) {
      return fallbackData;
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Error reading local storage:", error);
    return fallbackData;
  }
}

function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving local storage:", error);
    return false;
  }
}

// ==========================================
// INITIALIZE APPLICATION DATA
// ==========================================

function initializeStorage() {
  // Initialize products only if they do not already exist.
  if (localStorage.getItem(STORAGE_KEYS.products) === null) {
    saveStoredData(STORAGE_KEYS.products, products);
  }

  // Initialize sample reviews.
  if (localStorage.getItem(STORAGE_KEYS.reviews) === null) {
    saveStoredData(STORAGE_KEYS.reviews, defaultReviews);
  }

  // Load existing users without deleting registered accounts.
  let users = getStoredData(STORAGE_KEYS.users, []);

  if (!Array.isArray(users)) {
    users = [];
  }

  // Restore or update the admin account.
  const adminEmail = "admin@showcase.com";

  const adminIndex = users.findIndex(user =>
    user.email &&
    user.email.toLowerCase() === adminEmail
  );

  if (adminIndex === -1) {
    users.push(defaultUsers[0]);
  } else {
    users[adminIndex] = {
      ...users[adminIndex],
      ...defaultUsers[0]
    };
  }

  // Add the demo customer only if it does not already exist.
  const customerEmail = "user@showcase.com";

  const customerExists = users.some(user =>
    user.email &&
    user.email.toLowerCase() === customerEmail
  );

  if (!customerExists) {
    users.push(defaultUsers[1]);
  }

  saveStoredData(STORAGE_KEYS.users, users);

  // Initialize wishlist.
  if (localStorage.getItem(STORAGE_KEYS.wishlist) === null) {
    saveStoredData(STORAGE_KEYS.wishlist, []);
  }

  // Initialize comparison list.
  if (localStorage.getItem(STORAGE_KEYS.comparison) === null) {
    saveStoredData(STORAGE_KEYS.comparison, []);
  }

  // Load saved products.
  products = getStoredData(STORAGE_KEYS.products, products);
}

// ==========================================
// INITIALIZE DATA WHEN SCRIPT LOADS
// ==========================================

initializeStorage();
