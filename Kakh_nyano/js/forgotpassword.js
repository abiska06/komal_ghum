
import { auth } from './firebase.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { Notyf } from 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    types: [
        { type: 'error', background: '#EF4444', color: 'white', icon: false },
        { type: 'success', background: '#10B981', color: 'white', icon: false }
    ]
});

document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const emailInput = document.getElementById('email');

    if (!forgotPasswordForm || !errorMessage || !successMessage || !emailInput) {
        console.error("Required DOM elements are missing.");
        notyf.error("Required DOM elements are missing.");
        return;
    }

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = "";
        successMessage.textContent = "";

        const email = emailInput.value.trim();

        if (!email) {
            errorMessage.textContent = "Please enter your email address.";
            notyf.error("Please enter your email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMessage.textContent = "Please enter a valid email address.";
            notyf.error("Please enter a valid email address.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            successMessage.textContent = "Password reset email sent! Check your inbox.";
            notyf.success("Password reset email sent! Check your inbox.");
            setTimeout(() => window.location.href = "login.html", 2000);
        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}`;
            notyf.error(`Error: ${error.message}`);
        }
    });
});