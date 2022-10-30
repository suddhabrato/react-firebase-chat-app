import React, { useState } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAtiI9BhSUZ0G7Fxj_FM9tTxFTtWPGeWNg",
  authDomain: "react-firebase-chat-app-cec2f.firebaseapp.com",
  projectId: "react-firebase-chat-app-cec2f",
  storageBucket: "react-firebase-chat-app-cec2f.appspot.com",
  messagingSenderId: "869386870229",
  appId: "1:869386870229:web:8d3ddc7e1195f7cf46b15c",
  measurementId: "G-Y8NHHHC5YE",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
  };

  return (
    <div>
      <div>
        {messages &&
          messages.map((message, ind) => (
            <ChatMessage key={ind} {...message} />
          ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function ChatMessage({ text, uid, photoURL }) {
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}

export default App;
