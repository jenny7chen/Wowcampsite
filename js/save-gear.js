function saveGear() {
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
  var userId = Cookies.get('user_id');
  firebase.database().ref('gear/' + raidId+'/'+userId).set(data, function(error){
    if(error){
      console.log("失敗");
      swal("儲存失敗,請再試一次");

    }else{
      swal("儲存成功", {
        icon: "success",
      });
      var container = document.getElementById('user_gear_form_container');
      var range = document.createRange();
      range.selectNodeContents(container);
      range.deleteContents();
      $("#form_submit").hide();
      console.log("成功");
    }
  });
}

function fetchTableData() {
  var container = document.getElementById('user_gear_form_container');
  var tbdy = container.children[0].children[0];
  var data = [];
  for (var i = 1; i < tbdy.childElementCount; i++) {
    var bossSelect = tbdy.children[i].children[0].children[1].children[0];
    var boss = bossSelect.options[bossSelect.selectedIndex].value;
    var partSelect = tbdy.children[i].children[0].children[2].children[0];
    var part = partSelect.options[partSelect.selectedIndex].value;
    var note = tbdy.children[i].children[0].children[3].value;
    var lock = tbdy.children[i].children[0].children[4].value == "true";
    var rowData = {
      boss: boss,
      part: part,
      note: note,
      lock:lock
    };
    data.push(rowData);
  }
  return data;
}
