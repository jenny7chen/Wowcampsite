$("#chooser_form").hide();

realtimeDB.ref('/raid').once('value').then(function(snapshot) {
  var open = snapshot.child('status').val();
  console.log("raid status = " + open);
  if (open) {
    $("#raid_edit_status").text("裝備填寫中不開放查詢");
    $("#raid_edit_status_hint").text("請不要想偷看^_<*");
  } else {
    $("#raid_edit_status").text("已開放查詢");
    $("#raid_edit_status_hint").text("請選擇副本及團員");
    initRaidChooser(snapshot);
    getMemberData();
  }
});

function initRaidChooser(snapshot) {
  var raids = getRaids(snapshot);
  var raid = document.getElementById('raid_chooser');
  for (var i = -1; i < raids.length; i++) {
    var option = document.createElement("option");
    option.style.color = "black";
    option.style.padding = "10px";
    if (i > -1) {
      option.text = raids[i].child('name').val();
      option.value = raids[i].key;
    } else {
      option.value = "";
      option.text = "請選擇副本";
      option.setAttribute('selected', "selected");
    }
    raid.appendChild(option);
  }
  raid.style.color = "gray";
  raid.style.padding = "10px";
  raid.setAttribute('value', "");
  raid.setAttribute('text', "請選擇副本");
  return raid;
}

function getMemberData() {
  realtimeDB.ref('/member').once('value').then(function(snapshot) {
    var data = [];
    snapshot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
    initMemberChooser(data);
  });
}

function initMemberChooser(data) {
  var user = document.getElementById('user_chooser');
  console.log("user chooser =" + user);
  for (var i = -1; i < data.length; i++) {
    var option = document.createElement("option");
    option.style.color = "black";
    if (i > -1) {
      option.text = data[i].child('nick_name').val();
      option.value = data[i].key;
    } else {
      option.value = "";
      option.text = "請選擇團員";
      option.setAttribute('selected', "selected");
    }
    user.appendChild(option);
  }
  user.style.color = "gray";
  user.style.padding = "10px";
  user.setAttribute('value', "");
  user.setAttribute('text', "請選擇團員");
  $("#chooser_form").show();
}

function chooseUser() {
  var raidId = $("#raid_chooser").val();
  var userId = $("#user_chooser").val();
  if (raidId == "" || userId == "") {
    swal("未選擇副本或團員");
    return;
  }
  realtimeDB.ref('/raid').once('value').then(function(snapshot) {
    var open = snapshot.child('status').val();
    if (!open) {
      fetchRaidData(raidId, userId);
    } else {
      swal("裝備填寫中不開放查詢");
    }
  });
}

function fetchRaidData(raidId, userId) {
  realtimeDB.ref('/gear/' + raidId + '/' + userId).once('value').then(function(snapshot) {
    console.log("拿到使用者raid資料");
    generateForm(raidId, snapshot);
  });
}

function generateForm(raidId, snapshot) {
  var size = 30;
  var container = document.getElementById('user_gear_form_container');
  var range = document.createRange();
  range.selectNodeContents(container);
  range.deleteContents();

  var tbl = document.createElement('table');
  tbl.classList.add('col-md-10');
  tbl.classList.add('col-md-offset-1');
  // tbl.classList.add('text-center');
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  createFormTitle(tbdy);

  var data = [];
  if (snapshot != undefined) {
    snapshot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
  }
  for (var i = 0; i < size; i++) {
    var tr = document.createElement('tr');
    tr.style.color = "black";
    if (data.length > i) {
      createOneRow(i, snapshot.key, raidId, tr, data[i]);
    } else {
      createOneRow(i, snapshot.key, raidId, tr, undefined);
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  container.appendChild(tbl);
  $("#form_submit").show();
}

function createOneRow(index, userId, raidId, tr, snapshot) {
  var bossId = (snapshot == undefined || snapshot == null) ? -1 : snapshot.child("boss").val();
  var partId = (snapshot == undefined || snapshot == null) ? "" : snapshot.child("part").val();
  var note = (snapshot == undefined || snapshot == null) ? "" : snapshot.child("note").val();
  var isLock = (snapshot == undefined || snapshot == null) ? false : snapshot.child("lock").val();
  if (isLock == null) {
    isLock = false;
  }
  if (userId == null) {
    return;
  }
  var td = document.createElement('td');
  var label = document.createElement("label");
  label.appendChild(document.createTextNode((index + 1)));
  label.classList.add('col-md-1');
  td.appendChild(label);
  td.appendChild(createBossElement(raidId, bossId, isLock));
  td.appendChild(createPartElement(raidId, partId, isLock));
  td.appendChild(createNoteElement(note, isLock));
  td.appendChild(createLockElement(isLock));
  if (Cookies.get('user_is_admin')) {
    td.appendChild(createGiveBtn(td, index, userId, raidId, isLock));
  }
  if (isLock) {
    td.style.backgroundColor = "#ff5050";
  } else {
    td.style.backgroundColor = "white";
  }
  tr.appendChild(td)
}

function createBossElement(raidId, bossId, isLock) {
  var div = document.createElement('div');
  var bosses = getBosses(raidId);
  var boss = document.createElement('select');
  for (var i = -1; i < bosses.length; i++) {
    var option = document.createElement("option");
    option.value = i;
    if (i > -1) {
      option.text = bosses[i];
    } else {
      option.text = "";
    }
    if (bossId == i) {
      option.setAttribute('selected', "selected");
    }
    boss.appendChild(option);
  }
  boss.setAttribute('value', bossId);
  boss.setAttribute('disabled', isLock);
  if (bossId == -1) {
    boss.setAttribute('text', "");
  }
  div.appendChild(boss);
  div.classList.add('col-md-3');
  div.classList.add('custom-select');
  return div;
}

function createPartElement(raidId, partId, isLock) {
  var div = document.createElement('div');
  var parts = getParts();
  var part = document.createElement('select');
  for (var i = -1; i < parts.length; i++) {
    var option = document.createElement("option");

    if (i > -1) {
      option.value = parts[i].key;
      option.text = parts[i].val();
      if (partId == parts[i].key) {
        option.setAttribute('selected', "selected");
      }
    } else {
      option.value = "";
      option.text = ""
    }
    part.appendChild(option);
  }
  part.setAttribute('value', partId);
  part.setAttribute('disabled', isLock);
  div.appendChild(part);
  div.classList.add('col-md-3');
  div.classList.add('custom-select');
  return div;
}

function createNoteElement(text, isLock) {
  var note = document.createElement('input');
  note.setAttribute('type', "text");
  note.setAttribute('value', text);
  note.classList.add('col-md-2');
  note.setAttribute('disabled', true);
  if (isLock) {
    note.style.backgroundColor = "#ff5050";
    // note.style.display = 'none';
    note.classList.add('style-2');

  } else {
    note.classList.add('style-1');
    note.style.backgroundColor = "white";
  }
  return note;
}

function createLockElement(isLock) {
  var lock = document.createElement('input');
  lock.setAttribute('type', "hidden");
  lock.setAttribute('value', isLock);
  return lock;
}

function createGiveBtn(td, index, userId, raidId, isLock) {
  var btn = document.createElement("input");
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', isLock ? "收回裝備" : "給裝備");
  btn.classList.add('col-md-2');
  btn.style.height = "50px";
  if (isLock) {
    btn.classList.add('btn-warning');
  } else {
    btn.classList.add('btn-success');
  }
  btn.addEventListener("click", function() {
    giveGear(isLock ? false : true, td, index, userId, raidId, btn);
  });
  return btn;
}

function giveGear(give, td, index, userId, raidId, btn) {
  firebase.database().ref('gear/' + raidId + '/' + userId + '/' + index + '/lock').set(give, function(error) {
    if (!error) {
      btn.setAttribute('value', give ? "收回裝備" : "給裝備")
      btn.classList.remove('btn-warning', 'btn-success');
      if (give) {
        btn.classList.add('btn-warning');
        td.style.backgroundColor = "#ff5050";
      } else {
        btn.classList.add('btn-success');
        td.style.backgroundColor = "white";
      }
      btn.addEventListener("click", function() {
        giveGear(!give, td, index, userId, raidId, btn);
      });
    }
  });
}

function createFormTitle(tbdy) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.style.backgroundColor = "#5a5a5a";
  var bossLabel = createLabel("BOSS");
  bossLabel.classList.add('col-md-3');

  var partLabel = createLabel("部位");
  partLabel.classList.add('col-md-3');

  var noteLabel = createLabel("備註");
  noteLabel.classList.add('col-md-2');

  td.appendChild(bossLabel);
  td.appendChild(partLabel);
  td.appendChild(noteLabel);
  tr.appendChild(td)
  tbdy.appendChild(tr);
}

function createLabel(text) {
  var label = document.createElement("label");
  label.style.color = "#FFFFFF";
  label.classList.add("text-center");
  label.appendChild(document.createTextNode(text));
  return label;
}
