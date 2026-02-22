// Auth Page Script - Handles login and signup forms
import { getElementById, querySelector } from "./dom-helpers.js";
import { initializeUI, initializeStorageListener } from "./ui-helpers.js";
document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
    initializeStorageListener();
    const signupForm = getElementById("form");
    const loginForm = getElementById("loginForm");
    const formHeader = getElementById("formHeader");
    const signupMainSection = querySelector("main");
    const loginMainSection = getElementById("loginMain");
    const showLogin = () => {
        if (formHeader)
            formHeader.textContent = "Login";
        if (signupMainSection)
            signupMainSection.style.display = "none";
        if (loginMainSection)
            loginMainSection.style.display = "block";
    };
    const showSignup = () => {
        if (formHeader)
            formHeader.textContent = "Sign-Up";
        if (signupMainSection)
            signupMainSection.style.display = "block";
        if (loginMainSection)
            loginMainSection.style.display = "none";
    };
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode") || "signup";
    mode === "login" ? showLogin() : showSignup();
    const desktopSearchForm = querySelector(".searchbar-input");
    const desktopSearchInput = desktopSearchForm === null || desktopSearchForm === void 0 ? void 0 : desktopSearchForm.querySelector("input[type='text']");
    const mobileSearchForm = querySelector(".sidebar-search-form");
    const mobileSearchInput = querySelector(".sidebar-search-input");
    const redirectToHomeSearch = (searchQuery) => {
        const trimmedQuery = (searchQuery || "").trim();
        if (!trimmedQuery)
            return;
        window.location.href = `index.html?q=${encodeURIComponent(trimmedQuery)}`;
    };
    // Set up desktop search form
    if (desktopSearchForm && desktopSearchInput) {
        desktopSearchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            redirectToHomeSearch(desktopSearchInput.value);
        });
    }
    // Set up mobile search form
    if (mobileSearchForm && mobileSearchInput) {
        mobileSearchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            redirectToHomeSearch(mobileSearchInput.value);
        });
    }
    const ensureStatusElement = (formElement, statusElementId) => {
        if (!formElement)
            return null;
        let statusElement = getElementById(statusElementId);
        if (!statusElement) {
            statusElement = document.createElement("p");
            statusElement.id = statusElementId;
            statusElement.setAttribute("role", "status");
            statusElement.setAttribute("aria-live", "polite"); // Accessibility: screen readers announce changes
            statusElement.style.marginTop = "12px";
            statusElement.style.fontSize = "0.95rem";
            formElement.appendChild(statusElement);
        }
        return statusElement;
    };
    const setStatusMessage = (statusElement, message, messageType = "info") => {
        if (!statusElement)
            return;
        statusElement.textContent = message;
        if (!message) {
            statusElement.style.display = "none";
            return;
        }
        statusElement.style.display = "block";
        statusElement.style.color =
            messageType === "success" ? "#1f7a1f" : "#b42318";
    };
    // Create status elements for both forms
    const loginStatusElement = ensureStatusElement(loginForm, "loginStatus");
    const signupStatusElement = ensureStatusElement(signupForm, "signupStatus");
    // Get references to signup form input fields
    const userNameInput = getElementById("userName");
    const dateOfBirthInput = getElementById("dob");
    const emailInput = getElementById("email");
    const passwordInput = getElementById("password");
    const confirmPasswordInput = getElementById("confirmPassword");
    const submitButton = getElementById("submitBtn");
    const validateNameField = (inputElement, fieldLabel) => {
        const inputValue = inputElement.value.trim();
        const namePattern = /^[a-zA-Z'-]+$/;
        if (inputValue === "") {
            setError(inputElement, `${fieldLabel} is required`);
        }
        else if (!namePattern.test(inputValue)) {
            setError(inputElement, `${fieldLabel} is not valid`);
        }
        else if (inputValue.length < 3) {
            setError(inputElement, "Username must be at least 3 characters long");
        }
        else {
            setSuccess(inputElement);
        }
    };
    const setError = (inputElement, errorMessage) => {
        const parentElement = inputElement.parentElement;
        const errorMessageElement = parentElement === null || parentElement === void 0 ? void 0 : parentElement.querySelector("small");
        inputElement.classList.add("error-border");
        inputElement.classList.remove("success-border");
        if (errorMessageElement) {
            errorMessageElement.innerText = errorMessage;
            errorMessageElement.classList.add("show");
        }
    };
    const setSuccess = (inputElement) => {
        const parentElement = inputElement.parentElement;
        const errorMessageElement = parentElement === null || parentElement === void 0 ? void 0 : parentElement.querySelector("small");
        inputElement.classList.add("success-border");
        inputElement.classList.remove("error-border");
        if (errorMessageElement) {
            errorMessageElement.innerText = "";
            errorMessageElement.classList.remove("show");
        }
    };
    const updateSubmitButtonState = () => {
        if (submitButton)
            submitButton.disabled = !isFormValid();
    };
    const checkDateOfBirth = () => {
        if (!dateOfBirthInput)
            return;
        const inputValue = dateOfBirthInput.value.trim();
        if (inputValue === "" || !dateOfBirthInput.checkValidity()) {
            setError(dateOfBirthInput, "Please enter a valid Date of Birth");
        }
        else {
            setSuccess(dateOfBirthInput);
        }
    };
    const checkEmail = () => {
        if (!emailInput)
            return;
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailValue === "") {
            setError(emailInput, "Email is required");
        }
        else if (!emailPattern.test(emailValue)) {
            setError(emailInput, "Email is not valid");
        }
        else {
            setSuccess(emailInput);
        }
    };
    const checkPassword = () => {
        if (!passwordInput)
            return;
        const passwordValue = passwordInput.value.trim();
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
        if (passwordValue === "") {
            setError(passwordInput, "Password is required");
        }
        else if (!passwordPattern.test(passwordValue)) {
            setError(passwordInput, "Password must be 8+ chars and include upper, lower, number, and special character");
        }
        else {
            setSuccess(passwordInput);
        }
    };
    const checkConfirmPassword = () => {
        if (!confirmPasswordInput || !passwordInput)
            return;
        const confirmPasswordValue = confirmPasswordInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        if (confirmPasswordValue === "") {
            setError(confirmPasswordInput, "Confirm Password is required");
        }
        else if (confirmPasswordValue !== passwordValue) {
            setError(confirmPasswordInput, "Passwords do not match");
        }
        else {
            setSuccess(confirmPasswordInput);
        }
    };
    const isFormValid = () => {
        const allInputs = [
            userNameInput,
            dateOfBirthInput,
            emailInput,
            passwordInput,
            confirmPasswordInput,
        ];
        // Check if all fields have values AND are valid (no error-border class)
        return allInputs.every((inputElement) => {
            if (!inputElement)
                return false;
            const inputValue = inputElement.value.trim();
            const hasValue = inputValue !== "";
            const hasBeenValidated = inputElement.classList.contains("success-border") ||
                inputElement.classList.contains("error-border");
            // For initial state (no validation yet), require value and run validation
            if (!hasBeenValidated && hasValue) {
                // Run validation for this input
                if (inputElement === userNameInput)
                    validateNameField(userNameInput, "username");
                else if (inputElement === dateOfBirthInput)
                    checkDateOfBirth();
                else if (inputElement === emailInput)
                    checkEmail();
                else if (inputElement === passwordInput)
                    checkPassword();
                else if (inputElement === confirmPasswordInput)
                    checkConfirmPassword();
            }
            return hasValue && !inputElement.classList.contains("error-border");
        });
    };
    const loginUsernameInput = getElementById("loginUsername");
    const loginPasswordInput = getElementById("loginPassword");
    if (loginForm && loginUsernameInput && loginPasswordInput) {
        // Validate username as user types
        loginUsernameInput.addEventListener("input", () => {
            if (loginUsernameInput.value.trim() === "") {
                setError(loginUsernameInput, "Username is required");
            }
            else {
                setSuccess(loginUsernameInput);
            }
            setStatusMessage(loginStatusElement, "");
        });
        // Validate password as user types
        loginPasswordInput.addEventListener("input", () => {
            if (loginPasswordInput.value.trim() === "") {
                setError(loginPasswordInput, "Password is required");
            }
            else {
                setSuccess(loginPasswordInput);
            }
            setStatusMessage(loginStatusElement, "");
        });
        // Handle login form submission
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const usernameValue = loginUsernameInput.value.trim();
            const passwordValue = loginPasswordInput.value.trim();
            // Validate username
            if (!usernameValue) {
                setError(loginUsernameInput, "Username is required");
                setStatusMessage(loginStatusElement, "Please fix the errors above.", "error");
                return;
            }
            // Validate password
            if (!passwordValue) {
                setError(loginPasswordInput, "Password is required");
                setStatusMessage(loginStatusElement, "Please fix the errors above.", "error");
                return;
            }
            // Success! Redirect to home page
            // Note: This is a demo - real app would verify credentials with backend
            setStatusMessage(loginStatusElement, "Login successful (demo). Redirecting…", "success");
            window.location.href = "index.html";
        });
    }
    if (signupForm &&
        userNameInput &&
        dateOfBirthInput &&
        emailInput &&
        passwordInput &&
        confirmPasswordInput &&
        submitButton) {
        // Add real-time validation to all input fields
        [
            userNameInput,
            dateOfBirthInput,
            emailInput,
            passwordInput,
            confirmPasswordInput,
        ].forEach((inputElement) => {
            inputElement.addEventListener("input", () => {
                // Run appropriate validation for each field
                if (inputElement === userNameInput)
                    validateNameField(userNameInput, "username");
                else if (inputElement === dateOfBirthInput)
                    checkDateOfBirth();
                else if (inputElement === emailInput)
                    checkEmail();
                else if (inputElement === passwordInput)
                    checkPassword();
                else if (inputElement === confirmPasswordInput)
                    checkConfirmPassword();
                // Clear any previous status message
                setStatusMessage(signupStatusElement, "");
                // Update submit button state (enable/disable)
                updateSubmitButtonState();
            });
        });
        // Handle signup form submission
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            // Validate all fields
            validateNameField(userNameInput, "username");
            checkDateOfBirth();
            checkEmail();
            checkPassword();
            checkConfirmPassword();
            // Check if form is valid
            if (isFormValid()) {
                setStatusMessage(signupStatusElement, "Sign-up successful (demo). You can log in now.", "success");
                showLogin();
            }
            else {
                // Show error message
                setStatusMessage(signupStatusElement, "Please fix the errors above.", "error");
            }
        });
        // Set initial submit button state
        updateSubmitButtonState();
    }
});
