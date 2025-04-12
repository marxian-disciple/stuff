import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, { roles: [role] });
  }
};

export const userSignIn = async (roleHint = null) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const uid = user.uid;

    // Prevent anyone from registering as an admin
    if (roleHint === 'admin') {
      alert("You cannot register as an admin.");
      return;
    }

    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, { roles: [roleHint] });
    } else {
      await updateDoc(userRef, {
        roles: arrayUnion(roleHint)
      });
    }

    // Now retrieve the updated document (fresh read)
    const updatedSnap = await getDoc(userRef);
    const userRoles = updatedSnap.data().roles;

    // Check if the user has the requested role
    if (userRoles?.includes(roleHint)) {
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
