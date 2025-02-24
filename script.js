// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKLMx3Vi1Lo_TB6D942OWdmtD_kihL9h4",
    authDomain: "nurse-websit.firebaseapp.com",
    databaseURL: "https://nurse-websit-default-rtdb.firebaseio.com/",
    projectId: "nurse-websit",
    storageBucket: "nurse-websit.appspot.com",
    messagingSenderId: "982443926776",
    appId: "1:982443926776:web:7bf7e73353311b6f5a870d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// 🔹 Prevent Immediate Redirection on Page Load
firebase.auth().onAuthStateChanged(user => {
    setTimeout(() => {
        if (user && window.location.pathname.includes("index.html")) {
            window.location.href = "dashboard.html"; // Redirect logged-in users after Firebase confirmation
        }
    }, 1000); // Adding a slight delay to ensure Firebase loads
});

// 🔹 Login Nurse
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    alert("Login Successful!");
                    window.location.href = "dashboard.html"; // Redirect
                })
                .catch(() => {
                    document.getElementById("login-error").textContent = "Invalid email or password!";
                });
        });
    }
});

// 🔹 Logout Nurse
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            auth.signOut()
                .then(() => {
                    sessionStorage.removeItem("authenticated"); // Clear session
                    console.log("User logged out successfully.");
                    setTimeout(() => {
                        window.location.href = "index.html"; // Redirect after confirming logout
                    }, 1000); // Slight delay to ensure Firebase processes logout
                })
                .catch(error => {
                    console.error("Logout Error:", error);
                });
        });
    }
});

