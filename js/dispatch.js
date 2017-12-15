$("#chooser_form").hide();
realtimeDB.ref('/raid').once('value').then(function(snapshot) {
  var open = snapshot.child('status').val();
  console.log("raid status = " + open);
  if (open) {
    $("#raid_edit_status_hint").text("目前副本開放填寫中");
  } else {
    $("#raid_edit_status_hint").text("目前副本關閉填寫中,可以開始分裝");
    $("#chooser_form").show();
    initRaidChooser(snapshot);
    getGearData();
  }
});

function initRaidChooser(snapshot) {
  console.log("init raid chooser");
  var raids = getRaids(snapshot);
  var raid = document.getElementById('raid_chooser');
  for (var i = -1; i < raids.length; i++) {
    var option = document.createElement("option");
    option.style.color = "black";
    option.style.padding = "10px";
    option.style.fontSize = "x-large";
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
}

function onRaidSelected() {
  generateForm([]);
  var raidId = $("#raid_chooser").val();
  console.log("on select change" + raidId);
  initBossChooser(raidId);
}

function onSelected() {
  generateForm([]);
}

function initBossChooser(raidId) {
  var bosses = getBosses(raidId);
  var boss = document.getElementById('boss_chooser');
  var range = document.createRange();
  range.selectNodeContents(boss);
  range.deleteContents();
  for (var i = -1; i < bosses.length; i++) {
    var option = document.createElement("option");
    option.style.color = "black";
    option.style.padding = "10px";
    option.style.fontSize = "x-large";
  if (i > -1) {
      option.text = bosses[i];
      option.value = i;
    } else {
      option.value = -1;
      option.text = "請選擇王";
      option.setAttribute('selected', "selected");
    }
    boss.appendChild(option);
  }
  boss.style.color = "gray";
  boss.style.padding = "10px";
  boss.setAttribute('value', "");
  boss.setAttribute('text', "請選擇王");
}

function getGearData() {
  realtimeDB.ref('/part').once('value').then(function(snapshot) {
    var data = getParts(snapshot);
    initGearChooser(data);
  });
}

function initGearChooser(data) {
  var user = document.getElementById('gear_chooser');
  console.log("user chooser =" + user);
  for (var i = -1; i < data.length; i++) {
    var option = document.createElement("option");
    option.style.color = "black";
    option.style.fontSize = "x-large";
    if (i > -1) {
      option.text = data[i].val();
      option.value = data[i].key;
      option.style.backgroundColor = getPartOptionBgColor(data[i].key);
    } else {
      option.value = "";
      option.text = "請選擇裝備部位";
      option.setAttribute('selected', "selected");
    }
    user.appendChild(option);
  }
  user.style.color = "gray";
  user.style.padding = "10px";
  user.setAttribute('value', "");
  user.setAttribute('text', "請選擇裝備部位");
  $("#chooser_form").show();
}

function chooseGear() {
  var raidId = $("#raid_chooser").val();
  var bossId = $("#boss_chooser").val();
  var partId = $("#gear_chooser").val();
  if (raidId == "" || bossId == "" || partId == "") {
    swal("未選擇副本或裝備部位");
    return;
  }
  fetchRaidData(raidId, bossId, partId);
}

function fetchRaidData(raidId, bossId, partId) {
  realtimeDB.ref('/score/' + raidId).once('value').then(function(scoreSnapShot) {
    realtimeDB.ref('/member').once('value').then(function(memberSnapShot) {
      realtimeDB.ref('/gear/' + raidId).once('value').then(function(snapshot) {
        findUserWithThis(scoreSnapShot, memberSnapShot, snapshot, raidId, bossId, partId);
      });
    });
  });
}

function findUserWithThis(scoreSnapShot, memberSnapShot, snapshot, raidId, bossId, partId) {
  var users = [];
  var index = 0;
  snapshot.forEach(function(userSnapshot) {
    if (userSnapshot != null && userSnapshot != undefined) {
      index = 0;
      userSnapshot.forEach(function(gearSnapShot) {
        if (gearSnapShot != null) {
          console.log("index = " + index);
          if ((partId.startsWith("a_tier") && gearSnapShot.child("part").val() == partId) || (gearSnapShot.child("boss").val() == parseInt(bossId) && gearSnapShot.child("part").val() == partId)) {
            var score = (scoreSnapShot == null || scoreSnapShot.child(userSnapshot.key) == null) ? 0 : scoreSnapShot.child(userSnapshot.key).val();
            var order = "" + index;
            var rowData = {
              raidId: raidId,
              bossId: bossId,
              userId: userSnapshot.key,
              userName: memberSnapShot.child(userSnapshot.key).child('nick_name').val(),
              note: gearSnapShot.child("note").val(),
              lock: gearSnapShot.child("lock").val(),
              order: index,
              score: score,
              career: memberSnapShot.child(userSnapshot.key).child('career').val()
            };
            console.log("index = " + rowData.order);
            users.push(rowData);
          }
        }
        index++;
      })
    }
  });
  if (users.length == 0) {
    swal("沒有人填寫這項裝備");
    generateForm(users);
    return;
  }
  console.log("users length = " + users.length);
  console.log("全部有裝的人:" + users[0].userId);
  generateForm(users.sort(compare));
}

function compare(a, b) {
  if (a.order < b.order)
    return -1;
  if (a.order > b.order)
    return 1;
  return 0;
}

function generateForm(data) {
  var container = document.getElementById('user_gear_form_container');
  var range = document.createRange();
  range.selectNodeContents(container);
  range.deleteContents();

  if (data.length == 0) {
    return;
  }

  if (Cookies.get('user_is_admin') != "true") {
    return;
  }

  var tbl = document.createElement('table');
  tbl.classList.add('col-md-6');
  tbl.classList.add('col-md-offset-3');
  // tbl.classList.add('text-center');
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  createFormTitle(tbdy);

  for (var i = 0; i < data.length; i++) {
    var tr = document.createElement('tr');
    tr.style.color = "black";
    createOneRow(i, tr, data[i]);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  container.appendChild(tbl);
}

function createOneRow(index, tr, rowData) {
  var td = document.createElement('td');
  var label = document.createElement("label");
  label.appendChild(document.createTextNode(rowData.order + 1));
  label.classList.add('col-md-1');
  td.appendChild(label);
  td.appendChild(createTextElement(rowData.userName, rowData.lock, true, rowData.career));
  td.appendChild(createTextElement(rowData.note, rowData.lock, true));
  if (rowData.score == null) {
    rowData.score = 0;
  }
  var scoreInput = createTextElement(rowData.score, rowData.lock, false);
  td.appendChild(scoreInput);
  td.appendChild(createScoreBtn(td, scoreInput, rowData));
  td.appendChild(createGiveBtn(td, rowData));

  if (rowData.lock) {
    td.style.backgroundColor = "#ff5050";
  } else {
    td.style.backgroundColor = "white";
  }
  tr.appendChild(td)
}

function createScoreBtn(td, scoreInput, rowData) {
  var btn = document.createElement("input");
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', "儲存出席率");
  btn.classList.add('col-md-2');
  btn.style.height = "50px";
  btn.classList.add('btn-primary');
  btn.addEventListener("click", function() {
    saveScore(td, scoreInput, rowData, btn);
  });
  return btn;
}

function saveScore(td, scoreInput, rowData, btn) {
  var score = scoreInput.value;
  firebase.database().ref('score/' + rowData.raidId + '/' + rowData.userId).set(parseInt(score), function(error) {
    if (!error) {
      swal('已更改' + rowData.userName + "的出席率為" + score);
    } else {
      swal('儲存失敗，請再試一次');
    }
  });
}

function createGiveBtn(td, rowData) {
  var btn = document.createElement("input");
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', rowData.lock ? "收回裝備" : "給裝備");
  btn.classList.add('col-md-2');
  btn.style.height = "50px";
  if (rowData.lock) {
    btn.classList.add('btn-warning');
  } else {
    btn.classList.add('btn-success');
  }
  btn.addEventListener("click", function() {
    giveGear(rowData.lock ? false : true, td, rowData, btn);
  });
  return btn;
}

function giveGear(give, td, rowData, btn) {
  firebase.database().ref('gear/' + rowData.raidId + '/' + rowData.userId + '/' + rowData.order + '/lock').set(give, function(error) {
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
        giveGear(!give, td, rowData, btn);
      });
    }
  });
}

function createTextElement(text, isLock, disabled, career) {
  var note = document.createElement('input');
  note.setAttribute('type', "text");
  note.setAttribute('value', text);
  note.classList.add('col-md-2');
  if (disabled) {
    note.setAttribute('disabled', true);
  }

  if (isLock) {
    // note.style.backgroundColor = "#ff5050";
    note.classList.add('style-2');
    note.style.backgroundColor = "inherit";
  } else {
    note.classList.add('style-1');
    if (career != undefined && career != null) {
      note.style.backgroundColor = getCareerColor(career);
    } else {
      note.style.backgroundColor = "inherit";
    }
  }
  return note;
}


function createFormTitle(tbdy) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.style.backgroundColor = "#5a5a5a";

  var orderLabel = createLabel("志願");
  orderLabel.classList.add('col-md-1');

  var bossLabel = createLabel("暱稱");
  bossLabel.classList.add('col-md-2');

  var partLabel = createLabel("備註");
  partLabel.classList.add('col-md-1');

  var noteLabel = createLabel("出席率");
  noteLabel.classList.add('col-md-2');

  td.appendChild(orderLabel);
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
