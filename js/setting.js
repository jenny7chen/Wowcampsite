function changePassword() {
  var userId = Cookies.get('user_id');
  if (userId == undefined || userId == null) {
    return;
  }
  var password = $("#form_user_password").val();
  if (password == "") {
    swal("密碼未輸入");
    return;
  }
  realtimeDB.ref('member/' + userId + '/password').set(password, function(error) {
      if (!error) {
        swal("成功更改密碼為" + password + "下次請使用新密碼登入", {
          icon: "success",
        });
        $("#form_user_password").val("");
    } else {
      swal("更改失敗,請再試一次");
    }
  });

}
