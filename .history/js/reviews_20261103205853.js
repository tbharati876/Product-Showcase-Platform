
 // SHOWCASE - PRODUCT REVIEWS AND RATINGS

function getReviews() {
    return getStoredData(STORAGE_KEYS.reviews);
}

function saveReviews(reviews) {
    saveStoredData(STORAGE_KEYS.reviews, reviews);
}

function displayReviews() {
    const reviewGrid = document.getElementById("reviewGrid");

    if (!reviewGrid) return;

    const reviews = getReviews();

    if (reviews.length === 0) {
        reviewGrid.innerHTML = `
            <p class="empty-message">No reviews have been submitted yet.</p>
        `;
        return;
    }

    reviewGrid.innerHTML = reviews.map(review => {
        const product = getProducts().find(
            item => item.id === review.productId
        );

        return `
            <article class="review-card">
                <h3>${product ? product.name : "Product"}</h3>
                <h4>${review.userName}</h4>
                <div class="product-rating">
                    ${"⭐".repeat(review.rating)}
                    <span>${review.rating}/5</span>
                </div>
                <p>${review.comment}</p>
                <small>${review.date}</small>
            </article>
        `;
    }).join("");
}

function submitReview(event) {
    event.preventDefault();

    const productId = Number(
        document.getElementById("reviewProduct").value
    );

    const userName = document.getElementById("reviewName").value.trim();
    const rating = Number(
        document.getElementById("reviewRating").value
    );
    const comment = document.getElementById("reviewComment").value.trim();

    if (!productId || !userName || !comment || rating < 1 || rating > 5) {
        alert("Please complete all review fields correctly.");
        return;
    }

    const productExists = getProducts().some(
        product => product.id === productId
    );

    if (!productExists) {
        alert("Please select a valid product.");
        return;
    }

    const reviews = getReviews();

    reviews.push({
        id: Date.now(),
        productId,
        userName,
        rating,
        comment,
        date: new Date().toLocaleDateString()
    });

    saveReviews(reviews);

    document.getElementById("reviewForm").reset();

    displayReviews();

    alert("Thank you! Your review has been submitted.");
}

function initializeReviews() {
    const productSelect = document.getElementById("reviewProduct");
    const reviewForm = document.getElementById("reviewForm");

    if (productSelect) {
        productSelect.innerHTML = `
            <option value="">Select a product</option>
            ${getProducts().map(product => `
                <option value="${product.id}">${product.name}</option>
            `).join("")}
        `;
    }

    if (reviewForm) {
        reviewForm.addEventListener("submit", submitReview);
    }

    displayReviews();
}
