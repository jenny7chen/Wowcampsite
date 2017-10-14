firestoreDB.collection("raid").doc("status").get().then(function(doc) {
  var open = doc.get("open");

  if (open) {
    $("#raid_edit_status").text("開放填寫中");
  } else {
    $("#raid_edit_status").text("關閉填寫中");
  }
}).catch(function(error) {
  console.log("Error getting document:", error);
});
