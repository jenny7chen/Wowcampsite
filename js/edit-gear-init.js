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
  // var userId = Cookies.get("user_id");
  var userId = "starfalling";
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
  snapshot.forEach(function(childSnapshot) {
    data.push(childSnapshot);
  });

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
}

function createOneRow(index, raidId, tr, snapshot) {
  var bossId = snapshot == undefined ? 0 : snapshot.child("boss").val();
  var partId = snapshot == undefined ? 0 : snapshot.child("part").val();
  var note = snapshot == undefined ? "" : snapshot.child("note").val();
  var td = document.createElement('td');
  var label = document.createElement("label");
  label.appendChild(document.createTextNode((index + 1)));
  label.classList.add('col-md-1');
  td.appendChild(label);
  td.appendChild(createBossElement(raidId, bossId));
  td.appendChild(createPartElement(raidId, bossId));
  td.appendChild(createNoteElement(note));
  tr.appendChild(td)
}

function createBossElement(raidId, bossId) {
  var div = document.createElement('div');
  var bosses = getBosses(raidId);
  var boss = document.createElement('select');
  for (var i = 0; i < bosses.length; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = bosses[i];
    if (bossId == i) {
      option.setAttribute('selected', "selected");
    }
    boss.appendChild(option);
  }
  boss.setAttribute('value', bossId);
  div.appendChild(boss);
  div.classList.add('col-md-3');
  div.classList.add('custom-select');
  return div;
}

function createPartElement(raidId, partId) {
  var div = document.createElement('div');
  var parts = getParts();
  var part = document.createElement('select');
  for (var i = 0; i < parts.length; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = parts[i].val();
    if (partId == i) {
      option.setAttribute('selected', "selected");
    }
    part.appendChild(option);
  }
  part.setAttribute('value', partId);
  div.appendChild(part);
  div.classList.add('col-md-3');
  div.classList.add('custom-select');
  return div;
}

function createNoteElement(text) {
  var note = document.createElement('input');
  note.setAttribute('type', "text");
  note.setAttribute('value', text);
  note.classList.add('col-md-3');
  note.classList.add('style-1');
  return note;
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

function saveGear() {

}
