var config = {
  apiKey: "AIzaSyAD_QHKI0Ntie6jMBYYWyM5AYlRSdAJ-Yg",
  authDomain: "wowcamp-f8591.firebaseapp.com",
  databaseURL: "https://wowcamp-f8591.firebaseio.com",
  projectId: "wowcamp-f8591",
  storageBucket: "wowcamp-f8591.appspot.com",
  messagingSenderId: "934378512281"
};

firebase.initializeApp(config);
console.log("finish initializeApp");

var db = firebase.firestore();

db.collection("member").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => 暱稱是 ${doc.get("nick_name")}, 是否為管理員 ${doc.get("is_admin")}`);
  });
});
