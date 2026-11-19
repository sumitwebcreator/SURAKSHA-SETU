// Firebase Authentication for Suraksha Setu.
// Firebase Console must have Email/Password, Phone, Google and Apple providers enabled.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail,
    GoogleAuthProvider, OAuthProvider, signInWithPopup, RecaptchaVerifier,
    signInWithPhoneNumber, PhoneAuthProvider, EmailAuthProvider, linkWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const messageBox = document.getElementById("authMessage");
let signupConfirmation = null;
let loginConfirmation = null;
let signupVerifier = null;
let loginVerifier = null;
let pendingSignup = null;

function showMessage(message, type = "info") {
    messageBox.textContent = message;
    messageBox.className = `alert alert-${type}`;
}

function showPanel(panel) {
    document.getElementById("loginPanel").classList.toggle("d-none", panel !== "login");
    document.getElementById("signupPanel").classList.toggle("d-none", panel !== "signup");
    document.getElementById("showLogin").className = panel === "login" ? "btn btn-main" : "btn btn-outline-main";
    document.getElementById("showSignup").className = panel === "signup" ? "btn btn-main" : "btn btn-outline-main";
    messageBox.classList.add("d-none");
}
document.getElementById("showLogin").addEventListener("click", () => showPanel("login"));
document.getElementById("showSignup").addEventListener("click", () => showPanel("signup"));

function friendlyError(error) {
    const messages = {
        "auth/email-already-in-use": "This email is already registered. Please log in.",
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/weak-password": "Use a stronger password with at least 6 characters.",
        "auth/invalid-phone-number": "Enter a valid mobile number with country code, for example +91XXXXXXXXXX.",
        "auth/popup-closed-by-user": "The sign-in window was closed before completion.",
        "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase Console.",
        "auth/unauthorized-domain": "Add this website domain to Firebase Authentication authorized domains.",
        "auth/captcha-check-failed": "Phone verification failed. Please refresh and try again."
    };
    return messages[error.code] || error.message || "Something went wrong. Please try again.";
}

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        await signInWithEmailAndPassword(auth,
            document.getElementById("loginEmail").value.trim(),
            document.getElementById("loginPassword").value);
        showMessage("Login successful. Opening your dashboard...", "success");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(friendlyError(error), "danger");
    }
});

document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        showMessage("Password and confirm password do not match.", "danger");
        return;
    }

    try {
        pendingSignup = { name, phone, email, password };
        if (!signupVerifier) {
            signupVerifier = new RecaptchaVerifier(auth, "signupRecaptcha", { size: "normal" });
            await signupVerifier.render();
        }
        signupConfirmation = await signInWithPhoneNumber(auth, phone, signupVerifier);
        document.getElementById("signupOtpArea").classList.remove("d-none");
        showMessage("OTP sent to your mobile. Verify it to finish creating your account.", "success");
    } catch (error) {
        showMessage(friendlyError(error), "danger");
    }
});

document.getElementById("verifySignupOtp").addEventListener("click", async () => {
    try {
        if (!signupConfirmation || !pendingSignup) {
            throw new Error("Complete the sign-up form and request an OTP first.");
        }
        const phoneResult = await signupConfirmation.confirm(
            document.getElementById("signupOtp").value.trim()
        );
        const emailCredential = EmailAuthProvider.credential(
            pendingSignup.email,
            pendingSignup.password
        );
        await linkWithCredential(phoneResult.user, emailCredential);
        await updateProfile(auth.currentUser, { displayName: pendingSignup.name });
        showMessage("Your account is created and your phone number is verified. Opening dashboard...", "success");
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(friendlyError(error), "danger");
    }
});

document.getElementById("sendLoginOtp").addEventListener("click", async () => {
    try {
        const phone = document.getElementById("loginPhone").value.trim();
        if (!loginVerifier) {
            loginVerifier = new RecaptchaVerifier(auth, "loginRecaptcha", { size: "normal" });
            await loginVerifier.render();
        }
        loginConfirmation = await signInWithPhoneNumber(auth, phone, loginVerifier);
        document.getElementById("loginOtpArea").classList.remove("d-none");
        showMessage("OTP sent. Enter the code received on your phone.", "success");
    } catch (error) {
        showMessage(friendlyError(error), "danger");
    }
});

document.getElementById("verifyLoginOtp").addEventListener("click", async () => {
    try {
        if (!loginConfirmation) throw new Error("Please request an OTP first.");
        await loginConfirmation.confirm(document.getElementById("loginOtp").value.trim());
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(friendlyError(error), "danger");
    }
});

document.getElementById("googleLogin").addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(friendlyError(error), "danger");
    }
});

document.getElementById("appleLogin").addEventListener("click", async () => {
    try {
        const provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
        await signInWithPopup(auth, provider);
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(friendlyError(error), "danger");
    }
});

// Password reset is connected to Firebase.
const forgotLink = document.querySelector('a[href="#"]');
if (forgotLink) {
    forgotLink.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        if (!email) {
            showMessage("Enter your email address first, then choose Forgot password.", "warning");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            showMessage("Password reset email sent. Check your inbox.", "success");
        } catch (error) {
            showMessage(friendlyError(error), "danger");
        }
    });
}
