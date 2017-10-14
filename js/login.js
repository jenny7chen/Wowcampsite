var checkLogin = function() {
  $("#form_hint_text").text("");
  var userId = $("#form_user_id").val();
  var password = $("#form_user_password").val();

  if (userId == "" || password == "") {
    $("#form_hint_text").text("帳號或密碼未輸入");
    return;
  }

  db.collection("member").doc(userId).get().then(function(doc) {
    console.log(userId + "是否存在" + doc.exists);

    if (!doc.exists) {
      $("#form_hint_text").text("此帳號不存在");
      return;
    }

    if (doc.get("password") != password) {
      $("#form_hint_text").text("密碼錯誤");
      return;
    }

    //set cookie here
    Cookies.set('user_id', userId);
    Cookies.set('user_nick_name', doc.get("nick_name"));
    Cookies.set('user_is_admin', ("" + doc.get("is_admin")));

    $("#form").submit();

  }).catch(function(error) {
    console.log("Error getting document:", error);
    $("#form_hint_text").text("發生錯誤，請重新再試");
  });
};
