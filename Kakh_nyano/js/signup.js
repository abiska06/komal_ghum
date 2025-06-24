import { app, firestore, auth } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { Notyf } from 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    types: [
        { type: 'error', background: '#EF4444', color: 'white', icon: false },
        { type: 'success', background: '#10B981', color: 'white', icon: false }
    ]
});

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.querySelector('#signup-form');
    const passwordInput = document.querySelector('#password-input');
    const confirmPasswordInput = document.querySelector('#confirm-password-input');
    const passwordStrength = document.querySelector('#password-strength');
    const confirmPasswordStrength = document.querySelector('#confirm-password-strength');
    const errorMessage = document.querySelector('#error-message');
    const successMessage = document.querySelector('#success-message');
    const signupButton = document.querySelector('#signup-button');
    const passwordToggle = document.querySelector('#password-toggle');
    const confirmPasswordToggle = document.querySelector('#confirm-password-toggle');
    const firstNameInput = document.querySelector('#first-name');
    const lastNameInput = document.querySelector('#last-name');
    const emailInput = document.querySelector('#email');
    const dobInput = document.querySelector('#birth-date');
    const genderInput = document.querySelector('#gender');
    const childNameInput = document.querySelector('#child-name');
    const childDobInput = document.querySelector('#child-birth-date');
    const childGenderInput = document.querySelector('#child-gender');
    const phoneInput = document.querySelector('#phone-number');
    const rememberPasswordInput = document.querySelector('#remember-password');

    // Password strength checker
    function checkPasswordStrength(password) {
        if (!password) return { strength: "weak", message: "Password is required." };
        
        const errors = [];
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough) errors.push("Password must be at least 8 characters.");
        if (!hasUpperCase) errors.push("Must include a capital letter.");
        if (!hasLowerCase) errors.push("Must include a lowercase letter.");
        if (!hasSpecialChar) errors.push("Must include a special character.");
        if (!hasNumber) errors.push("Must include a number.");

        if (errors.length > 0) {
            return { strength: "weak", message: errors.join(" ") };
        } else if (password.length >= 12) {
            return { strength: "strong", message: "Strong password!" };
        }
        return { strength: "medium", message: "Good password, consider adding more characters." };
    }

    // Toggle password visibility
    function togglePasswordVisibility(input, toggleElement) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const eye = toggleElement.querySelector('.eye');
        const eyeSlash = toggleElement.querySelector('.eye-slash');
        if (eye && eyeSlash) {
            eye.classList.toggle('show', !isPassword);
            eyeSlash.classList.toggle('show', isPassword);
        }
    }

    // Bind toggle events
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => togglePasswordVisibility(passwordInput, passwordToggle));
    }
    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle));
    }

    // Validate all form fields
    function validateForm() {
        const password = passwordInput?.value || "";
        const confirmPassword = confirmPasswordInput?.value || "";
        const passwordStrengthResult = checkPasswordStrength(password);
        const passwordsMatch = password === confirmPassword && password !== "";
        const isPasswordValid = passwordStrengthResult.strength !== "weak";

        // Validate other required fields
        const isFormValid = 
            firstNameInput?.value.trim() &&
            lastNameInput?.value.trim() &&
            emailInput?.value.trim() &&
            dobInput?.value &&
            genderInput?.value &&
            childNameInput?.value.trim() &&
            childDobInput?.value &&
            childGenderInput?.value &&
            phoneInput?.value.trim() &&
            isPasswordValid &&
            passwordsMatch;

        // Update password strength display
        passwordStrength.textContent = password ? passwordStrengthResult.message : "";
        passwordStrength.className = `password-strength strength-${passwordStrengthResult.strength}`;

        // Update confirm password strength display
        confirmPasswordStrength.textContent = confirmPassword ? 
            (passwordsMatch ? "Passwords match!" : "Passwords do not match.") : "";
        confirmPasswordStrength.className = `password-strength ${passwordsMatch ? 'strength-strong' : 'strength-weak'}`;

        // Enable/disable signup button
        signupButton.disabled = !isFormValid;
        signupButton.classList.toggle('bg-indigo-600', isFormValid);
        signupButton.classList.toggle('hover:bg-indigo-700', isFormValid);
        signupButton.classList.toggle('bg-gray-500', !isFormValid);
        signupButton.classList.toggle('cursor-not-allowed', !isFormValid);

        return isFormValid;
    }

    // Add input event listeners for real-time validation
    const inputs = [
        firstNameInput, lastNameInput, emailInput, passwordInput,
        confirmPasswordInput, dobInput, genderInput, childNameInput,
        childDobInput, childGenderInput, phoneInput
    ];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', validateForm);
    });

    // Initial validation
    validateForm();

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = "";
        successMessage.textContent = "";

        if (!validateForm()) {
            notyf.error("Please fill in all required fields correctly.");
            errorMessage.textContent = "Please fill in all required fields correctly.";
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            const user = userCredential.user;

            // Store user data in Firestore
            await setDoc(doc(firestore, "users", user.uid), {
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                fullName: `${firstNameInput.value} ${lastNameInput.value}`,
                email: emailInput.value,
                dob: dobInput.value,
                gender: genderInput.value,
                childName: childNameInput.value,
                childDob: childDobInput.value,
                childGender: childGenderInput.value,
                phone: phoneInput.value,
                signupTimestamp: new Date(),
            });

            // Handle "Remember Password" functionality
            if (rememberPasswordInput.checked) {
                localStorage.setItem("nyanoKakhUser", JSON.stringify({ email: emailInput.value, uid: user.uid }));
            } else {
                localStorage.removeItem("nyanoKakhUser");
            }

            notyf.success("Account created successfully!");
            successMessage.textContent = "Account created successfully! Redirecting...";
            setTimeout(() => window.location.href = "index.html", 1500);
        } catch (error) {
            notyf.error(`Error: ${error.message}`);
            errorMessage.textContent = `Error: ${error.message}`;
        }
    });
});
