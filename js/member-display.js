// firestoreDB.collection("member").orderBy("career").get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     console.log(`${doc.id} => 暱稱是 ${doc.get("nick_name")}, 是否為管理員 ${doc.get("is_admin")}`);
//   });
//   tableCreate(querySnapshot);
// });

realtimeDB.ref('/member').once('value').then(function(snapshot) {
  var data = [];
  snapshot.forEach(function(childSnapshot) {
    data.push(childSnapshot);
  });
  tableCreate(data);
});

function tableCreate(data) {
  var size = data.length;
  var container = document.getElementById('member_list');
  var range = document.createRange();
  range.selectNodeContents(container);
  range.deleteContents();
  var tbl = document.createElement('table');
  tbl.classList.add('col-md-7');
  tbl.classList.add('col-md-offset-2');
  tbl.classList.add('text-center');
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
      label.classList.add('col-md-offset-3');
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

function createTitle(tbdy) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.style.backgroundColor = "black";
  td.appendChild(document.createTextNode('暱稱\u0020'))
  tr.appendChild(td)
  tbdy.appendChild(tr);
}
