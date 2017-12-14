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
  console.log("raid snap shot = " + raidSnapShot + " raid id = " + raidId);
  if (raidSnapShot != undefined) {
    return raidSnapShot.child('raids').child(raidId).child("boss").val();
  }
  return undefined;
};

function getRaids(snapshot) {
  console.log('snapshot = ' + snapshot);
  if (raidSnapShot == undefined) {
    raidSnapShot = snapshot;
  }
  if (raidSnapShot != undefined) {
    var data = [];
    raidSnapShot.child('raids').forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
    return data;
  }
  return undefined;
}

function getParts() {
  if (partSnapShot != undefined) {
    var data = [];
    partSnapShot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
    return data.sort(comparePart);
  }
  return undefined;
}

function comparePart(a, b) {
  console.log("a.key = " + a.key);
  console.log("b.key = " + b.key);
  if(a.key.startsWith("a_tier_armor_")){
    return -1;
  }
  if(b.key.startsWith("a_tier_armor_")){
    return 1;
  }
  if(a.key.endsWith("cloth")){
    return -1;
  }
  if(b.key.endsWith("cloth")){
    return 1;
  }
  if(a.key.endsWith("leather")){
    return -1;
  }
  if(b.key.endsWith("leather")){
    return 1;
  }
  if(a.key.endsWith("mail")){
    return -1;
  }
  if(b.key.endsWith("mail")){
    return 1;
  }
  if(a.key.endsWith("plate")){
    return -1;
  }
  if(b.key.endsWith("plate")){
    return 1;
  }
  return 0;
}

function getPartName(partId) {
  if (partSnapShot != undefined) {
    return partSnapShot.child(partId);
  }
  return undefined;
}
