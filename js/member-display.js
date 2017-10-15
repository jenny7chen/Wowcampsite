// firestoreDB.collection("member").orderBy("career").get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     console.log(`${doc.id} => 暱稱是 ${doc.get("nick_name")}, 是否為管理員 ${doc.get("is_admin")}`);
//   });
//   tableCreate(querySnapshot);
// });
$("#add_member_form").hide();
initAddMemberCareer();
showMember();

function showMember() {
  realtimeDB.ref('/member').once('value').then(function(snapshot) {
    var data = [];
    snapshot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
    tableCreate(data);
    if (Cookies.get('user_is_admin') == "true") {
      $("#add_member_form").show();
    }
  });
}

function tableCreate(data) {
  var size = data.length;
  var container = document.getElementById('member_list');
  var range = document.createRange();
  range.selectNodeContents(container);
  range.deleteContents();
  var tbl = document.createElement('table');
  tbl.classList.add('col-md-7');
  tbl.classList.add('col-md-offset-2');
  // tbl.classList.add('text-center');
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  for (var i = 0; i < size; i++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.style.backgroundColor = getCareerColor(data[i].child("career").val());
    tr.style.color = "black";
    var isAdmin = data[i].child("is_admin").val();
    var label = createLabel(data[i].child("nick_name").val() + '\u0020');
    var userId = data[i].key;
    label.classList.add("col-md-3");
    td.appendChild(label);
    if (Cookies.get("user_is_admin") == "true") {
      label.classList.add('col-md-offset-2');
      td.appendChild(createAdminBtn(userId, isAdmin));
      td.appendChild(createDeleteBtn(tr, userId));
    } else {
      label.classList.add('col-md-offset-4');
    }
    tr.appendChild(td)
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  container.appendChild(tbl);
}

function createLabel(text) {
  var label = document.createElement("label");
  label.classList.add("text-center");
  label.appendChild(document.createTextNode(text));
  return label;
}

function createAdminBtn(userId, isAdmin) {
  var btn = document.createElement("input");
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', isAdmin ? "取消管理員" : "設為管理員");
  btn.setAttribute('name', isAdmin);
  btn.classList.add('col-md-2');
  btn.classList.add('col-md-offset-2');
  btn.classList.add('btn-success');
  btn.addEventListener("click", function() {
    setAdmin(userId, !isAdmin, btn);
  });
  return btn;
}

function setAdmin(userId, admin, btn) {
  firebase.database().ref('member/' + userId + '/is_admin').set(admin, function(error) {
    if (!error) {
      btn.setAttribute('value', admin ? "取消管理員" : "設為管理員")
      btn.addEventListener("click", function() {
        setAdmin(userId, !admin, btn);
      });
    }
  });
}

function createDeleteBtn(tr, userId) {
  var btn = document.createElement("input");
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', "刪除");
  btn.setAttribute('name', userId);
  btn.classList.add('col-md-2');
  btn.classList.add('btn-danger');
  btn.addEventListener("click", function() {
    showConfirmDialog(tr, userId, btn);
  });
  return btn;
}

function showConfirmDialog(tr, userId, btn) {
  swal({
      title: "確定刪除嗎?",
      text: "如果刪除將會清除此使用者的所有資料",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        deleteMember(tr, userId, btn);
      }
    });
}

function deleteMember(tr, userId, btn) {
  realtimeDB.ref('/raid/raids').once('value').then(function(snapshot) {
    var data = [];
    snapshot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });

    var updates = {};
    updates['/member/' + userId] = null;
    for (var i = 0; i < data.length; i++) {
      updates['/gear/' + data[i].key + '/' + userId] = null;
      updates['/score/' + data[i].key + '/' + userId] = null;
    }
    firebase.database().ref().update(updates, function(error) {
      if (!error) {
        swal("成功刪除", {
          icon: "success",
        });
        tr.parentNode.removeChild(tr);
      } else {
        swal("刪除失敗");
      }
    });
  });
}

function initAddMemberCareer() {
  var data = getAllCareer();
  var career = document.getElementById('add_member_user_career');
  for (var i = -1; i < data.length; i++) {
    var option = document.createElement("option");
    option.style.color = "black";
    if (i > -1) {
      option.text = data[i].careerName;
      option.value = data[i].careerId;
    } else {
      option.value = -1;
      option.text = "請選擇新團員職業";
      option.setAttribute('selected', "selected");
    }
    career.appendChild(option);
  }
  career.style.color = "gray";
  career.setAttribute('value', -1);
  career.setAttribute('text', "請選擇新團員職業");
  return career;
}

function addMember() {
  var userId = $("#add_member_user_id").val();
  var userName = $("#add_member_user_name").val();
  var userCareer = parseInt($("#add_member_user_career").val());
  if (userId == "" || userName == "" || userCareer == -1) {
    swal("帳號或暱稱或職業未輸入");
    return;
  }
  realtimeDB.ref('/member/' + userId).once('value').then(function(snapshot) {
    console.log("correct password = " + snapshot.child('password').val());
    if (snapshot.exists()) {
      swal("此帳號 " + userId + " 已存在, 擁有者是 " + snapshot.child("nick_name").val());
    } else {
      var data = {
        password: "000",
        is_admin: false,
        nick_name: userName,
        career: userCareer
      };
      firebase.database().ref('member/' + userId).set(data, function(error) {
        if (error) {
          console.log("新增成員失敗");
          swal("新增失敗,請再試一次");
        } else {
          swal("新增團員帳號:" + userId + " 暱稱:" + userName + " 成功!預設密碼為 000", {
            icon: "success",
          });
          $("#add_member_user_id").val("");
          $("#add_member_user_name").val("");
          $("#add_member_user_career").val(-1);
          showMember();
        }
      });
    }
  });
}

function createTitle(tbdy) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.style.backgroundColor = "black";
  td.appendChild(document.createTextNode('暱稱\u0020'))
  tr.appendChild(td)
  tbdy.appendChild(tr);
}
