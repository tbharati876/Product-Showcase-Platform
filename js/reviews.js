
// ==========================================
// SHOWCASE - CUSTOMER REVIEWS MODULE
// ==========================================

// ==========================================
// GET REVIEWS
// ==========================================

function getReviews() {
  return getStoredData(STORAGE_KEYS.reviews, defaultReviews);
}

// ==========================================
// SAVE REVIEWS
// ==========================================

function saveReviews(reviews) {
  return saveStoredData(STORAGE_KEYS.reviews, reviews);
}

// ==========================================
// GET PRODUCT REVIEWS
// ==========================================

function getProductReviews(productId) {
  return getReviews().filter(
    review => Number(review.productId) === Number(productId)
  );
}

// ==========================================
// CALCULATE AVERAGE RATING
// ==========================================

function calculateAverageRating(productId) {
  const reviews = getProductReviews(productId);

  if (reviews.length === 0) return 0;

  const total = reviews.reduce(
    (sum, review) => sum + Number(review.rating || 0),
    0
  );

  return Number((total / reviews.length).toFixed(1));
}

// ==========================================
// DISPLAY STAR RATING
// ==========================================

function getStarRating(rating) {
  const roundedRating = Math.max(
    0,
    Math.min(5, Math.round(Number(rating) || 0))
  );

  return `
    <span class="review-stars" aria-label="${roundedRating} out of 5 stars">
      ${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}
    </span>
  `;
}

// ==========================================
// DISPLAY ALL REVIEWS
// ==========================================

function displayReviews() {
  const reviewGrid = document.getElementById("reviewGrid");

  if (!reviewGrid) return;

  const reviews = getReviews()
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (reviews.length === 0) {
    reviewGrid.innerHTML = `
      <div class="empty-state">
        <h3>No Reviews Yet</h3>
        <p>Be the first customer to share your experience.</p>
      </div>
    `;
    return;
  }

  reviewGrid.innerHTML = reviews.map(review => {
    const product = getProducts().find(
      item => Number(item.id) === Number(review.productId)
    );

    return `
      <article class="review-card">

        <div class="review-card-header">

          <div class="review-avatar">
            ${escapeHTML(
              (review.userName || "C").charAt(0).toUpperCase()
            )}
          </div>

          <div class="review-user-details">
            <h4>${escapeHTML(review.userName || "Customer")}</h4>

            <small>
              ${escapeHTML(
                review.date || "Recently"
              )}
            </small>
          </div>

        </div>

        <div class="review-rating">
          ${getStarRating(review.rating)}
        </div>

        <p class="review-comment">
          ${escapeHTML(review.comment)}
        </p>

        ${product ? `
          <div class="review-product">
            <span>Reviewed product:</span>
            <strong>${escapeHTML(product.name)}</strong>
          </div>
        ` : ""}

      </article>
    `;
  }).join("");
}

// ==========================================
// CREATE REVIEW FORM
// ==========================================

function createReviewForm() {
  const reviewGrid = document.getElementById("reviewGrid");

  if (!reviewGrid) return;

  let reviewForm = document.getElementById("reviewForm");

  if (reviewForm) return;

  reviewForm = document.createElement("form");
  reviewForm.id = "reviewForm";
  reviewForm.className = "review-form";

  const productOptions = getProducts().map(product => `
    <option value="${Number(product.id)}">
      ${escapeHTML(product.name)}
    </option>
  `).join("");

  reviewForm.innerHTML = `
    <h3>Write a Product Review</h3>

    <div class="form-group">

      <label for="reviewProduct">
        Select Product
      </label>

      <select id="reviewProduct" required>
        <option value="">Choose a product</option>
        ${productOptions}
      </select>

    </div>

    <div class="form-group">

      <label for="reviewRating">
        Your Rating
      </label>

      <select id="reviewRating" required>
        <option value="">Select rating</option>
        <option value="5">★★★★★ - Excellent</option>
        <option value="4">★★★★ - Very Good</option>
        <option value="3">★★★ - Good</option>
        <option value="2">★★ - Fair</option>
        <option value="1">★ - Poor</option>
      </select>

    </div>

    <div class="form-group">

      <label for="reviewComment">
        Your Review
      </label>

      <textarea
        id="reviewComment"
        rows="4"
        placeholder="Share your experience with this product..."
        required
        minlength="5"
        maxlength="1000"
      ></textarea>

    </div>

    <button type="submit" class="btn-primary">
      Submit Review
    </button>

  `;

  reviewGrid.parentElement?.insertBefore(
    reviewForm,
    reviewGrid
  );

  reviewForm.addEventListener("submit", submitReview);
}

// ==========================================
// SUBMIT REVIEW
// ==========================================

function submitReview(event) {
  event.preventDefault();

  const currentUser =
    typeof getCurrentUser === "function"
      ? getCurrentUser()
      : null;

  if (!currentUser) {
    showToast("Please login to submit a review", "error");

    if (typeof showAuthPage === "function") {
      showAuthPage("login");
    }

    return;
  }

  const productId = Number(
    document.getElementById("reviewProduct").value
  );

  const rating = Number(
    document.getElementById("reviewRating").value
  );

  const comment = document
    .getElementById("reviewComment")
    .value.trim();

  if (!productId || rating < 1 || rating > 5 || comment.length < 5) {
    showToast("Please complete all review fields correctly", "error");
    return;
  }

  const reviews = getReviews();

  const newReview = {
    id: Date.now(),
    productId,
    userName: currentUser.name || currentUser.email,
    rating,
    comment,
    date: new Date().toISOString().split("T")[0]
  };

  reviews.push(newReview);

  if (!saveReviews(reviews)) {
    showToast("Could not save your review", "error");
    return;
  }

  // Update product's review count and average rating.
  const updatedProducts = getProducts().map(product => {
    if (Number(product.id) !== productId) {
      return product;
    }

    const productReviews = reviews.filter(
      review => Number(review.productId) === productId
    );

    const average = productReviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0
    ) / productReviews.length;

    return {
      ...product,
      rating: Number(average.toFixed(1)),
      reviewsCount: productReviews.length
    };
  });

  saveStoredData(STORAGE_KEYS.products, updatedProducts);

  // Refresh global product data.
  products = updatedProducts;

  document.getElementById("reviewForm").reset();

  displayReviews();

  if (typeof displayProducts === "function") {
    displayProducts();
  }

  if (typeof displayFeaturedProducts === "function") {
    displayFeaturedProducts();
  }

  showToast("Thank you! Your review has been submitted.", "success");
}

// ==========================================
// INITIALIZE REVIEWS
// ==========================================

function initializeReviews() {
  displayReviews();
  createReviewForm();
}
