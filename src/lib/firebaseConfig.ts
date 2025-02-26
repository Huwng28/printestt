import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 🔥 Thêm dòng này

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDpOX-slC41T62cC8jND6WfxyeA64JpqEw",
  authDomain: "pinterest-clone-7053f.firebaseapp.com",
  databaseURL: "https://pinterest-clone-7053f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pinterest-clone-7053f",
  storageBucket: "pinterest-clone-7053f.appspot.com",
  messagingSenderId: "601737506563",
  appId: "1:601737506563:web:be694a016d6a4f0857c336",
  measurementId: "G-4KRMTNWNPW",
};

// Đảm bảo Firebase chỉ khởi tạo một lần
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Chỉ chạy analytics trên trình duyệt


// Providers cho Google & Facebook
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const db = getFirestore(app); // 🔥 Thêm dòng này để xuất Firestore


export { app, auth, analytics, googleProvider, facebookProvider, db };

