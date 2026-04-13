redirectIfLoggedIn("index.html");

const create = document.getElementById("linkCreateAccount");
const haveAcc = document.getElementById("linkLogin");
const formLogin = document.getElementById("Login");
const formCreateAcc = document.getElementById("CreateAccount");

const passwordToggle = document.getElementById("passwordToggle");
const regPasswordToggle = document.getElementById("regPasswordToggle");
const confirmPasswordToggle = document.getElementById("confirmPasswordToggle");

const passwordInput = document.getElementById("password");
const regPasswordInput = document.getElementById("regPassword");
const confirmPasswordInput = document.getElementById("confirmation");

document.addEventListener("DOMContentLoaded", function () {
  create.addEventListener("click", function (e) {
    e.preventDefault();
    hide(formLogin);
    show(formCreateAcc);
  });

  haveAcc.addEventListener("click", function (e) {
    e.preventDefault();
    show(formLogin);
    hide(formCreateAcc);
  });
});

function hide(elem) {
  elem.classList.add("form--hidden");
  elem.classList.remove("form--unhidden");
}

function show(elem) {
  elem.classList.add("form--unhidden");
  elem.classList.remove("form--hidden");
}

function getUsername() {
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    const username = usernameInput.value;
    localStorage.setItem("username", username);
  } 
}

// Afficher / cacher mot de passe
function togglePasswordVisibility(inputField, toggleBtn) {
  if (inputField.type === "password") {
    inputField.type = "text";
    toggleBtn.textContent = "🔒";
  } else {
    inputField.type = "password";
    toggleBtn.textContent = "👁️";
  }
}

passwordToggle.addEventListener("click", function () {
  togglePasswordVisibility(passwordInput, passwordToggle);
});

regPasswordToggle.addEventListener("click", function () {
  togglePasswordVisibility(regPasswordInput, regPasswordToggle);
});

confirmPasswordToggle.addEventListener("click", function () {
  togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
});

// Connexion
formLogin.addEventListener("submit", async function (e) {
  e.preventDefault();
  const usernameGroup = document.getElementById('usernameGroup');
  const passwordGroup = document.getElementById('passwordGroup');
  const emailInput = document.getElementById('username'); // In the login form, id is "username" but it should probably be email or they use email? Wait, let's look at the html
  const passwordError = document.querySelector('#Login #passwordError'); 

  // Réinitialiser les erreurs
  usernameGroup.classList.remove("error");
  passwordGroup.classList.remove("error");
  if(passwordError) passwordError.textContent = "The password must be at least 6 characters long";

  let isValid = true;

  if (passwordInput.value.length < 6) {
    passwordGroup.classList.add("error");
    isValid = false;
  }

  if (isValid) {
    try {
      // User is apparently using the username field to type an email, or I should just use email.
      // Wait, let's treat "username" input down here as email since firebase uses email.
      await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
      window.location.href = 'index.html';
    } catch(error) {
      passwordGroup.classList.add("error");
      let msg = "Une erreur est survenue.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = "Email ou mot de passe incorrect.";
      } else if (error.code === 'auth/configuration-not-found') {
        msg = "Email/Password n'est pas activé sur Firebase Console.";
      }
      if(passwordError) passwordError.textContent = msg;
    }
  }
});

// Inscription
formCreateAcc.addEventListener("submit", async function (e) {
  e.preventDefault();
  const regPasswordGroup = document.getElementById('regPasswordGroup');
  const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const emailInput = document.getElementById('email');
  const regUsernameInput = document.getElementById('regUsername');
  const regPasswordError = document.querySelector('#CreateAccount #passwordError');

  // Réinitialiser les erreurs
  regPasswordGroup.classList.remove("error");
  confirmPasswordGroup.classList.remove("error");
  confirmPasswordError.textContent = '';
  if(regPasswordError) regPasswordError.textContent = "The password must be at least 6 characters long";

  let isValid = true;

  if (regPasswordInput.value.length < 6) {
    regPasswordGroup.classList.add("error");
    isValid = false;
  }

  if (confirmPasswordInput.value !== regPasswordInput.value) {
    confirmPasswordGroup.classList.add("error");
    confirmPasswordError.textContent = "The passwords doesn't match";
    isValid = false;
  }

  if (isValid) {
    try {
      // Firebase create user
      const userCredential = await auth.createUserWithEmailAndPassword(emailInput.value, regPasswordInput.value);
      // Update display name
      await userCredential.user.updateProfile({ displayName: regUsernameInput.value });
      
      window.location.href = "index.html";
    } catch (error) {
      regPasswordGroup.classList.add("error");
      let msg = "Erreur lors de l'inscription.";
      if (error.code === 'auth/email-already-in-use') {
        msg = "Cet email possède déjà un compte.";
      } else if (error.code === 'auth/configuration-not-found') {
        msg = "Email/Password n'est pas activé sur Firebase Console.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "Le format de l'email est invalide.";
      }
      if(regPasswordError) regPasswordError.textContent = msg;
    }
  }
});
