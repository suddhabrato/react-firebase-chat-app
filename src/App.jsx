import React, { useState, useRef } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect } from "react";

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
    <div className="bg-white h-[100vh] dark:bg-gray-700 overflow-auto mx-auto">
      <div className="my-[2.5vh] w-full md:w-2/3 mx-auto bg-white dark:bg-gray-900 rounded-lg">
        <section className="flex flex-col items-center justify-center px-6 mx-auto">
          <header className="flex w-full mx-8 pt-2 justify-center items-center">
            <h1 className="text-3xl text-white">⚛️🔥💬 React Chat Room App</h1>
            <div className="ml-auto">
              <SignOut />
            </div>
          </header>
          <div className="border-b dark:border-gray-600 m-4"></div>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </div>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <div className="flex items-center h-[80vh]">
      <button
        type="button"
        onClick={signInWithGoogle}
        className="flex items-center justify-center px-6 py-3 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <svg className="w-6 h-6 mx-2" viewBox="0 0 40 40">
          <path
            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
            fill="#FFC107"
          />
          <path
            d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
            fill="#FF3D00"
          />
          <path
            d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
            fill="#4CAF50"
          />
          <path
            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
            fill="#1976D2"
          />
        </svg>

        <span className="mx-2">Sign in with Google</span>
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button
        className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
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
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt");
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
    dummy.current && dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dummy.current && dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [query]);

  return (
    <div className="flex flex-col h-[80vh] w-full">
      <main className="flex flex-col overflow-auto">
        {messages &&
          messages.map((message, ind) => (
            <ChatMessage key={ind} {...message} />
          ))}
        <span ref={dummy}></span>
      </main>
      <form
        onSubmit={sendMessage}
        className="flex w-full my-8 space-x-3 justify-center"
      >
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
          className="px-4 py-2 w-full text-gray-700 bg-white border rounded-3xl sm:mx-2 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
          placeholder="Say something nice!"
        />

        <button
          className="px-4 py-2 text-md font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-full sm:mx-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          type="submit"
          disabled={!formValue}
        >
          Send
        </button>
      </form>
    </div>
  );
}

function ChatMessage({ text, uid, photoURL }) {
  const messageClass = uid === auth.currentUser.uid ? 1 : 0;

  return (
    <>
      {messageClass ? (
        <div className="flex self-end justify-end m-2 w-full max-w-sm bg-white rounded-3xl shadow-md dark:bg-gray-800">
          <div className="flex flex-row-reverse items-center px-4 py-3">
            <img
              className="object-cover w-10 h-10 rounded-full self-start"
              alt="User avatar"
              src={
                photoURL ||
                "https://api.adorable.io/avatars/23/abott@adorable.png"
              }
            />

            <div className="mx-3">
              <p className="text-gray-600 dark:text-gray-200 break-words">
                {text}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex m-2 min-w-auto max-w-sm bg-white rounded-3xl shadow-md dark:bg-gray-800">
          <div className="flex items-center px-4 py-3">
            <img
              className="object-cover w-10 h-10 rounded-full self-start"
              alt="User avatar"
              src={
                photoURL ||
                "https://api.adorable.io/avatars/23/abott@adorable.png"
              }
            />

            <div className="mx-3">
              <p className="text-gray-600 dark:text-gray-200 break-words">
                {text}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
