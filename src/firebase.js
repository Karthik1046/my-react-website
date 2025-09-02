import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe1t6wHdn0BGHK37hDiAu8uISqu70FAYI",
  authDomain: "movie-recommendation-e0b93.firebaseapp.com",
  projectId: "movie-recommendation-e0b93",
  storageBucket: "movie-recommendation-e0b93.appspot.com",
  messagingSenderId: "191706159865",
  appId: "1:191706159865:web:467de8efa30078770fe028",
  measurementId: "G-L0FQFMY6DD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Optional: Add additional scopes and parameters
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  'prompt': 'select_account' // Forces account selection even when one account is available
});

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Get the credential from the result
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) {
      throw new Error('No credential returned from sign in');
    }
    
    // Get the user from the result
    const user = result.user;
    
    // Return the user data
    return { 
      success: true, 
      user: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      email: error.customData?.email,
      credential: GoogleAuthProvider.credentialFromError(error)
    };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign Out Error:", error);
    return { success: false, error: error.message };
  }
};

export { auth, analytics };
