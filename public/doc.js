import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function resolveId() {
  const qsId = new URLSearchParams(window.location.search).get('id');
  if (qsId) return qsId;
  const path = window.location.pathname;
  const m = path.match(/\/doc\/([^\/]+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

const id = resolveId();

const firebaseConfig = {
  apiKey: "AIzaSyCWkH2x7ujj3xc8M1fhJAMphWo7pLBhV_k",
  authDomain: "orlomed-f8f9f.firebaseapp.com",
  projectId: "orlomed-f8f9f",
  storageBucket: "orlomed-f8f9f.appspot.com",
  messagingSenderId: "673799768268",
  appId: "1:673799768268:web:7f1a1b535157f7dbc6da69",
  measurementId: "G-44N0XL8S9K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "lomedu-publik");

async function renderDoc() {
  const container = document.getElementById('doc-container');
  if (!id) {
    container.innerHTML = '<p class="text-danger">Hiányzó dokumentum azonosító.</p>';
    return;
  }
  try {
    const ref = doc(db, 'public_documents', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      container.innerHTML = '<p class="text-danger">A dokumentum nem található.</p>';
      return;
    }
    const data = snap.data();
    const title = data.title || 'Dokumentum';
    const html = data.content || '';
    container.innerHTML = `<h1 class="h3 mb-4">${title}</h1><div class="doc-content">${html}</div>`;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-danger">Hiba történt a dokumentum betöltése közben: ${err && (err.message || err.code || err)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', renderDoc);
