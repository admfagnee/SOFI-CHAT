<script type="module">
import { auth, db } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Provider Google
const provider = new GoogleAuthProvider();

// 🔐 Login com Google
window.loginWithGoogle = async function () {
  try {
    await signInWithPopup(auth, provider);
    // NÃO redireciona aqui → evita loop
  } catch (error) {
    alert("Erro no login: " + error.message);
  }
};

// 👀 Observa estado de autenticação (CORAÇÃO DO SISTEMA)
onAuthStateChanged(auth, async (user) => {
  const isLoginPage = window.location.pathname.includes("index.html") || window.location.pathname === "/";

  if (user) {
    // Salva / atualiza usuário no Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName || "Sem nome",
      email: user.email || null,
      photo: user.photoURL || null,
      online: true,
      lastLogin: serverTimestamp()
    }, { merge: true });

    // Se estiver no login → vai para o chat
    if (isLoginPage) {
      window.location.href = "chat.html";
    }

  } else {
    // Se NÃO estiver logado e NÃO estiver no login → volta
    if (!isLoginPage) {
      window.location.href = "index.html";
    }
  }
});

// 🚪 Logout
window.logout = async function () {
  await signOut(auth);
  window.location.href = "index.html";
};
</script>