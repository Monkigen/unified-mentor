import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const docList = document.getElementById("doc-list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Not logged in!");
    return window.location.href = "index.html";
  }

  const q = query(collection(db, "documents"), where("userId", "==", user.uid));
  const docsSnap = await getDocs(q);

  if (docsSnap.empty) {
    docList.innerHTML = "<p>No documents uploaded yet.</p>";
    return;
  }

  docsSnap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${data.name}</strong></p>
      <a href="${data.url}" target="_blank">View Document</a>
      <hr />
    `;
    docList.appendChild(div);
  });
});
