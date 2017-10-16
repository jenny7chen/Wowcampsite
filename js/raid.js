var raidOpen;
realtimeDB.ref('/raid').once('value').then(function(snapshot) {
  raidOpen = snapshot.child('status').val();
  console.log("raid status = " + open);
  setStatus();
});

function setStatus() {
  if (raidOpen) {
    $("#raid_edit_status").text("目前副本狀態:開放填寫中");
    $("#switch_raid_status").prop('value', "關閉填寫");
  } else {
    $("#raid_edit_status").text("目前副本狀態:關閉填寫中");
    $("#switch_raid_status").prop('value', "開放填寫");
  }
}

function switchRaidStatus() {
  if (Cookies.get('user_is_admin') == "true") {
    console.log("raid status change from " + raidOpen + " to" + !raidOpen);
    var btn = document.getElementById("switch_raid_status");
    realtimeDB.ref('raid/status').set(!raidOpen, function(error) {
      if (!error) {
        raidOpen = !raidOpen;
        setStatus();
      } else {
        swal("切換狀態失敗,再試一次");
      }
    });
  }
}
