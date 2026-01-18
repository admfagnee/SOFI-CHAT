<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwsERnH6Obpzc6Klt9r7IxDXWOkiaYSHU",
  authDomain: "sofi-chat.firebaseapp.com",
  projectId: "sofi-chat",
  storageBucket: "sofi-chat.firebasestorage.app",
  messagingSenderId: "533851013944",
  appId: "1:533851013944:web:a49900cdde03ba01dd37cd"
};

// Inicializa Firebase UMA VEZ
export const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
</script>