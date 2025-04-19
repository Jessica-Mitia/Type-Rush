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
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  const usernameGroup = document.getElementById('usernameGroup');
  const passwordGroup = document.getElementById('passwordGroup');

  // Réinitialiser les erreurs
  usernameGroup.classList.remove("error");
  passwordGroup.classList.remove("error");

  let isValid = true;

  if (passwordInput.value.length < 6) {
    passwordGroup.classList.add("error");
    isValid = false;
  }

  getUsername();
  if (isValid) window.location.href = 'index.html'
});

// Inscription
formCreateAcc.addEventListener("submit", function (e) {
  e.preventDefault();
  const regPasswordGroup = document.getElementById('regPasswordGroup');
  const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  // Réinitialiser les erreurs
  regPasswordGroup.classList.remove("error");
  confirmPasswordGroup.classList.remove("error");
  confirmPasswordError.textContent = '';

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

  getUsername();
  if (isValid) window.location.href = "index.html";
});
