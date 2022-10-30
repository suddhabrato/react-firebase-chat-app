import React from "react";
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
  return <div className="App"></div>;
}

export default App;
