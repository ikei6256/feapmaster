// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';

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
firebase.initializeApp(firebaseConfig); // Initialize Firebase

export default firebase;
