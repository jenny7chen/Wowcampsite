var raidSnapShot;
var partSnapShot;

realtimeDB.ref('/raid').once('value').then(function(snapshot) {
  console.log("init raid data");
raidSnapShot = snapshot;
});

realtimeDB.ref('/part').once('value').then(function(snapshot) {
  partSnapShot = snapshot;
});

function getBosses(raidId) {
  if (raidSnapShot != undefined) {
    return raidSnapShot.child('raids').child(raidId).child("boss").val();
  }
  return undefined;
};

function getRaids() {
  if (raidSnapShot != undefined) {
    return raidSnapShot.child('raids').val();
  }
  return undefined;
}

function getParts() {
  if (partSnapShot != undefined) {
    var data = [];
    partSnapShot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
    return data;
  }
  return undefined;
}

function getPartName(partId) {
  if (partSnapShot != undefined) {
    return partSnapShot.child(partId);
  }
  return undefined;
}
