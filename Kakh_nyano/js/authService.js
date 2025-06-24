import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase";
import Cookies from "js-cookie";

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: true,
  sameSite: "strict"
};

// Authentication service
const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set auth cookie with user ID token
      const token = await user.getIdToken();
      Cookies.set("authToken", token, COOKIE_OPTIONS);
      
      return user;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  },
  
  // Register new user
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set auth cookie with user ID token
      const token = await user.getIdToken();
      Cookies.set("authToken", token, COOKIE_OPTIONS);
      
      return user;
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      // Remove auth cookie
      Cookies.remove("authToken");
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, 
        (user) => {
          unsubscribe();
          resolve(user);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!Cookies.get("authToken");
  }
};

export default authService;