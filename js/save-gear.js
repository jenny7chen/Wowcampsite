function saveGear() {
  var data = fetchTableData();
  if(data == undefined){
    swal("儲存失敗！好像有裝備忘記填寫是哪隻王的喔！");
  }
  var raidId;
  var radios = document.getElementById('raid_chooser_radio_group');

  for (var i = 0, length = radios.childNodes.length; i < length; i++) {
    var label = radios.children[i];
    if (label.children[0].checked) {
      raidId = label.children[0].value;
      break;
    }
  }
  var userId = Cookies.get('user_id');

  realtimeDB.ref('/raid').once('value').then(function(snapshot) {
    var open = snapshot.child('status').val();
    if (open) {
      firebase.database().ref('gear/' + raidId + '/' + userId).set(data, function(error) {
        if (error) {
          console.log("失敗");
          swal("儲存失敗,請再試一次");

        } else {
          swal("儲存成功", {
            icon: "success",
          });
          var container = document.getElementById('user_gear_form_container');
          var range = document.createRange();
          range.selectNodeContents(container);
          range.deleteContents();
          $("#form_submit").hide();
          $("#form_save_hint").hide();
          console.log("成功");
        }
      });
    } else {
      swal("儲存失敗,副本填寫關閉中");
    }
  });
}

function fetchTableData() {
  var container = document.getElementById('user_gear_form_container');
  var tbdy = container.children[0].children[0];
  var data = [];
  for (var i = 1; i < tbdy.childElementCount; i++) {
    var bossSelect = tbdy.children[i].children[0].children[1].children[0];
    var boss = parseInt(bossSelect.options[bossSelect.selectedIndex].value);
    var partSelect = tbdy.children[i].children[0].children[2].children[0];
    var part = partSelect.options[partSelect.selectedIndex].value;
    var note = tbdy.children[i].children[0].children[3].value;
    var lock = tbdy.children[i].children[0].children[4].value == "true";
    if (part != undefined && part != "" && (boss == undefined || boss == -1)) {
      return undefined;
    }
    var rowData = {
      boss: boss,
      part: part,
      note: note,
      lock: lock
    };
    data.push(rowData);
  }
  return data;
}
