var members = [];
$("#form_submit").hide();
$("#choose_raid_button").hide();
realtimeDB.ref('/raid').once('value').then(function(snapshot) {
  realtimeDB.ref('/member').once('value').then(function(memberSnapShot) {
    memberSnapShot.forEach(function(childSnapshot) {
      members.push(childSnapshot);
    });
    setRaidChooser(snapshot, members);
  });
});

function setRaidChooser(snapshot, members) {
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
  realtimeDB.ref('/score/' + raidId).once('value').then(function(snapshot) {
    generateForm(raidId, snapshot);
  });
}

function generateForm(raidId, snapshot) {
  var container = document.getElementById('form_container');
  var range = document.createRange();
  range.selectNodeContents(container);
  range.deleteContents();

  var data = [];
  if (snapshot != undefined && snapshot != null) {
    snapshot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
  }

  var tbl = document.createElement('table');
  tbl.classList.add('col-md-6');
  tbl.classList.add('col-md-offset-3');
  // tbl.classList.add('text-center');
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  createFormTitle(tbdy);

  for (var i = 0; i < members.length; i++) {
    var tr = document.createElement('tr');
    tr.style.color = "black";
    var hasData = false;
    for (var j = 0; j < data.length; j++) {
      if (data[j].key == members[i].key) {
        createOneRow(tr, members[i], data[j]);
        hasData = true;
        break;
      }
    }
    if (!hasData) {
      createOneRow(tr, members[i], undefined);
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  container.appendChild(tbl);
  if (Cookies.get('user_is_admin') == "true") {
    $("#form_submit").show();
  }
}

function createOneRow(tr, memberSnapShot, rowData) {
  var td = document.createElement('td');
  td.appendChild(createTextElement(memberSnapShot.child('nick_name').val(), true));
  var scoreInput;
  var isAdmin = Cookies.get('user_is_admin') == "true";
  if (rowData != undefined) {
    scoreInput = createTextElement(rowData.val(), !isAdmin);
  } else {
    scoreInput = createTextElement(0, !isAdmin)
  }
  td.appendChild(scoreInput);
  td.appendChild(createIdElement(memberSnapShot.key));
  tr.appendChild(td)
}

function fetchTableData() {
  var container = document.getElementById('form_container');
  var tbdy = container.children[0].children[0];
  var data = [];
  for (var i = 1; i < tbdy.childElementCount; i++) {
    var score = parseInt(tbdy.children[i].children[0].children[1].value);
    var id = tbdy.children[i].children[0].children[2].value;
    var rowData = {
      userId: id,
      score: score,
    };
    console.log('id = ' + id + "score" + score);
    data.push(rowData);
  }
  return data;
}

function saveScore() {
  var data = fetchTableData();
  var raidId;
  var radios = document.getElementById('raid_chooser_radio_group');

  for (var i = 0, length = radios.childNodes.length; i < length; i++) {
    var label = radios.children[i];
    if (label.children[0].checked) {
      raidId = label.children[0].value;
      break;
    }
  }
  var updates = {};
  for (var i = 0; i < data.length; i++) {
    updates['/score/' + raidId + '/' + data[i].userId] = data[i].score;
  }
  firebase.database().ref().update(updates, function(error) {
    if (!error) {
      swal("成功儲存", {
        icon: "success",
      });
    } else {
      swal("儲存失敗,請再試一次");
    }
  });
}

function createTextElement(text, disabled) {
  var note = document.createElement('input');
  note.setAttribute('type', "text");
  note.setAttribute('value', text);
  note.classList.add('col-md-6');
  if (disabled) {
    note.setAttribute('disabled', true);
  }
  note.style.backgroundColor = "inherit";
  note.classList.add('style-1');
  return note;
}

function createIdElement(userId) {
  var id = document.createElement('input');
  id.setAttribute('type', "hidden");
  id.setAttribute('value', userId);
  return id;
}

function createFormTitle(tbdy) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.style.backgroundColor = "#5a5a5a";

  var nameLabel = createLabel("暱稱");
  nameLabel.classList.add('col-md-5');

  var noteLabel = createLabel("出席率");
  noteLabel.classList.add('col-md-6');

  td.appendChild(nameLabel);
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
