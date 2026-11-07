
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

// Save the login session
function setCurrentUser(user) {
    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer"
    };

    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
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
                        <input
                            type="email"
                            id="loginEmail"
                            placeholder="Enter your email"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input
                            type="password"
                            id="loginPassword"
                            placeholder="Enter your password"
                            required
                        >
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
                        <input
                            type="text"
                            id="registerName"
                            placeholder="Enter your full name"
                            required
                            minlength="2"
                        >
                    </div>

                    <div class="form-group">
                        <label for="registerEmail">Email Address</label>
                        <input
                            type="email"
                            id="registerEmail"
                            placeholder="Enter your email"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input
                            type="password"
                            id="registerPassword"
                            placeholder="Create a password"
                            minlength="6"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="registerConfirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="registerConfirmPassword"
                            placeholder="Confirm your password"
                            minlength="6"
                            required
                        >
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

// Update navigation based on login status
function updateAuthNavigation() {
    const user = getCurrentUser();

    const loginLinks = document.querySelectorAll(
        '[data-section="login"]'
    );

    const registerLinks = document.querySelectorAll(
        '[data-section="register"]'
    );

    loginLinks.forEach(link => {
        link.textContent = user ? "Account" : "Login";
        link.onclick = user
            ? function (event) {
                event.preventDefault();
                showSection("home");

                if (typeof showToast === "function") {
                    showToast("Logged in as " + user.name, "info");
                }
            }
            : null;
    });

    registerLinks.forEach(link => {
        if (user) {
            link.style.display = "none";
        } else {
            link.style.display = "";
            link.textContent = "Sign Up";
            link.onclick = null;
        }
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
}

// Switch between login and registration
function showAuthPage(page) {
    renderAuthPages();

    if (typeof showSection === "function") {
        showSection(page === "register" ? "register" : "login");
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        .value.trim()
        .toLowerCase();

    const password = document
        .getElementById("loginPassword")
        .value;

    const users = getStoredData(
        STORAGE_KEYS.users,
        defaultUsers
    );

    const user = users.find(account =>
        account.email.toLowerCase() === email &&
        account.password === password
    );

    if (!user) {
        if (typeof showToast === "function") {
            showToast("Invalid email or password.", "error");
        }
        return;
    }

    setCurrentUser(user);
    updateAuthNavigation();

    if (typeof showToast === "function") {
        showToast("Welcome back, " + user.name + "!", "success");
    }

    if (typeof showSection === "function") {
        showSection(user.role === "admin" ? "admin" : "home");
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();

    const name = document
        .getElementById("registerName")
        .value.trim();

    const email = document
        .getElementById("registerEmail")
        .value.trim()
        .toLowerCase();

    const password = document
        .getElementById("registerPassword")
        .value;

    const confirmPassword = document
        .getElementById("registerConfirmPassword")
        .value;

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

    const users = getStoredData(
        STORAGE_KEYS.users,
        defaultUsers
    );

    const existingUser = users.find(
        user => user.email.toLowerCase() === email
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

    saveStoredData(STORAGE_KEYS.users, users);

    setCurrentUser(newUser);
    updateAuthNavigation();

    showToast("Your account has been created successfully!", "success");

    if (typeof showSection === "function") {
        showSection("home");
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
