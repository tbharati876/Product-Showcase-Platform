// ==========================================
// SHOWCASE - AUTHENTICATION & USER PROFILE
// ==========================================

const USERS_KEY = "showcase_users";
const CURRENT_USER_STORAGE_KEY = "showcase_current_user";

// Get all registered users
function getUsers() {
    const users = getStoredData(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
}

// Save registered users
function saveUsers(users) {
    saveStoredData(USERS_KEY, users);
}

// Get currently logged-in user
function getCurrentUser() {
    const storedUser = getStoredData(CURRENT_USER_STORAGE_KEY, null);

    if (!storedUser) return null;

    // Support older storage format where only the user ID was saved
    if (typeof storedUser !== "object") {
        return getUsers().find(
            user => String(user.id) === String(storedUser)
        ) || null;
    }

    // Refresh user details from registered users
    const users = getUsers();

    return users.find(user =>
        String(user.id) === String(storedUser.id)
    ) || storedUser;
}

// Save current user session
function setCurrentUser(user) {
    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || ""
    };

    saveStoredData(CURRENT_USER_STORAGE_KEY, sessionUser);
}

// Check whether user is logged in
function isLoggedIn() {
    return Boolean(getCurrentUser());
}

// Register a new account
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("registerName")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();
    const phone = document.getElementById("registerPhone")?.value.trim();
    const password = document.getElementById("registerPassword")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        showToast("Please fill in all registration fields.", "warning");
        return;
    }

    if (password.length < 6) {
        showToast("Password must contain at least 6 characters.", "warning");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    const users = getUsers();

    const existingUser = users.find(
        user => user.email?.toLowerCase() === email
    );

    if (existingUser) {
        showToast("An account with this email already exists.", "error");
        return;
    }

    const newUser = {
        id: generateId(),
        name,
        email,
        phone,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    setCurrentUser(newUser);

    const form = document.getElementById("registerForm");
    if (form) form.reset();

    showToast("Account created successfully. Welcome to ShowCase!", "success");

    displayProfile();
    showSection("profile");
}

// Login to an existing account
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
        showToast("Please enter your email and password.", "warning");
        return;
    }

    const users = getUsers();

    const user = users.find(
        item => item.email?.toLowerCase() === email &&
            item.password === password
    );

    if (!user) {
        showToast("Invalid email or password.", "error");
        return;
    }

    setCurrentUser(user);

    const form = document.getElementById("loginForm");
    if (form) form.reset();

    showToast(`Welcome back, ${user.name}!`, "success");

    showSection("profile");
}

// Logout
function logout() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);

    showToast("You have been logged out.", "success");

    showSection("home");
    updateAccountUI();
}

// Update account navigation
function updateAccountUI() {
    const currentUser = getCurrentUser();

    const accountName = document.getElementById("accountName");
    const accountMenu = document.getElementById("accountMenu");

    if (accountName) {
        accountName.textContent = currentUser
            ? currentUser.name
            : "My Account";
    }

    if (accountMenu) {
        accountMenu.innerHTML = currentUser
            ? `
                <a href="#" onclick="showSection('profile'); return false;">
                    My Profile
                </a>
                <a href="#" onclick="showSection('orders'); return false;">
                    My Orders
                </a>
                <a href="#" onclick="logout(); return false;">
                    Logout
                </a>
            `
            : `
                <a href="#" onclick="showSection('login'); return false;">
                    Login
                </a>
                <a href="#" onclick="showSection('register'); return false;">
                    Sign Up
                </a>
            `;
    }
}

// Update user profile
function updateProfile(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        showToast("Please login to update your profile.", "warning");
        showSection("login");
        return;
    }

    const name = document.getElementById("profileName")?.value.trim();
    const email = document.getElementById("profileEmail")?.value.trim().toLowerCase();
    const phone = document.getElementById("profilePhone")?.value.trim();

    if (!name || !email || !phone) {
        showToast("Please fill in all profile fields.", "warning");
        return;
    }

    const users = getUsers();

    const emailAlreadyUsed = users.some(user =>
        user.email?.toLowerCase() === email &&
        String(user.id) !== String(currentUser.id)
    );

    if (emailAlreadyUsed) {
        showToast("This email is already registered to another account.", "error");
        return;
    }

    const userIndex = users.findIndex(
        user => String(user.id) === String(currentUser.id)
    );

    if (userIndex === -1) {
        showToast("User account not found.", "error");
        return;
    }

    users[userIndex] = {
        ...users[userIndex],
        name,
        email,
        phone
    };

    saveUsers(users);
    setCurrentUser(users[userIndex]);

    showToast("Profile updated successfully.", "success");

    displayProfile();
    updateAccountUI();
}

// Change password
function changePassword(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        showToast("Please login first.", "warning");
        showSection("login");
        return;
    }

    const oldPassword = document.getElementById("oldPassword")?.value;
    const newPassword = document.getElementById("newPassword")?.value;
    const confirmNewPassword = document.getElementById("confirmNewPassword")?.value;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        showToast("Please fill in all password fields.", "warning");
        return;
    }

    if (newPassword.length < 6) {
        showToast("New password must contain at least 6 characters.", "warning");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showToast("New passwords do not match.", "error");
        return;
    }

    const users = getUsers();

    const userIndex = users.findIndex(
        user => String(user.id) === String(currentUser.id)
    );

    if (userIndex === -1 || users[userIndex].password !== oldPassword) {
        showToast("Your current password is incorrect.", "error");
        return;
    }

    users[userIndex].password = newPassword;
    saveUsers(users);

    const form = document.getElementById("changePasswordForm");
    if (form) form.reset();

    showToast("Password changed successfully.", "success");
}

// Display user profile
function displayProfile() {
    const container = document.getElementById("profileContent");

    if (!container) return;

    const currentUser = getCurrentUser();

    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Please Login</h3>
                <p>You need to login to view your profile.</p>
                <button
                    class="btn btn-primary"
                    onclick="showSection('login')"
                >
                    Login
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-avatar">
                    ${escapeHTML(
                        (currentUser.name || "U").charAt(0).toUpperCase()
                    )}
                </div>

                <div>
                    <h3>${escapeHTML(currentUser.name)}</h3>
                    <p>${escapeHTML(currentUser.email)}</p>
                </div>
            </div>

            <div class="profile-section">
                <h3>Personal Information</h3>

                <form class="profile-form" onsubmit="updateProfile(event)">
                    <div class="form-group">
                        <label for="profileName">Full Name</label>
                        <input
                            type="text"
                            id="profileName"
                            value="${escapeHTML(currentUser.name || "")}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="profileEmail">Email Address</label>
                        <input
                            type="email"
                            id="profileEmail"
                            value="${escapeHTML(currentUser.email || "")}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="profilePhone">Phone Number</label>
                        <input
                            type="tel"
                            id="profilePhone"
                            value="${escapeHTML(currentUser.phone || "")}"
                            required
                        >
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Save Profile
                    </button>
                </form>
            </div>

            <div class="profile-section">
                <h3>Change Password</h3>

                <form
                    id="changePasswordForm"
                    class="profile-form"
                    onsubmit="changePassword(event)"
                >
                    <div class="form-group">
                        <label for="oldPassword">Current Password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            minlength="6"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="confirmNewPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            minlength="6"
                            required
                        >
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Change Password
                    </button>
                </form>
            </div>

            <div class="profile-actions">
                <button
                    class="btn btn-secondary"
                    onclick="showSection('orders')"
                >
                    My Orders
                </button>

                <button
                    class="btn btn-danger"
                    onclick="logout()"
                >
                    Logout
                </button>
            </div>
        </div>
    `;
}

// Initialize authentication
function initializeAuth() {
    updateAccountUI();
}