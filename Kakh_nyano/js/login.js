import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { Notyf } from 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    types: [
        { type: 'error', background: '#EF4444', color: 'white', icon: false },
        { type: 'success', background: '#10B981', color: 'white', icon: false }
    ]
});

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const rememberMe = document.getElementById("remember-me");

    if (!loginForm || !errorMessage || !successMessage || !rememberMe) {
        console.error("Required DOM elements are missing.");
        notyf.error("Required DOM elements are missing.");
        return;
    }

    // Check for remembered user
    const rememberedUser = localStorage.getItem("nyanoKakhUser");
    if (rememberedUser) {
        successMessage.textContent = "Auto-logging in...";
        notyf.success("Auto-logging in...");
        setTimeout(() => window.location.href = "index.html", 1000);
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMessage.textContent = "";
        successMessage.textContent = "";

        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;
        const remember = rememberMe.checked;

        if (!email || !password) {
            errorMessage.textContent = "Please enter both email and password.";
            notyf.error("Please enter both email and password.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (remember) {
                localStorage.setItem("nyanoKakhUser", JSON.stringify({ email, uid: user.uid }));
            } else {
                localStorage.removeItem("nyanoKakhUser");
            }

            successMessage.textContent = "Login successful! Redirecting...";
            notyf.success("Login successful!");
            setTimeout(() => window.location.href = "index.html", 1500);
        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}`;
            notyf.error(`Error: ${error.message}`);
        }
    });
});