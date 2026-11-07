
// SHOWCASE - AUTHENTICATION

function getUsers() {
    return getStoredData(STORAGE_KEYS.users);
}

function saveUsers(users) {
    saveStoredData(STORAGE_KEYS.users, users);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("showcase_current_user")) || null;
}

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
        alert("Please complete all registration fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    const users = getUsers();

    if (users.some(user => user.email.toLowerCase() === email)) {
        alert("An account with this email already exists.");
        return;
    }

    users.push({
        id: Date.now(),
        name,
        email,
        password,
        role: "customer"
    });

    saveUsers(users);

    alert("Registration successful! You can now log in.");

    document.getElementById("registerForm").reset();
    showAuthForm("login");
}

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = getUsers().find(
        item =>
            item.email.toLowerCase() === email &&
            item.password === password
    );

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    localStorage.setItem(
        "showcase_current_user",
        JSON.stringify(currentUser)
    );

    alert(`Welcome, ${user.name}!`);

    document.getElementById("loginForm").reset();
    updateAuthUI();
    showSection("home");
}

function logoutUser() {
    localStorage.removeItem("showcase_current_user");

    alert("You have logged out successfully.");

    updateAuthUI();
    showSection("home");
}

function showAuthForm(formType) {
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");

    if (loginSection) {
        loginSection.hidden = formType !== "login";
    }

    if (registerSection) {
        registerSection.hidden = formType !== "register";
    }

    showSection(formType);
}

function updateAuthUI() {
    const user = getCurrentUser();
    const authLinks = document.getElementById("authLinks");

    if (!authLinks) return;

    if (user) {
        authLinks.innerHTML = `
            <span>Welcome, ${user.name}</span>
            ${user.role === "admin"
                ? '<a href="#admin" onclick="showSection(\'admin\')">Admin</a>'
                : ""}
            <button onclick="logoutUser()">Logout</button>
        `;
    } else {
        authLinks.innerHTML = `
            <a href="#login" onclick="showAuthForm('login')">Login</a>
            <a href="#register" onclick="showAuthForm('register')">Sign Up</a>
        `;
    }
}

function initializeAuth() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    updateAuthUI();
}
