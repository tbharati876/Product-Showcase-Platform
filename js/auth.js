
const AUTH_SESSION_KEY = "showcase_current_user";

// Get the currently logged-in user
function getCurrentUser() {
    try {
        const user = sessionStorage.getItem(AUTH_SESSION_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Unable to read login session:", error);
        return null;
    }
}

// Save login session
function setCurrentUser(user) {
    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
        createdAt: user.createdAt || ""
    };

    sessionStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify(sessionUser)
    );
}

// Get all registered users
function getRegisteredUsers() {
    return getStoredData(STORAGE_KEYS.users, defaultUsers);
}

// Log out
function logoutUser() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);

    updateAuthNavigation();

    if (typeof showToast === "function") {
        showToast("You have been logged out successfully.", "success");
    }

    if (typeof showSection === "function") {
        showSection("home");
    }
}

// Render login and registration forms
function renderAuthPages() {
    const loginContainer = document.getElementById("loginContainer");
    const registerContainer = document.getElementById("registerContainer");

    if (loginContainer) {
        loginContainer.innerHTML = `
            <div class="auth-card">
                <h2>Welcome Back!</h2>
                <p>Login to your ShowCase account.</p>

                <form id="loginForm">
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

                    <button type="submit" class="btn-primary auth-submit">
                        Login
                    </button>
                </form>

                <p class="auth-switch">
                    Don't have an account?
                    <a href="#" onclick="showAuthPage('register'); return false;">
                        Create Account
                    </a>
                </p>

                <div class="demo-credentials">
                    <h4>Demo Accounts</h4>
                    <p><strong>Admin:</strong> admin@showcase.com / admin123</p>
                    <p><strong>Customer:</strong> user@showcase.com / user123</p>
                </div>
            </div>
        `;
    }

    if (registerContainer) {
        registerContainer.innerHTML = `
            <div class="auth-card">
                <h2>Create Your Account</h2>
                <p>Join ShowCase and discover amazing products.</p>

                <form id="registerForm">
                    <div class="form-group">
                        <label for="registerName">Full Name</label>
                        <input type="text" id="registerName"
                            placeholder="Enter your full name"
                            required minlength="2">
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
                        <label for="registerConfirmPassword">
                            Confirm Password
                        </label>
                        <input type="password" id="registerConfirmPassword"
                            placeholder="Confirm your password"
                            minlength="6" required>
                    </div>

                    <button type="submit" class="btn-primary auth-submit">
                        Create Account
                    </button>
                </form>

                <p class="auth-switch">
                    Already have an account?
                    <a href="#" onclick="showAuthPage('login'); return false;">
                        Login
                    </a>
                </p>
            </div>
        `;
    }
}

// Display user profile
function displayProfile() {
    const container = document.getElementById("profileContainer");

    if (!container) return;

    const user = getCurrentUser();

    if (!user) {
        container.innerHTML = `
            <div class="auth-card">
                <h2>You are not logged in</h2>
                <p>Please login to view your profile information.</p>

                <button class="btn-primary"
                    onclick="showAuthPage('login')">
                    Login to Your Account
                </button>

                <p class="auth-switch">
                    New to ShowCase?
                    <a href="#" onclick="showAuthPage('register'); return false;">
                        Create an Account
                    </a>
                </p>
            </div>
        `;
        return;
    }

    const createdAt = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "Not available";

    const initials = escapeHTML(
        user.name.split(" ")
            .map(part => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    );

    container.innerHTML = `
        <div class="auth-card profile-card">
            <div class="profile-avatar">${initials}</div>

            <h2>${escapeHTML(user.name)}</h2>

            <p>${escapeHTML(
                user.role === "admin"
                    ? "Administrator"
                    : "ShowCase Customer"
            )}</p>

            <div class="profile-details">
                <div class="profile-detail-row">
                    <strong>Full Name</strong>
                    <span>${escapeHTML(user.name)}</span>
                </div>

                <div class="profile-detail-row">
                    <strong>Email Address</strong>
                    <span>${escapeHTML(user.email)}</span>
                </div>

                <div class="profile-detail-row">
                    <strong>Account Type</strong>
                    <span>${escapeHTML(user.role)}</span>
                </div>

                <div class="profile-detail-row">
                    <strong>Member Since</strong>
                    <span>${escapeHTML(createdAt)}</span>
                </div>
            </div>

            <button class="btn-primary" onclick="logoutUser()">
                Logout
            </button>
        </div>
    `;
}

// Update navigation based on login status
function updateAuthNavigation() {
    const user = getCurrentUser();

    const loginLinks = document.querySelectorAll('[data-section="login"]');
    const registerLinks = document.querySelectorAll('[data-section="register"]');
    const profileLinks = document.querySelectorAll('[data-section="profile"]');
    const adminLinks = document.querySelectorAll('[data-section="admin"]');

    loginLinks.forEach(link => {
        link.style.display = user ? "none" : "";
    });

    registerLinks.forEach(link => {
        link.style.display = user ? "none" : "";
    });

    profileLinks.forEach(link => {
        link.style.display = user ? "" : "none";
    });

    adminLinks.forEach(link => {
        link.style.display =
            user && user.role === "admin" ? "" : "none";
    });

    let logoutLink = document.getElementById("logoutLink");

    if (user) {
        if (!logoutLink) {
            const nav = document.querySelector(".nav-links");

            if (nav) {
                logoutLink = document.createElement("a");
                logoutLink.id = "logoutLink";
                logoutLink.href = "#";
                logoutLink.textContent = "Logout";
                nav.appendChild(logoutLink);
            }
        }

        if (logoutLink) {
            logoutLink.style.display = "";

            logoutLink.onclick = function (event) {
                event.preventDefault();
                logoutUser();
            };
        }
    } else if (logoutLink) {
        logoutLink.style.display = "none";
    }

    displayProfile();
}

// Switch between login and registration
function showAuthPage(page) {
    renderAuthPages();

    if (typeof showSection === "function") {
        showSection(page === "register" ? "register" : "login");
    }

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword").value;

    const users = getRegisteredUsers();

    const user = users.find(account =>
        account.email &&
        account.email.toLowerCase() === email &&
        account.password === password
    );

    if (!user) {
        showToast("Invalid email or password.", "error");
        return;
    }

    setCurrentUser(user);
    updateAuthNavigation();

    showToast("Welcome back, " + user.name + "!", "success");

    if (typeof showSection === "function") {
        showSection(user.role === "admin" ? "admin" : "profile");
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("registerName")
        .value.trim();

    const email = document.getElementById("registerEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("registerConfirmPassword").value;

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

    const users = getRegisteredUsers();

    const existingUser = users.find(user =>
        user.email &&
        user.email.toLowerCase() === email
    );

    if (existingUser) {
        showToast("An account with this email already exists.", "error");
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: "customer",
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Save customer account for Admin Dashboard
    saveStoredData(STORAGE_KEYS.users, users);

    // Automatically log in after registration
    setCurrentUser(newUser);

    updateAuthNavigation();

    showToast(
        "Account created successfully! Welcome to ShowCase.",
        "success"
    );

    if (typeof showSection === "function") {
        showSection("profile");
    }
}

// Initialize authentication
function initializeAuth() {
    renderAuthPages();

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    updateAuthNavigation();
}
