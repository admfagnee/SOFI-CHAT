import { auth, db } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ELEMENTOS */
const contatosDiv = document.getElementById("contatos");
const mensagensDiv = document.getElementById("mensagens");
const inputMensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("enviar");
const buscarInput = document.getElementById("buscarUsuario");
const usuarioSelecionadoSpan = document.getElementById("usuarioSelecionado");
const bioDiv = document.getElementById("bioUsuario");
const btnAmigo = document.getElementById("btnAmigo");
const btnSair = document.getElementById("sair");

let usuarioAtual = null;
let usuarioSelecionado = null;
let usuariosCache = [];
let unsubscribeMensagens = null;

/* ================= AUTH ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  usuarioAtual = user;
  await salvarUsuario(user);
  ouvirUsuarios();
});

/* ================= PERFIL ================= */
async function salvarUsuario(user) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    nome: user.displayName || "Usuário",
    email: user.email,
    bio: "",
    amigos: [],
    online: true,
    atualizadoEm: serverTimestamp()
  }, { merge: true });
}

/* ================= USUÁRIOS ================= */
function ouvirUsuarios() {
  onSnapshot(collection(db, "users"), snap => {
    usuariosCache = [];
    snap.forEach(d => usuariosCache.push(d.data()));
    renderUsuarios(usuariosCache);
  });
}

function renderUsuarios(lista) {
  contatosDiv.innerHTML = "";

  lista.forEach(user => {
    if (user.uid === usuarioAtual.uid) return;

    const div = document.createElement("div");
    div.className = "contato";
    div.innerHTML = `
      <strong>${user.nome}</strong><br>
      <small>${user.online ? "Online" : "Offline"}</small>
    `;

    div.onclick = () => abrirChat(user);
    contatosDiv.appendChild(div);
  });
}

/* ================= BUSCA (1) ================= */
buscarInput.oninput = () => {
  const termo = buscarInput.value.toLowerCase();
  const filtrados = usuariosCache.filter(u =>
    u.nome.toLowerCase().includes(termo)
  );
  renderUsuarios(filtrados);
};

/* ================= CHAT 1x1 (B) ================= */
function abrirChat(user) {
  usuarioSelecionado = user;
  usuarioSelecionadoSpan.textContent = user.nome;
  bioDiv.textContent = user.bio || "Sem bio";
  mensagensDiv.innerHTML = "";

  if (unsubscribeMensagens) unsubscribeMensagens();

  const chatId = gerarChatId(usuarioAtual.uid, user.uid);
  const ref = collection(db, "chats", chatId, "mensagens");

  unsubscribeMensagens = onSnapshot(
    query(ref, orderBy("criadoEm")),
    snap => {
      mensagensDiv.innerHTML = "";
      snap.forEach(d => {
        const m = d.data();

        if (!m.lida && m.uid !== usuarioAtual.uid) {
          updateDoc(d.ref, { lida: true });
        }

        const div = document.createElement("div");
        div.className = m.uid === usuarioAtual.uid ? "msg minha" : "msg";
        div.innerHTML = `${m.texto} <small>${m.lida ? "✔✔" : "✔"}</small>`;
        mensagensDiv.appendChild(div);
      });
      mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
    }
  );
}

/* ================= ENVIAR ================= */
btnEnviar.onclick = async () => {
  if (!usuarioSelecionado || !inputMensagem.value.trim()) return;

  const chatId = gerarChatId(usuarioAtual.uid, usuarioSelecionado.uid);

  await addDoc(collection(db, "chats", chatId, "mensagens"), {
    uid: usuarioAtual.uid,
    texto: inputMensagem.value,
    criadoEm: serverTimestamp(),
    lida: false
  });

  inputMensagem.value = "";
};

function gerarChatId(a, b) {
  return [a, b].sort().join("_");
}

/* ================= AMIZADE (2) ================= */
btnAmigo.onclick = async () => {
  if (!usuarioSelecionado) return;

  const ref = doc(db, "users", usuarioAtual.uid);
  await updateDoc(ref, {
    amigos: [...new Set([...(usuarioAtual.amigos || []), usuarioSelecionado.uid])]
  });

  alert("Amigo adicionado");
};

/* ================= LOGOUT ================= */
btnSair.onclick = async () => {
  await setDoc(doc(db, "users", usuarioAtual.uid), {
    online: false
  }, { merge: true });

  await signOut(auth);
  location.href = "index.html";
};
