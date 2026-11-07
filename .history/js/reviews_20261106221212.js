
function getReviews() {
  return getStoredData(STORAGE_KEYS.reviews) || [];
}

function saveReviews(reviews) {
  saveStoredData(STORAGE_KEYS.reviews, reviews);
}

function escapeReviewText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function getReviewStars(rating) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function displayReviews() {
  const reviewGrid = document.getElementById("reviewGrid");
  if (!reviewGrid) return;

  const reviews = getReviews();

  if (reviews.length === 0) {
    reviewGrid.innerHTML = `
      <div class="empty-reviews">
        <h3>No reviews yet</h3>
        <p>Be the first customer to share your experience.</p>
      </div>`;
    return;
  }

  reviewGrid.innerHTML = reviews
    .slice()
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .map(review => {
      const product = getProducts().find(
        item => String(item.id) === String(review.productId)
      );

      return `
        <article class="review-card">
          <div class="review-card-top">
            <div>
              <h3>${escapeReviewText(review.userName || "Customer")}</h3>
              <p class="review-product">
                ${escapeReviewText(product?.name || review.productName || "Product")}
              </p>
            </div>
            <span class="review-stars" aria-label="${Number(review.rating)} out of 5 stars">
              ${getReviewStars(review.rating)}
            </span>
          </div>
          <p class="review-comment">${escapeReviewText(review.comment)}</p>
          <small>${escapeReviewText(review.date || "")}</small>
        </article>`;
    }).join("");
}

function createReviewForm() {
  let section = document.getElementById("reviews");

  if (!section) {
    section = document.createElement("section");
    section.id = "reviews";
    section.className = "page-section";
    document.querySelector("main")?.appendChild(section);
  }

  if (!section) return;

  let formContainer = document.getElementById("reviewFormContainer");

  if (!formContainer) {
    formContainer = document.createElement("div");
    formContainer.id = "reviewFormContainer";
    formContainer.className = "review-form-container";
    section.prepend(formContainer);
  }

  formContainer.innerHTML = `
    <div class="review-form-heading">
      <span class="section-eyebrow">CUSTOMER FEEDBACK</span>
      <h2>Share your experience</h2>
      <p>Your feedback helps other customers make better decisions.</p>
    </div>

    <form id="customerReviewForm" class="review-form">
      <div class="form-group">
        <label for="reviewProduct">Select product</label>
        <select id="reviewProduct" required>
          <option value="">Choose a product</option>
          ${getProducts().map(product => `
            <option value="${escapeReviewText(product.id)}">
              ${escapeReviewText(product.name)}
            </option>
          `).join("")}
        </select>
      </div>

      <div class="form-group">
        <label>Your rating</label>
        <div class="rating-picker" role="group" aria-label="Choose a rating">
          ${[1, 2, 3, 4, 5].map(number => `
            <button type="button"
              class="rating-star"
              data-rating="${number}"
              aria-label="${number} stars"
              aria-pressed="false">★</button>
          `).join("")}
        </div>
        <input type="hidden" id="reviewRating" value="0">
      </div>

      <div class="form-group">
        <label for="reviewComment">Your review</label>
        <textarea id="reviewComment" rows="4"
          placeholder="Tell us what you liked about this product..."
          maxlength="1000" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary">
        Submit review
      </button>
      <p id="reviewMessage" class="review-message" aria-live="polite"></p>
    </form>
  `;

  const form = document.getElementById("customerReviewForm");
  const ratingInput = document.getElementById("reviewRating");
  const stars = form.querySelectorAll(".rating-star");

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const selectedRating = Number(star.dataset.rating);
      ratingInput.value = selectedRating;

      stars.forEach(item => {
        const active = Number(item.dataset.rating) <= selectedRating;
        item.classList.toggle("selected", active);
        item.setAttribute("aria-pressed", String(
          Number(item.dataset.rating) === selectedRating
        ));
      });
    });
  });

  form.addEventListener("submit", submitCustomerReview);
}

function submitCustomerReview(event) {
  event.preventDefault();

  const message = document.getElementById("reviewMessage");
  const currentUser = typeof getCurrentUser === "function"
    ? getCurrentUser()
    : null;

  if (!currentUser) {
    message.textContent = "Please log in before submitting a review.";
    message.className = "review-message error";
    if (typeof showAuthPage === "function") showAuthPage("login");
    return;
  }

  const productId = document.getElementById("reviewProduct").value;
  const rating = Number(document.getElementById("reviewRating").value);
  const comment = document.getElementById("reviewComment").value.trim();

  if (!productId || !rating || rating < 1 || rating > 5 || !comment) {
    message.textContent = "Please select a product, choose a rating and write a review.";
    message.className = "review-message error";
    return;
  }

  const product = getProducts().find(
    item => String(item.id) === String(productId)
  );

  if (!product) {
    message.textContent = "The selected product could not be found.";
    message.className = "review-message error";
    return;
  }

  const reviews = getReviews();
  const userId = String(currentUser.id || currentUser.email);
  const existingIndex = reviews.findIndex(review =>
    String(review.productId) === String(productId) &&
    String(review.userId) === userId
  );

  const review = {
    id: existingIndex >= 0
      ? reviews[existingIndex].id
      : `review_${Date.now()}`,
    productId: product.id,
    productName: product.name,
    userId,
    userName: currentUser.name || currentUser.email,
    rating,
    comment,
    date: new Date().toLocaleDateString("en-IN")
  };

  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.push(review);
  }

  saveReviews(reviews);
  updateProductRating(productId);

  document.getElementById("customerReviewForm").reset();
  document.getElementById("reviewRating").value = "0";

  document.querySelectorAll(".rating-star").forEach(star => {
    star.classList.remove("selected");
    star.setAttribute("aria-pressed", "false");
  });

  message.textContent = existingIndex >= 0
    ? "Your review has been updated successfully!"
    : "Thank you! Your review has been submitted.";

  message.className = "review-message success";

  displayReviews();
}

function updateProductRating(productId) {
  const products = getProducts();
  const product = products.find(
    item => String(item.id) === String(productId)
  );

  if (!product) return;

  const productReviews = getReviews().filter(
    review => String(review.productId) === String(productId)
  );

  if (!productReviews.length) return;

  const averageRating = productReviews.reduce(
    (total, review) => total + Number(review.rating || 0), 0
  ) / productReviews.length;

  product.rating = Number(averageRating.toFixed(1));
  product.reviewsCount = productReviews.length;

  saveStoredData(STORAGE_KEYS.products, products);

  if (typeof displayProducts === "function") displayProducts();
  if (typeof displayFeaturedProducts === "function") {
    displayFeaturedProducts();
  }
}

function initializeReviews() {
  createReviewForm();
  displayReviews();
}
