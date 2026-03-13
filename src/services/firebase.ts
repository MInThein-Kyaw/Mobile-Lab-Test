import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCfGipj5fNp3OAoyR1TSbzk_19i3FU8-KA",
	authDomain: "smart-check-in-a3802.firebaseapp.com",
	projectId: "smart-check-in-a3802",
	storageBucket: "smart-check-in-a3802.firebasestorage.app",
	messagingSenderId: "177513446604",
	appId: "1:177513446604:web:e781bfbdd82bc7e502d669",
	measurementId: "G-E42P9MFBQN",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function getFirebaseApp() {
	if (!getApps().length) {
		app = initializeApp(firebaseConfig);
	} else if (!app) {
		app = getApp();
	}

	if (!auth) {
		auth = getAuth(app);
	}

	if (!db) {
		db = getFirestore(app);
	}

	return { app, auth, db };
}
