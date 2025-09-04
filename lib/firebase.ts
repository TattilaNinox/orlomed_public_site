import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCWkH2x7ujj3xc8M1fhJAMphWo7pLBhV_k',
  authDomain: 'orlomed-f8f9f.firebaseapp.com',
  projectId: 'orlomed-f8f9f',
  storageBucket: 'orlomed-f8f9f.firebasestorage.app',
  messagingSenderId: '673799768268',
  appId: '1:673799768268:web:7f1a1b535157f7dbc6da69',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

