// ==========================================
// SHOWCASE - PRODUCT REVIEWS
// ==========================================

const REVIEWS_KEY = "showcase_reviews";

// Get all reviews
function getReviews() {
    const reviews = getStoredData(REVIEWS_KEY, []);
    return Array.isArray(reviews) ? reviews : [];
}

// Save reviews
function saveReviews(reviews) {
    saveStoredData(REVIEWS_KEY, reviews);
}

// Get reviews for a specific product
function getProductReviews(productId) {
    return getReviews().filter(
        review => Number(review.productId) === Number(productId)
    );
}

// Calculate average product rating
function getAverageRating(productId) {
    const reviews = getProductReviews(productId);

    if (reviews.length === 0) {
        const product = getProducts().find(
            item => Number(item.id) === Number(productId)
        );

        return Number(product?.rating || 0);
    }

    const total = reviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0
    );

    return total / reviews.length;
}

// Display star rating
function getStarRating(rating) {
    const roundedRating = Math.max(
        0,
        Math.min(5, Math.round(Number(rating) || 0))
    );

    return "★".repeat(roundedRating) +
        "☆".repeat(5 - roundedRating);
}

// Submit a product review
function submitReview(event, productId) {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        if (typeof showToast === "function") {
            showToast("Please login to submit a review.", "warning");
        }

        if (typeof showSection === "function") {
            showSection("login");
        }

        return;
    }

    const form = event.target;
    const ratingInput = form.querySelector('[name="rating"]');
    const commentInput = form.querySelector('[name="comment"]');

    const rating = Number(ratingInput?.value);
    const comment = commentInput?.value.trim();

    if (!rating || rating < 1 || rating > 5) {
        showToast("Please select a rating from 1 to 5.", "warning");
        return;
    }

    if (!comment) {
        showToast("Please enter your review.", "warning");
        return;
    }

    const product = getProducts().find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) {
        showToast("Product not found.", "error");
        return;
    }

    const reviews = getReviews();

    const alreadyReviewed = reviews.some(review =>
        Number(review.productId) === Number(productId) &&
        (
            String(review.userId) === String(currentUser.id) ||
            review.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()
        )
    );

    if (alreadyReviewed) {
        showToast("You have already reviewed this product.", "warning");
        return;
    }

    const review = {
        id: generateId(),
        productId: product.id,
        productName: product.name,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        rating,
        comment,
        createdAt: new Date().toISOString()
    };

    reviews.unshift(review);
    saveReviews(reviews);

    form.reset();

    showToast("Your review has been submitted successfully.", "success");

    displayReviews();

    if (typeof displayProducts === "function") {
        displayProducts(
            currentProductList.length
                ? currentProductList
                : getProducts()
        );
    }
}

// Delete a review
function deleteReview(reviewId) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        showToast("Please login first.", "warning");
        return;
    }

    const reviews = getReviews();

    const review = reviews.find(
        item => String(item.id) === String(reviewId)
    );

    if (!review) {
        showToast("Review not found.", "error");
        return;
    }

    const isOwner =
        String(review.userId) === String(currentUser.id) ||
        review.userEmail?.toLowerCase() === currentUser.email?.toLowerCase();

    if (!isOwner) {
        showToast("You can only delete your own reviews.", "error");
        return;
    }

    const updatedReviews = reviews.filter(
        item => String(item.id) !== String(reviewId)
    );

    saveReviews(updatedReviews);
    displayReviews();

    showToast("Review deleted successfully.", "success");
}

// Display all reviews
function displayReviews() {
    const container = document.getElementById("reviewsContent");

    if (!container) return;

    const reviews = getReviews();

    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Reviews Yet</h3>
                <p>Product reviews will appear here after customers submit them.</p>
                <button
                    class="btn btn-primary"
                    onclick="showSection('products')"
                >
                    Explore Products
                </button>
            </div>
        `;
        return;
    }

    const currentUser = getCurrentUser();

    container.innerHTML = `
        <div class="reviews-heading">
            <h3>Customer Reviews</h3>
            <p>Read what customers think about our products.</p>
        </div>

        <div class="reviews-list">
            ${reviews.map(review => {
                const product = getProducts().find(
                    item => Number(item.id) === Number(review.productId)
                );

                const isOwner = currentUser && (
                    String(review.userId) === String(currentUser.id) ||
                    review.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()
                );

                return `
                    <article class="review-card">
                        <div class="review-card-header">
                            <div>
                                <h4>${escapeHTML(review.userName || "Customer")}</h4>
                                <span class="review-date">
                                    ${review.createdAt
                                        ? new Date(review.createdAt).toLocaleDateString()
                                        : ""}
                                </span>
                            </div>

                            <div class="review-rating">
                                ${getStarRating(review.rating)}
                                <span>${Number(review.rating)}/5</span>
                            </div>
                        </div>

                        <p class="review-product-name">
                            Product:
                            <strong>${escapeHTML(
                                product?.name || review.productName || "Product"
                            )}</strong>
                        </p>

                        <p class="review-comment">
                            ${escapeHTML(review.comment || "")}
                        </p>

                        ${
                            isOwner
                                ? `<button
                                    class="btn btn-danger btn-small"
                                    onclick="deleteReview('${String(review.id).replace(/'/g, "\\'")}')"
                                >
                                    Delete My Review
                                </button>`
                                : ""
                        }
                    </article>
                `;
            }).join("")}
        </div>
    `;
}

// Display review form for a product
function displayReviewForm(productId) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return `
            <div class="review-login-notice">
                <p>Please login to write a review.</p>
                <button
                    class="btn btn-primary btn-small"
                    onclick="showSection('login')"
                >
                    Login
                </button>
            </div>
        `;
    }

    const alreadyReviewed = getReviews().some(review =>
        Number(review.productId) === Number(productId) &&
        (
            String(review.userId) === String(currentUser.id) ||
            review.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()
        )
    );

    if (alreadyReviewed) {
        return `
            <p class="review-login-notice">
                You have already submitted a review for this product.
            </p>
        `;
    }

    return `
        <form
            class="review-form"
            onsubmit="submitReview(event, ${Number(productId)})"
        >
            <h4>Write a Review</h4>

            <label for="reviewRating">Your Rating</label>
            <select id="reviewRating" name="rating" required>
                <option value="">Select rating</option>
                <option value="5">★★★★★ - Excellent</option>
                <option value="4">★★★★ - Very Good</option>
                <option value="3">★★★ - Good</option>
                <option value="2">★★ - Fair</option>
                <option value="1">★ - Poor</option>
            </select>

            <label for="reviewComment">Your Review</label>
            <textarea
                id="reviewComment"
                name="comment"
                rows="4"
                maxlength="1000"
                placeholder="Share your experience with this product..."
                required
            ></textarea>

            <button type="submit" class="btn btn-primary">
                Submit Review
            </button>
        </form>
    `;
}

// Initialize reviews
function initializeReviews() {
    displayReviews();
}