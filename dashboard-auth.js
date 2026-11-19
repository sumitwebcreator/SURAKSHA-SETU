import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const userBox = document.getElementById("dashboardUser");
const logoutButton = document.getElementById("logoutButton");

onAuthStateChanged(auth, (user) => {
    if (user) {
        userBox.textContent = `Welcome, ${user.displayName || user.email || "User"}. You are signed in.`;
        logoutButton.classList.remove("d-none");
    } else {
        userBox.textContent = "You are viewing the public demo dashboard. Sign in to use your account.";
        logoutButton.classList.add("d-none");
    }
});

logoutButton.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});
