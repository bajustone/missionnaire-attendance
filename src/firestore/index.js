import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
var firebaseConfig = {
    apiKey: "AIzaSyCXT4CJM-UDp8xUHLZIkAalVG2PPvY5E40",
    authDomain: "missionnaire-a40da.firebaseapp.com",
    databaseURL: "https://missionnaire-a40da.firebaseio.com",
    projectId: "missionnaire-a40da",
    storageBucket: "missionnaire-a40da.appspot.com",
    messagingSenderId: "888753924521",
    appId: "1:888753924521:web:b6f7bfbe6abddd4ed27cb8",
    measurementId: "G-JWW7ZMJG5N"
  };
  // Initialize Firebase
  const FireApp = firebase.initializeApp(firebaseConfig);
  const AppDB = FireApp.firestore();
  export {AppDB, FireApp};