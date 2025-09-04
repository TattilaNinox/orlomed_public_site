import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function displayDocuments() {
  const root = document.getElementById('document-list');
  const errorP = document.createElement('p');
  errorP.className = 'text-center text-danger';

  try {
    const snap = await getDocs(collection(db, 'public_documents'));
    if (snap.empty) {
      root.className = '';
      root.innerHTML = '<p class="text-center">Nincsenek megjeleníthető dokumentumok.</p>';
      return;
    }

    const byCat = new Map();
    snap.forEach(d => {
      const data = d.data();
      const cat = (data.category || 'Egyéb').toString();
      const item = { id: d.id, title: data.title || 'Névtelen dokumentum' };
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push(item);
    });

    const categories = Array.from(byCat.keys()).sort((a, b) => a.localeCompare(b, 'hu'));
    categories.forEach(cat => byCat.get(cat).sort((a, b) => a.title.localeCompare(b.title, 'hu')));

    root.className = '';
    root.innerHTML = '';

    for (const cat of categories) {
      const items = byCat.get(cat);
      const listHtml = items.map(doc => `
        <li class="list-group-item">
          <a href="doc.html?id=${encodeURIComponent(doc.id)}" class="text-decoration-none d-block">${doc.title}</a>
        </li>
      `).join('');

      const card = `
        <div class="card mb-4 shadow-sm">
          <ul class="list-group list-group-flush">
            ${listHtml}
          </ul>
        </div>
      `;
      root.innerHTML += card;
    }
  } catch (err) {
    console.error(err);
    errorP.textContent = `Hiba részletei: ${err && (err.message || err.code || err)}`;
    root.className = '';
    root.innerHTML = '';
    root.appendChild(errorP);
  }
}

document.addEventListener('DOMContentLoaded', displayDocuments);
