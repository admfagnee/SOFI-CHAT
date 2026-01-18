// ===============================
// Firebase imports (v9+)
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  addDoc,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===============================
// Firebase config (SEU PROJETO)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyDwsERnH6Obpzc6Klt9r7IxDXWOkiaYSHU",
  authDomain: "sofi-chat.firebaseapp.com",
  projectId: "sofi-chat",
  storageBucket: "sofi-chat.firebasestorage.app",
  messagingSenderId: "533851013944",
  appId: "1:533851013944:web:a49900cdde03ba01dd37cd"
};

// ===============================
// Init Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// DOM
// ===============================
const contactList = document.getElementById("contactList");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let selectedUser = null;
let unsubscribeMessages = null;

// ===============================
// AUTH STATE
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  // 🔹 SEMPRE salvar/atualizar usuário
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: user.displayName || "Usuário",
      email: user.email || "",
      online: true,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  carregarUsuarios();
});

// ===============================
// LOGOUT
// ===============================
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// ===============================
// CARREGAR USUÁRIOS (CONTATOS)
// ===============================
function carregarUsuarios() {
  const q = query(collection(db, "users"));

  onSnapshot(q, (snapshot) => {
    contactList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const user = docSnap.data();

      // ❌ Não listar você mesmo
      if (user.uid === currentUser.uid) return;

      const li = document.createElement("li");
      li.textContent = user.name;
      li.style.cursor = "pointer";

      li.onclick = () => abrirChat(user);

      contactList.appendChild(li);
    });
  });
}

// ===============================
// ABRIR CHAT 1x1
// ===============================
function abrirChat(user) {
  selectedUser = user;
  messagesDiv.innerHTML = "";

  if (unsubscribeMessages) unsubscribeMessages();

  const chatId = gerarChatId(currentUser.uid, user.uid);

  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("createdAt")
  );

  unsubscribeMessages = onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const msg = docSnap.data();
      const div = document.createElement("div");

      div.textContent = msg.text;
      div.style.margin = "5px 0";
      div.style.padding = "8px";
      div.style.borderRadius = "6px";
      div.style.maxWidth = "70%";

      if (msg.from === currentUser.uid) {
        div.style.background = "#d1f7c4";
        div.style.marginLeft = "auto";
      } else {
        div.style.background = "#f1f1f1";
        div.style.marginRight = "auto";
      }

      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
  });
}

// ===============================
// ENVIAR MENSAGEM
// ===============================
sendBtn.addEventListener("click", enviarMensagem);

function enviarMensagem() {
  if (!selectedUser) {
    alert("Selecione um usuário");
    return;
  }

  const text = messageInput.value.trim();
  if (!text) return;

  const chatId = gerarChatId(currentUser.uid, selectedUser.uid);

  addDoc(collection(db, "messages"), {
    chatId,
    from: currentUser.uid,
    to: selectedUser.uid,
    text,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
}

// ===============================
// GERAR CHAT ID ÚNICO
// ===============================
function gerarChatId(uid1, uid2) {
  return uid1 < uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
  }
