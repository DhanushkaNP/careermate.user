import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Initialize Firebase Auth
const auth = getAuth();

// Example: Sign in a user
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in successfully, userCredential.user contains the user information
    // Proceed with file upload logic here
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // Handle authentication errors here
  });
