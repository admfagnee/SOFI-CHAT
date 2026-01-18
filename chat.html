import { auth, db } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const contatosDiv = document.getElementById("contatos");
const btnSair = document.getElementById("sair");

let usuarioAtual = null;

/* ==========================
   AUTENTICAÇÃO
========================== */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  usuarioAtual = user;
  await salvarUsuario(user);
  carregarUsuarios();
});

/* ==========================
   SALVAR / ATUALIZAR USUÁRIO
========================== */
async function salvarUsuario(user) {
  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      nome: user.displayName || "Usuário",
      email: user.email,
      online: true,
      atualizadoEm: serverTimestamp(),
      // CAMPOS FUTUROS (NÃO REMOVER)
      cidade: "",
      estado: "",
      bio: "",
      amigos: []
    },
    { merge: true }
  );
}

/* ==========================
   CARREGAR LISTA DE USUÁRIOS
========================== */
function carregarUsuarios() {
  const usersRef = collection(db, "users");

  onSnapshot(usersRef, (snapshot) => {
    contatosDiv.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const user = docSnap.data();

      // NÃO mostrar o próprio usuário
      if (user.uid === usuarioAtual.uid) return;

      const div = document.createElement("div");
      div.className = "contato";
      div.innerHTML = `
        <strong>${user.nome}</strong><br>
        <small>${user.email}</small><br>
        <small style="color:${user.online ? "green" : "gray"}">
          ${user.online ? "Online" : "Offline"}
        </small>
      `;

      contatosDiv.appendChild(div);
    });
  });
}

/* ==========================
   LOGOUT
========================== */
btnSair.addEventListener("click", async () => {
  if (usuarioAtual) {
    await setDoc(
      doc(db, "users", usuarioAtual.uid),
      {
        online: false,
        atualizadoEm: serverTimestamp()
      },
      { merge: true }
    );
  }

  await signOut(auth);
  window.location.href = "index.html";
});
