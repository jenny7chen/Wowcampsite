// firestoreDB.collection("raid").doc("status").get().then(function(doc) {
//   var open = doc.get("open");
//
//   if (open) {
//     $("#raid_edit_status").text("開放填寫中");
//   } else {
//     $("#raid_edit_status").text("關閉填寫中");
//   }
// }).catch(function(error) {
//   console.log("Error getting document:", error);
// });

$("#choose_raid_button").hide();
$("#form_submit").hide();
$("#form_save_hint").hide();
realtimeDB.ref('/raid').once('value').then(function(snapshot) {
  var open = snapshot.child('status').val();
  console.log("raid status = " + open);
  if (open) {
    $("#raid_edit_status").text("開放填寫中");
    $("#raid_edit_status_hint").text("請往下選擇副本開始填寫");
    setRaidChooser(snapshot);
  } else {
    $("#raid_edit_status").text("關閉填寫中");
    $("#raid_edit_status_hint").text("打團中不能填裝備了喔!!");
  }
});

function setRaidChooser(snapshot) {
  var raidName = [];
  var raidId = [];
  snapshot.child('raids').forEach(function(childSnapshot) {
    raidId.push(childSnapshot.key);
    raidName.push(childSnapshot.child('name').val());
  });
  console.log("all raid = " + raidName);
  var container = document.getElementById('raid_chooser_radio_group');
  for (var i = 0; i < raidName.length; i++) {
    var label = document.createElement("label");
    var radio = document.createElement('input');
    radio.setAttribute('type', "radio");
    radio.setAttribute('name', "raid");
    radio.setAttribute('value', raidId[i]);
    if (i == 0) {
      radio.setAttribute('checked', "checked");
    }
    label.appendChild(radio);
    label.appendChild(document.createTextNode(raidName[i]));
    container.appendChild(label);
  }
  if (container.childNodes.length > 0) {
    $("#choose_raid_button").show();
  }
}

function chooseRaid() {
  var radios = document.getElementById('raid_chooser_radio_group');

  for (var i = 0, length = radios.childNodes.length; i < length; i++) {
    var label = radios.children[i];
    if (label.children[0].checked) {
      console.log("現在選擇的副本" + label.children[0].value);
      fetchRaidData(label.children[0].value);
      break;
    }
  }
}

function fetchRaidData(raidId) {
  var userId = Cookies.get("user_id");
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
      createOneRow(i, raidId, tr, data[i]);
    } else {
      createOneRow(i, raidId, tr, undefined);
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  container.appendChild(tbl);
  $("#form_submit").show();
  $("#form_save_hint").show();
}

function createOneRow(index, raidId, tr, snapshot) {
  var bossId = (snapshot == undefined || snapshot == null) ? -1 : snapshot.child("boss").val();
  var partId = (snapshot == undefined || snapshot == null) ? "" : snapshot.child("part").val();
  var note = (snapshot == undefined || snapshot == null) ? "" : snapshot.child("note").val();
  var isLock = (snapshot == undefined || snapshot == null) ? false : snapshot.child("lock").val();
  if (isLock == null) {
    isLock = false;
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
      option.text = "請選擇boss";
    }
    if (bossId == i) {
      option.setAttribute('selected', "selected");
    }
    boss.appendChild(option);
  }
  boss.setAttribute('value', bossId);
  if (isLock) {
    boss.setAttribute('disabled', isLock);
  }
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
      option.text = "請選擇部位"
    }
    part.appendChild(option);
  }
  part.setAttribute('value', partId);
  if (isLock) {
    part.setAttribute('disabled', isLock);
  }
  div.appendChild(part);
  div.classList.add('col-md-3');
  div.classList.add('custom-select');
  return div;
}

function createNoteElement(text, isLock) {
  var note = document.createElement('input');
  note.setAttribute('type', "text");
  note.setAttribute('value', text);
  note.classList.add('col-md-3');
  if (isLock) {
    note.style.backgroundColor = "#ff5050";
    note.style.display = 'none';
    note.classList.add('style-2');
    note.setAttribute('disabled', isLock);

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

function createFormTitle(tbdy) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.style.backgroundColor = "#5a5a5a";
  var bossLabel = createLabel("BOSS");
  bossLabel.classList.add('col-md-3');

  var partLabel = createLabel("部位");
  partLabel.classList.add('col-md-3');

  var noteLabel = createLabel("備註");
  noteLabel.classList.add('col-md-3');

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
