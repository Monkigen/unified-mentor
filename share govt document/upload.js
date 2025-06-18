// upload.js
import { storage, db } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const uploadForm = document.getElementById("upload-form");

if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const docName = document.getElementById("doc-name").value;
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);

      // Get the file's download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, "documents"), {
        name: docName,
        fileName: file.name,
        url: downloadURL,
        uploadedAt: new Date().toISOString()
      });

      alert("Document uploaded successfully!");
      console.log("Document metadata saved with ID:", docRef.id);

      // Reset the form
      uploadForm.reset();
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to upload document: " + error.message);
    }
  });
}

