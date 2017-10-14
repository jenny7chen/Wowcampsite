var nickName = Cookies.get('user_nick_name');
$("#welcome_name").text("歡迎回來! " + nickName);


var firestoreDB = firebase.firestore();
firestoreDB.collection("raid").doc("status").get().then(function(doc) {
  var open = doc.get("open");

  if (open) {
    $("#welcome_btn").text("填寫裝備");
    $("#welcome_btn").attr("href", "editGear.html");
  } else {
    $("#welcome_btn").text("觀看總填寫結果");
    $("#welcome_btn").attr("href", "gear_display.html");
  }

}).catch(function(error) {
  console.log("Error getting document:", error);
});
