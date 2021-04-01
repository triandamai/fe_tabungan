import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/storage";
import { ICurrentUser } from "./Type";
import service from "./Services";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBOo-s1-i_BcxU4EobnITuFW92wUVxWt2Q",
  authDomain: "myproject-64aac.firebaseapp.com",
  databaseURL: "https://myproject-64aac.firebaseio.com",
  projectId: "myproject-64aac",
  storageBucket: "myproject-64aac.appspot.com",
  messagingSenderId: "264573731963",
  appId: "1:264573731963:web:d7eca828e5b38b71be4ede",
  measurementId: "G-VFLQLMSC1P",
});
firebaseApp.analytics();

const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
function getCurrentUser(): Promise<ICurrentUser> {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (!user)
        return resolve({
          uid: service.getUser().uid,
          name: service.getUser().name,
          email: service.getUser().email,
        });
      return resolve({
        uid: user?.uid,
        email: user?.email,
        name: user?.displayName,
      });
    }, reject);
  });
}

function uploadReceipt(body: { file: any; filename: string }) {
  return new Promise((resolve, reject) => {
    var ref = storage.ref("TABUNGAN");
    var uploadTask = ref.child(body.filename).put(body.file);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject();
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
          resolve(downloadUrl);
        });
      }
    );
  });
}

export { auth, getCurrentUser, uploadReceipt };
