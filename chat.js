<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

/* CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyDwsERnH6Obpzc6Klt9r7IxDXWOkiaYSHU",
  authDomain: "sofi-chat.firebaseapp.com",
  projectId: "sofi-chat",
  storageBucket: "sofi-chat.firebasestorage.app",
  messagingSenderId: "533851013944",
  appId: "1:533851013944:web:a49900cdde03ba01dd37cd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let currentChatId = null;

/* USUÁRIO LOGADO */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  currentUser = user;

  // salva usuário no banco (se não existir)
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    lastOnline: serverTimestamp()
  }, { merge: true });

  loadUsers();
});

/* LISTA DE USUÁRIOS */
async function loadUsers() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const list = document.getElementById("usersList");
  list.innerHTML = "";

  snapshot.forEach(docu => {
    const user = docu.data();
    if (user.uid === currentUser.uid) return;

    const item = document.createElement("div");
    item.className = "user-item";
    item.innerText = user.name;
    item.onclick = () => openChat(user.uid);
    list.appendChild(item);
  });
}

/* GERAR ID DO CHAT 1x1 */
function getChatId(uid1, uid2) {
  return uid1 < uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
}

/* ABRIR CHAT */
function openChat(otherUid) {
  currentChatId = getChatId(currentUser.uid, otherUid);
  listenMessages();
}

/* ENVIAR MENSAGEM */
window.sendMessage = async () => {
  const input = document.getElementById("messageInput");
  if (!input.value || !currentChatId) return;

  await addDoc(collection(db, "chats", currentChatId, "messages"), {
    from: currentUser.uid,
    text: input.value,
    createdAt: serverTimestamp()
  });

  input.value = "";
};

/* OUVIR MENSAGENS */
function listenMessages() {
  const q = query(
    collection(db, "chats", currentChatId, "messages"),
    orderBy("createdAt")
  );

  onSnapshot(q, (snapshot) => {
    const area = document.getElementById("messages");
    area.innerHTML = "";

    snapshot.forEach(docu => {
      const msg = docu.data();
      const div = document.createElement("div");
      div.className = msg.from === currentUser.uid ? "msg me" : "msg";
      div.innerText = msg.text;
      area.appendChild(div);
    });

    area.scrollTop = area.scrollHeight;
  });
}
</script>