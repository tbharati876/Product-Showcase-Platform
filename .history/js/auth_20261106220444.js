
// SHOWCASE V2 - AUTHENTICATION SYSTEM

const AUTH_SESSION_KEY = "showcase_current_user";

function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY));
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    sessionStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify(safeUser)
    );
}

function logoutUser() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    alert("You have logged out successfully.");
    updateAuthNavigation();
    showAuthPage("login");
}

function renderAuthPages() {
    const main = document.querySelector("main") ||
        document.body;

    if (!document.getElementById("login")) {
        const loginSection = document.createElement("section");

        loginSection.id = "login";
        loginSection.className = "section-padding auth-section";

        loginSection.innerHTML = `
            <div class="section-heading">
                <span>WELCOME BACK</span>
                <h2>Login to ShowCase</h2>
                <p>Access your account and favourite products.</p>
            </div>

            <form id="loginForm" class="contact-form auth-card">
                <div class="auth-icon">👋</div>

                <h3>Welcome back!</h3>
                <p class="auth-description">
                    Enter your account details to continue.
                </p>

                <label for="loginEmail">Email address</label>
                <input
                    type="email"
                    id="loginEmail"
                    placeholder="you@example.com"
                    autocomplete="email"
                    required>

                <label for="loginPassword">Password</label>

                <div class="password-wrapper">
                    <input
                        type="password"
                        id="loginPassword"
                        placeholder="Enter your password"
                        autocomplete="current-password"
                        required>

                    <button type="button"
                        class="password-toggle"
                        onclick="togglePassword('loginPassword', this)">
                        Show
                    </button>
                </div>

                <button type="submit"
                    class="btn btn-primary auth-submit">
                    Login to Account
                </button>

                <p class="auth-switch">
                    Don't have an account?
                    <a href="#register"
                        onclick="showAuthPage('register')">
                        Create Account
                    </a>
                </p>
            </form>
        `;

        main.appendChild(loginSection);
    }

    if (!document.getElementById("register")) {
        const registerSection = document.createElement("section");

        registerSection.id = "register";
        registerSection.className = "section-padding auth-section";

        registerSection.innerHTML = `
            <div class="section-heading">
                <span>JOIN SHOWCASE</span>
                <h2>Create Your Account</h2>
                <p>Register to save products and share your reviews.</p>
            </div>

            <form id="registerForm" class="contact-form auth-card">
                <div class="auth-icon">✨</div>

                <h3>Create an account</h3>
                <p class="auth-description">
                    Fill in your details to get started.
                </p>

                <label for="registerName">Full name</label>
                <input
                    type="text"
                    id="registerName"
                    placeholder="Your full name"
                    minlength="2"
                    autocomplete="name"
                    required>

                <label for="registerEmail">Email address</label>
                <input
                    type="email"
                    id="registerEmail"
                    placeholder="you@example.com"
                    autocomplete="email"
                    required>

                <label for="registerPassword">Password</label>

                <div class="password-wrapper">
                    <input
                        type="password"
                        id="registerPassword"
                        placeholder="At least 8 characters"
                        minlength="8"
                        autocomplete="new-password"
                        required>

                    <button type="button"
                        class="password-toggle"
                        onclick="togglePassword('registerPassword', this)">
                        Show
                    </button>
                </div>

                <label for="confirmPassword">Confirm password</label>

                <div class="password-wrapper">
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Re-enter your password"
                        autocomplete="new-password"
                        required>
                </div>

                <button type="submit"
                    class="btn btn-primary auth-submit">
                    Create My Account
                </button>

                <p class="auth-switch">
                    Already registered?
                    <a href="#login"
                        onclick="showAuthPage('login')">
                        Login here
                    </a>
                </p>
            </form>
        `;

        main.appendChild(registerSection);
    }

    document.getElementById("loginForm")
        ?.addEventListener("submit", handleLogin);

    document.getElementById("registerForm")
        ?.addEventListener("submit", handleRegistration);
}

// Show or hide password
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);

    if (!input) return;

    const visible = input.type === "text";

    input.type = visible ? "password" : "text";
    button.textContent = visible ? "Show" : "Hide";
}

// Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword")
        .value;

    const users = getStoredData(STORAGE_KEYS.users);

    const user = users.find(account =>
        account.email.toLowerCase() === email &&
        account.password === password
    );

    if (!user) {
        alert("Incorrect email or password. Please try again.");
        return;
    }

    setCurrentUser(user);
    event.target.reset();

    alert(`Welcome back, ${user.name}!`);

    updateAuthNavigation();
    showSection("home");
}

// Registration
function handleRegistration(event) {
    event.preventDefault();

    const name = document.getElementById("registerName")
        .value.trim();

    const email = document.getElementById("registerEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("registerPassword")
        .value;

    const confirmPassword = document.getElementById("confirmPassword")
        .value;

    if (name.length < 2) {
        alert("Please enter a valid name.");
        return;
    }

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const users = getStoredData(STORAGE_KEYS.users);

    const existingUser = users.some(
        user => user.email.toLowerCase() === email
    );

    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: "customer"
    };

    users.push(newUser);

    saveStoredData(STORAGE_KEYS.users, users);

    setCurrentUser(newUser);

    event.target.reset();

    alert("Your account has been created successfully!");

    updateAuthNavigation();
    showSection("home");
}

// Navigation after login/logout
function updateAuthNavigation() {
    const authLinks = document.querySelector(".auth-links");

    if (!authLinks) return;

    const user = getCurrentUser();

    if (!user) {
        authLinks.innerHTML = `
            <a href="#login" onclick="showAuthPage('login')">
                Login
            </a>

            <a href="#register" onclick="showAuthPage('register')">
                Sign Up
            </a>
        `;
        return;
    }

    authLinks.innerHTML = `
        <span class="logged-user">
            Hi, ${escapeAuthText(user.name)}
        </span>

        ${user.role === "admin"
            ? `<a href="#admin" onclick="showSection('admin')">Admin</a>`
            : ""}

        <button class="btn btn-secondary"
            onclick="logoutUser()">
            Logout
        </button>
    `;
}

// Escape text before inserting user-provided names
function escapeAuthText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Display the login or registration page
function showAuthPage(page) {
    const section = document.getElementById(page);

    if (!section) return;

    showSection(page);

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Initialize authentication
function initializeAuth() {
    renderAuthPages();
    updateAuthNavigation();

    console.log("ShowCase authentication initialized.");
}

