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

var firestoreDB = firebase.firestore();

firestoreDB.collection("member").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => 暱稱是 ${doc.get("nick_name")}, 是否為管理員 ${doc.get("is_admin")}`);
  });
});

var realtimeDB = firebase.database();
realtimeDB.ref('/member/starfalling').once('value').then(function(snapshot) {
  var testnickname = snapshot.child('nick_name').val();
  console.log("user name = " + testnickname);
  console.log("user is_admin = " + snapshot.child('is_admin').val());
  console.log("Cookie value admin = " + Cookies.get('user_is_admin'));
});
