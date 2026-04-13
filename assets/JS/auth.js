function requireAuth(redirectUrl = "login.html") {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = redirectUrl;
        } else {
            const usernameElements = document.querySelectorAll(".user-name");
            usernameElements.forEach(el => el.textContent = user.displayName || user.email.split('@')[0]);
            
            // Generate avatar letter
            const avatarElements = document.querySelectorAll(".avatar");
            const avatarChar = (user.displayName || user.email).charAt(0).toUpperCase();
            avatarElements.forEach(el => el.textContent = avatarChar);
            
            // Set email if it exists
            const emailElement = document.getElementById("profile-email");
            if (emailElement) emailElement.textContent = user.email;
        }
    });
}

function redirectIfLoggedIn(redirectUrl = "index.html") {
    auth.onAuthStateChanged((user) => {
        if (user) {
            window.location.href = redirectUrl;
        }
    });
}

function signOutUser() {
    auth.signOut().then(() => {
        window.location.href = "home.html";
    });
}
