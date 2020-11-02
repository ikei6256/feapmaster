// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
// var firebase = require("firebase/app");
import firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
// require("firebase/auth");
//require("firebase/firestore");

/*** prac-firebase-ea8f1の設定 ***/
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// var firebaseConfig = {
//   apiKey: "AIzaSyC4XzCEqiT5QB6EAo2KHWbHKt1On0sWE4Y",
//   authDomain: "prac-firebase-ea8f1.firebaseapp.com",
//   databaseURL: "https://prac-firebase-ea8f1.firebaseio.com",
//   projectId: "prac-firebase-ea8f1",
//   storageBucket: "prac-firebase-ea8f1.appspot.com",
//   messagingSenderId: "156621497361",
//   appId: "1:156621497361:web:9e0b615afd270f01fafdb0",
//   measurementId: "G-EB871GSMXK"
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();

/*** FEAPMaster(feapmaster-5b5ad)の設定 ***/
var firebaseConfig = {
  apiKey: "AIzaSyApuVwrZDXa8YNqrDnB-uytnKcrT1v7yQA",
  authDomain: "feapmaster-5b5ad.firebaseapp.com",
  databaseURL: "https://feapmaster-5b5ad.firebaseio.com",
  projectId: "feapmaster-5b5ad",
  storageBucket: "feapmaster-5b5ad.appspot.com",
  messagingSenderId: "1089919960597",
  appId: "1:1089919960597:web:973cb76fa3bddf5d49f01c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
