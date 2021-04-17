import firebase from "firebase/app"; //firebase
import "firebase/auth"; //firebase/auth
import "firebase/firestore"; //firestore
import "firebase/storage"; //storage
import "firebase/functions"; //functions
import { firebaseConfig } from "./config"; //firebaseConfig

//firebaseConfigの設定を元に初期化
firebase.initializeApp(firebaseConfig);

//authenticationを参照
export const auth = firebase.auth();

//firestoreを参照
export const db = firebase.firestore();

//storageの参照
export const storage = firebase.storage();

//functionsの参照
export const functions = firebase.functions();

//サーバーからTimestampを参照
export const FirebaseTimestamp = firebase.firestore.Timestamp;
