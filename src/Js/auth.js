const form = document.getElementById("form");

// Auth Toggle Functionality - Use URL parameters
document.addEventListener("DOMContentLoaded", function () {
  const formHeader = document.getElementById("formHeader");
  const signupMain = document.querySelector("main");
  const loginMain = document.getElementById("loginMain");

  // Check if we're on login or signup based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "signup";

  // Show appropriate form based on URL parameter
  if (mode === "login") {
    showLogin();
  } else {
    showSignup();
  }

  // Show login form, hide signup form
  function showLogin() {
    formHeader.textContent = "Login";
    signupMain.style.display = "none";
    loginMain.style.display = "block";
  }

  // Show signup form, hide login form
  function showSignup() {
    formHeader.textContent = "Sign-Up";
    signupMain.style.display = "block";
    loginMain.style.display = "none";
  }

  // Make functions globally available for header buttons
  window.showLogin = showLogin;
  window.showSignup = showSignup;
});

// Login form elements
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

// Login form validation
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation
    if (loginUsername.value.trim() === "") {
      alert("Please enter your username");
      return;
    }

    if (loginPassword.value.trim() === "") {
      alert("Please enter your password");
      return;
    }

    // For now, just show success message
    alert("Login successful! (This is a demo - no actual authentication)");

    // Redirect to home page
    window.location.href = "index.html";
  });
}
const userName = document.getElementById("userName");
const dob = document.getElementById("dob");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("submitBtn");

[userName, dob, email, password, confirmPassword].forEach((input) => {
  input.addEventListener("input", () => {
    if (input === userName) validateNameField(userName, "username");
    else if (input === dob) checkDOB();
    else if (input === email) checkEmail();
    else if (input === password) checkPassword();
    else if (input === confirmPassword) checkConfirmPassword();

    updateSubmitButtonState();
  });
});

// Helper Functions
const validateNameField = (input, label) => {
  const value = input.value.trim();
  const namePattern = /^[a-zA-Z'-]+$/;
  if (value === "") {
    setError(input, `${label} is required`);
  } else if (!namePattern.test(value)) {
    setError(input, `${label} is not valid`);
  } else if (value.length < 2) {
    setError(input, "Name must be at least 2 characters long");
  } else {
    setSuccess(input);
  }
};

const setError = (input, message) => {
  const parent = input.parentElement;
  const errorMsg = parent.querySelector("small");

  input.classList.add("error-border");
  input.classList.remove("success-border");

  errorMsg.innerText = message;
  errorMsg.classList.add("show");
};

const setSuccess = (input) => {
  const parent = input.parentElement;
  const errorMsg = parent.querySelector("small");

  input.classList.add("success-border");
  input.classList.remove("error-border");

  errorMsg.innerText = "";
  errorMsg.classList.remove("show");
};

const updateSubmitButtonState = () => {
  submitBtn.disabled = !isFormValid();
};

// Main Functions
const checkDOB = () => {
  const value = dob.value.trim();

  if (value === "" || !dob.checkValidity()) {
    setError(dob, "Please enter a valid Date of Birth");
  } else {
    setSuccess(dob);
  }
};

const checkEmail = () => {
  const emailValue = email.value.trim();
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (emailValue === "") {
    setError(email, "Email is required");
  } else if (!emailPattern.test(emailValue)) {
    setError(email, "Email is not valid");
  } else {
    setSuccess(email);
  }
};

const checkPassword = () => {
  const passwordValue = password.value.trim();
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (!passwordPattern.test(passwordValue)) {
    setError(password, "Password is not valid");
  } else {
    setSuccess(password);
  }
};

const checkConfirmPassword = () => {
  const confirmPasswordValue = confirmPassword.value.trim();
  const passwordValue = password.value.trim();
  if (confirmPasswordValue === "") {
    setError(confirmPassword, "Confirm Password is required");
  } else if (confirmPasswordValue !== passwordValue) {
    setError(confirmPassword, "Passwords do not match");
  } else {
    setSuccess(confirmPassword);
  }
};

// Form validation logic
const isFormValid = () => {
  const inputs = [userName, dob, email, password, confirmPassword];

  // Check if all fields have values AND are valid (no error-border class)
  return inputs.every((input) => {
    const value = input.value.trim();
    const hasValue = value !== "";
    const hasBeenValidated =
      input.classList.contains("success-border") ||
      input.classList.contains("error-border");

    // For initial state (no validation yet), require value and run validation
    if (!hasBeenValidated && hasValue) {
      // Run validation for this input
      if (input === userName) validateNameField(userName, "username");
      else if (input === dob) checkDOB();
      else if (input === email) checkEmail();
      else if (input === password) checkPassword();
      else if (input === confirmPassword) checkConfirmPassword();
    }

    return hasValue && !input.classList.contains("error-border");
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Run all validations
  validateNameField(userName, "username");
  checkDOB();
  checkEmail();
  checkPassword();
  checkConfirmPassword();

  // Check if form is valid after validation
  if (isFormValid()) {
    alert("Form submitted successfully!");
    // Here you would normally send the data to a server
  }
});

// Initial button state
updateSubmitButtonState();
