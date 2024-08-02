// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { setLogLevel as setFirestoreLogLevel } from "firebase/firestore";
setFirestoreLogLevel('debug');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.APIKEY,
//   authDomain: process.env.AUTHDOMAIN,
//   projectId: process.env.PROJECTID,
//   storageBucket: process.env.STORAGEBUCKET,
//   messagingSenderId: process.env.MESSAGINGSENDERID,
//   appId: process.env.APPID,
//   measurementId: process.env.MEASUREMENTID
// };
const firebaseConfig = {
  apiKey: "AIzaSyCJr-cLr1YYs0WyEp_yJB2mCkjD6wSD9xg",
  authDomain: "inventory-b97a7.firebaseapp.com",
  projectId: "inventory-b97a7",
  storageBucket: "inventory-b97a7.appspot.com",
  messagingSenderId: "596670716391",
  appId: "1:596670716391:web:4ed42147aaa4bf9b654542",
  measurementId: "G-2NR66K67FJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };