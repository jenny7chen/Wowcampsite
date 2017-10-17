$("#sf-menu-raid").hide();
$("#sf-menu-dispatch").hide();

console.log("cookie value = " + Cookies.get('user_id'));
console.log("cookie = " + Cookies.get());
var userId = Cookies.get('user_id');
if(userId == undefined || userId == null){
  location.replace("index.html");
}
var isAdmin = (Cookies.get('user_is_admin') == "true");

console.log(isAdmin);

if (isAdmin) {
  console.log("is admin, show menu");
  $("#sf-menu-raid").show();
  $("#sf-menu-dispatch").show();
}
