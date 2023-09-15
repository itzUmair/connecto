import { initializeApp } from "firebase/app";
import { getStorage, ref, StorageReference } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvCVdOHzivDyzvhHPWsPQ1cT0Lcc3zyMI",
  authDomain: "connecto-983b7.firebaseapp.com",
  projectId: "connecto-983b7",
  storageBucket: "connecto-983b7.appspot.com",
  messagingSenderId: "393313912908",
  appId: "1:393313912908:web:463982a72b611dd06fcce9",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const storageRef: StorageReference = ref(storage);
