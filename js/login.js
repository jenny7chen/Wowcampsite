var cookieUserId = Cookies.get("user_id");
var cookieNickName = Cookies.get("user_nick_name");
var cookieIsAdmin = Cookies.get("user_is_admin");
if (cookieUserId != undefined) {
  Cookies.remove("user_id");
  Cookies.remove("user_nick_name");
  Cookies.remove("user_is_admin");
  console.log("cookie存在 移除cookie");
}
console.log("login.js執行");

function login() {
  console.log("check login");
  $("#form_hint_text").text("");
  var userId = $("#form_user_id").val();
  var password = $("#form_user_password").val();

  if (userId == "" || password == "") {
    $("#form_hint_text").text("帳號或密碼未輸入");

  } else {
    console.log("start get data");
    console.log("user is = " + userId + " password is = " + password + ", start login");
    loginWithRealtimeDB(userId, password);
  }
}

function loginWithRealtimeDB(userId, password) {
  realtimeDB.ref('/member/' + userId).once('value').then(function(snapshot) {
    console.log("correct password = " + snapshot.child('password').val());
    if (!snapshot.exists()) {
      $("#form_hint_text").text("此帳號不存在");

    } else if (snapshot.child('password').val() != password) {
      $("#form_hint_text").text("密碼錯誤");

    } else {
      console.log("login success, set cookie");
      Cookies.set('user_id', userId);
      Cookies.set('user_nick_name', snapshot.child('nick_name').val());
      Cookies.set('user_is_admin', ("" + snapshot.child('is_admin').val()));

      console.log("successully set cookie, submit form");
      $("#form").submit();
    }
  });
}

function checkLogin() {
  login();
};
