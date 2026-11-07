
// ==========================================
// SHOWCASE AUTHENTICATION SYSTEM
// ==========================================

const AUTH_SESSION_KEY = "showcase_current_user";

// Get all registered users
function getUsers() {
    return getStoredData(STORAGE_KEYS.users, defaultUsers);
}

// Save registered users
function saveUsers(users) {
    saveStoredData(STORAGE_KEYS.users, users);
}

// Get currently logged-in user
function getCurrentUser() {
    try {
        const user = sessionStorage.getItem(AUTH_SESSION_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Unable to read login session:", error);
        return null;
    }
}

// Set logged-in user
function setCurrentUser(user) {
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer"
    };

    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(safeUser));
    updateAuthNavigation();
    displayProfile();
}

// Logout
function logoutUser() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);

    updateAuthNavigation();
    displayProfile();

    if (typeof showToast === "function") {
        showToast("You have logged out successfully.", "success");
    }

    showSection("login");
}

// ==========================================
// AUTH PAGE HTML
// ==========================================

function renderAuthPages() {
    const loginContainer = document.getElementById("loginContainer");
    const registerContainer = document.getElementById("registerContainer");

    if (loginContainer) {
        loginContainer.innerHTML = `
            <div class="auth-card">
                <div class="auth-icon">
                    <i class="fas fa-user"></i>
                </div>

                <h3>Welcome Back!</h3>
                <p>Login to continue shopping.</p>

                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="loginEmail">Email Address</label>
                        <input type="email" id="loginEmail"
                            placeholder="Enter your email" required>
                    </div>

                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword"
                            placeholder="Enter your password" required>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Login <i class="fas fa-arrow-right"></i>
                    </button>
                </form>

                <p class="auth-switch">
                    Don't have an account?
                    <a href="#register" data-section="register">Sign Up</a>
                </p>
            </div>
        `;

        document.getElementById("loginForm").addEventListener("submit", handleLogin);
    }

    if (registerContainer) {
        registerContainer.innerHTML = `
            <div class="auth-card">
                <div class="auth-icon">
                    <i class="fas fa-user-plus"></i>
                </div>

                <h3>Create Your Account</h3>
                <p>Join ShowCase and discover amazing products.</p>

                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="registerName">Full Name</label>
                        <input type="text" id="registerName"
                            placeholder="Enter your full name"
                            minlength="2" required>
                    </div>

                    <div class="form-group">
                        <label for="registerEmail">Email Address</label>
                        <input type="email" id="registerEmail"
                            placeholder="Enter your email" required>
                    </div>

                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input type="password" id="registerPassword"
                            placeholder="Create a password"
                            minlength="6" required>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword"
                            placeholder="Confirm your password"
                            minlength="6" required>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Create Account <i class="fas fa-user-plus"></i>
                    </button>
                </form>

                <p class="auth-switch">
                    Already have an account?
                    <a href="#login" data-section="login">Login</a>
                </p>
            </div>
        `;

        document.getElementById("registerForm").addEventListener("submit", handleRegister);
    }
}

// ==========================================
// LOGIN
// ==========================================

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(account =>
        account.email.toLowerCase() === email &&
        account.password === password
    );

    if (!user) {
        showToast("Invalid email or password.", "error");
        return;
    }

    setCurrentUser(user);

    showToast("Welcome back, " + user.name + "!", "success");

    showSection("profile");
}

// ==========================================
// REGISTER
// ==========================================

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (name.length < 2) {
        showToast("Please enter a valid name.", "error");
        return;
    }

    if (password.length < 6) {
        showToast("Password must contain at least 6 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    const users = getUsers();

    const existingUser = users.find(user =>
        user.email.toLowerCase() === email
    );

    if (existingUser) {
        showToast("An account with this email already exists.", "error");
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: "customer",
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Automatically log in after registration
    setCurrentUser(newUser);

    showToast("Account created successfully!", "success");

    showSection("profile");
}

// ==========================================
// MY PROFILE
// ==========================================

function displayProfile() {
    const container = document.getElementById("profileContainer");

    if (!container) return;

    const user = getCurrentUser();

    if (!user) {
        container.innerHTML = `
            <div class="auth-card">
                <div class="auth-icon">
                    <i class="fas fa-user-circle"></i>
                </div>

                <h3>You are not logged in</h3>
                <p>Please log in to view your account details.</p>

                <button class="btn btn-primary"
                    onclick="showSection('login')">
                    Login to Your Account
                </button>

                <p class="auth-switch">
                    New to ShowCase?
                    <a href="#register" onclick="showSection('register'); return false;">
                        Create an account
                    </a>
                </p>
            </div>
        `;
        return;
    }

    const initials = user.name
        .split(" ")
        .map(part => part.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    container.innerHTML = `
        <div class="auth-card profile-card">

            <div class="profile-avatar">
                ${escapeHTML(initials)}
            </div>

            <h3>${escapeHTML(user.name)}</h3>

            <p class="profile-email">
                ${escapeHTML(user.email)}
            </p>

            <div class="profile-details">

                <div class="profile-detail-row">
                    <span><i class="fas fa-user"></i> Full Name</span>
                    <strong>${escapeHTML(user.name)}</strong>
                </div>

                <div class="profile-detail-row">
                    <span><i class="fas fa-envelope"></i> Email Address</span>
                    <strong>${escapeHTML(user.email)}</strong>
                </div>

                <div class="profile-detail-row">
                    <span><i class="fas fa-id-badge"></i> Account Type</span>
                    <strong>${user.role === "admin" ? "Administrator" : "Customer"}</strong>
                </div>

                <div class="profile-detail-row">
                    <span><i class="fas fa-check-circle"></i> Account Status</span>
                    <strong>Active</strong>
                </div>

            </div>

            <div class="profile-actions">
                <button class="btn btn-primary"
                    onclick="showSection('orders')">
                    <i class="fas fa-box"></i> My Orders
                </button>

                <button class="btn btn-outline"
                    onclick="showSection('wishlist')">
                    <i class="fas fa-heart"></i> My Wishlist
                </button>

                <button class="btn btn-outline"
                    onclick="logoutUser()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>

        </div>
    `;
}

// ==========================================
// NAVIGATION UPDATES
// ==========================================

function updateAuthNavigation() {
    const user = getCurrentUser();

    const loginLink = document.getElementById("loginNavLink");
    const registerLink = document.getElementById("registerNavLink");
    const profileLink = document.getElementById("profileNavLink");

    if (loginLink) {
        loginLink.style.display = user ? "none" : "";
    }

    if (registerLink) {
        registerLink.style.display = user ? "none" : "";
    }

    if (profileLink) {
        profileLink.textContent = user ? "My Profile" : "My Profile";
    }

    let logoutLink = document.getElementById("logoutLink");

    if (user) {
        if (!logoutLink) {
            const nav = document.querySelector(".nav-links");

            if (nav) {
                logoutLink = document.createElement("a");
                logoutLink.id = "logoutLink";
                logoutLink.href = "#login";
                logoutLink.textContent = "Logout";
                nav.appendChild(logoutLink);
            }
        }

        if (logoutLink) {
            logoutLink.style.display = "";
            logoutLink.onclick = function(event) {
                event.preventDefault();
                logoutUser();
            };
        }
    } else if (logoutLink) {
        logoutLink.remove();
    }
}

// ==========================================
// AUTH PAGE NAVIGATION
// ==========================================

function showAuthPage(page) {
    showSection(page);
}

// ==========================================
// INITIALIZE AUTHENTICATION
// ==========================================

function initializeAuth() {
    renderAuthPages();
    updateAuthNavigation();
    displayProfile();
}
