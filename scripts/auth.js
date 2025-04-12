import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Add your own Firebase config here
const firebaseConfig = {
    apiKey: "AIzaSyBzkk5k0jSIgFokPwvr5NGRvBSfY29yssE",
    authDomain: "sdp1-960e9.firebaseapp.com",
    projectId: "sdp1-960e9",
    storageBucket: "sdp1-960e9.firebasestorage.app",
    messagingSenderId: "46642389939",
    appId: "1:46642389939:web:f6e93e550d91ea5cc9a1c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider()
const db = getFirestore();

const signInButton = document.getElementById("signInButton");

  const saveUserRoleIfNeeded = async (uid, role) => {
    const userRef = doc(db, "users", uid); // Get a reference to the user document by UID
    const docSnap = await getDoc(userRef); // Try to fetch the document from Firestore
  
    if (!docSnap.exists()) {              // If the user doesn't exist in the database...
      await setDoc(userRef, { role });    // ...create a new document and store their role
    }
  };

  export const userSignIn = async (roleHint = null) => {
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const uid = user.uid; // Get the user's unique ID
  
      // Reference the Firestore document for that user
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef); // Try to fetch their data
  
      // If the user doesn't exist in Firestore yet
      if (!docSnap.exists()) {
        if (!roleHint) {
          alert("No role provided for new user.");
          return;
        }
        
        // Prevent anyone from registering as an admin
        if (roleHint === 'admin') {
          alert("You cannot register as an admin.");
          return; // Stop the process if the role is admin
        }
  
        // Save the role for the first-time user
        await saveUserRoleIfNeeded(uid, roleHint);
      }
  
      // Now retrieve the user's roles from Firestore (assuming it's an array of roles)
      const userRoles = docSnap.data().role;
  
      // Check if the user has the role they are trying to access (e.g., "buyer" or "seller")
      if (userRoles.includes(roleHint)) {
        // Redirect based on the user's role
        switch (roleHint) {
          case "buyer":
            window.location.href = "../html/buyer_dashboard.html";
            break;
          case "seller":
            window.location.href = "../html/seller_dashboard.html";
            break;
          case "admin":
            window.location.href = "../html/admin_dashboard.html";
            break;
          default:
            console.warn("Unknown role. No redirection.");
        }
      } else {
        alert(`You don't have the ${roleHint} role.`);
      }
      
    } catch (err) {
      console.error("Sign-in error:", err.message);
      alert("Error signing in: " + err.message);
    }
  };

export { auth };