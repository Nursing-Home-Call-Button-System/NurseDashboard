// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKLMx3Vi1Lo_TB6D942OWdmtD_kihL9h4",
    authDomain: "nurse-websit.firebaseapp.com",
    projectId: "nurse-websit",
    storageBucket: "nurse-websit.appspot.com",
    messagingSenderId: "982443926776",
    appId: "1:982443926776:web:7bf7e73353311b6f5a870d"
};

// ✅ Initialize Firebase (Only if not already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

// ✅ Initialize Firebase Services
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM Fully Loaded!");

    // ✅ Check Authentication State and Redirect if Necessary
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("✅ User Logged In:", user.email);
            if (window.location.pathname.includes("index.html")) {
                window.location.href = "dashboard.html"; // Redirect to dashboard if already logged in
            }
        } else {
            console.log("❌ No User Logged In.");
            if (window.location.pathname.includes("dashboard.html") || window.location.pathname.includes("patient_list.html")) {
                window.location.href = "index.html"; // Redirect to login if user not logged in
            }
        }
    });

    // ✅ Login Functionality
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    console.log("✅ Login Successful - Redirecting to Dashboard...");
                    window.location.href = "dashboard.html";
                })
                .catch((error) => {
                    console.error("❌ Login Error:", error);
                    document.getElementById("login-error").textContent = "Invalid email or password!";
                });
        });
    }

    // ✅ Logout Functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("🔹 Logout Button Clicked");
            auth.signOut()
                .then(() => {
                    console.log("✅ Logged Out - Redirecting to Login Page...");
                    window.location.href = "index.html"; // Redirect to login
                })
                .catch((error) => {
                    console.error("❌ Logout Error:", error);
                });
        });
    }

    // ✅ Redirect to Patient List Page
    const patientListBtn = document.getElementById("patient-list-btn");
    if (patientListBtn) {
        patientListBtn.addEventListener("click", function () {
            console.log("📌 Redirecting to `patient_list.html`...");
            window.location.href = "patient_list.html"; // Redirect to patient list
        });
    }

    // ✅ Load Patient Data If on Patient List Page
    if (window.location.pathname.includes("patient_list.html")) {
        loadPatientData();
    }
});

// ✅ Function to Load Patient Data from Firestore
function loadPatientData() {
    console.log("📌 Fetching patient data from Firestore...");
    const tableBody = document.getElementById("wearos-user-table");

    if (!tableBody) {
        console.error("❌ Table body `wearos-user-table` not found! Check HTML.");
        return;
    }

    // ✅ Use Firestore real-time listener
    db.collection("patients").onSnapshot((snapshot) => {
        tableBody.innerHTML = ""; // ✅ Clear old data

        if (snapshot.empty) {
            console.warn("⚠️ No patient data found in Firestore.");
            tableBody.innerHTML = "<tr><td colspan='2'>No patient data available.</td></tr>";
            return;
        }

        console.log("✅ Patients Data Found in Firestore:", snapshot.docs.map(doc => doc.data()));

        snapshot.forEach((doc) => {
            const patient = doc.data();
            console.log(`📌 Adding row: ${patient.name}, Room: ${patient.roomNumber}`);

            // ✅ Insert row into table
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${patient.name || "Unknown"}</td>
                <td>${patient.roomNumber || "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });
    }, (error) => {
        console.error("❌ Firestore Read Error:", error);
    });
}
