// firebase.js - Versão final
// Mantenha este arquivo na raiz do seu projeto
// Não misture com v8 ou outros arquivos

// Importações Firebase modular (v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===== CONFIGURAÇÃO FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyDwsERnH6Obpzc6Klt9r7IxDXWOkiaYSHU",
  authDomain: "sofi-chat.firebaseapp.com",
  projectId: "sofi-chat",
  storageBucket: "sofi-chat.firebasestorage.app",
  messagingSenderId: "533851013944",
  appId: "1:533851013944:web:a49900cdde03ba01dd37cd"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore para usar nos outros arquivos
export const auth = getAuth(app);
export const db = getFirestore(app);

// ===== DOMÍNIO AUTORIZADO =====
// Garanta que o domínio do GitHub Pages (ex: admfagnee.github.io) esteja adicionado
// em Configurações -> Autenticação -> Domínios autorizados no Firebase
