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

function getParts(snapshot) {
  if (snapshot != undefined) {
    partSnapShot = snapshot;
    var data = [];
    snapshot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
    return data.sort(comparePart);

  }else if(partSnapShot != undefined){
    var data = [];
    partSnapShot.forEach(function(childSnapshot) {
      data.push(childSnapshot);
    });
    console.log(data.sort(comparePart));
    return data.sort(comparePart);
  }
  return undefined;
}

function comparePart(a, b) {
  if (a.key.startsWith("a_tier_armor_")) {
    return -1;
  }
  if (b.key.startsWith("a_tier_armor_")) {
    return 1;
  }
  if (a.key.endsWith("cloth") && b.key.endsWith("cloth")) {
    return compareSamePart(a, b);
  }
  if (a.key.endsWith("cloth")) {
    return -1;
  }
  if (b.key.endsWith("cloth")) {
    return 1;
  }
  if (a.key.endsWith("leather") && b.key.endsWith("leather")) {
    return compareSamePart(a, b);
  }
  if (a.key.endsWith("leather")) {
    return -1;
  }
  if (b.key.endsWith("leather")) {
    return 1;
  }
  if (a.key.endsWith("mail") && b.key.endsWith("mail")) {
    return compareSamePart(a, b);
  }
  if (a.key.endsWith("mail")) {
    return -1;
  }
  if (b.key.endsWith("mail")) {
    return 1;
  }
  if (a.key.endsWith("plate") && b.key.endsWith("plate")) {
    return compareSamePart(a, b);
  }
  if (a.key.endsWith("plate")) {
    return -1;
  }
  if (b.key.endsWith("plate")) {
    return 1;
  }
  if (a.key.includes("trinket")) {
    return -1;
  }
  if (b.key.includes("trinket")) {
    return 1;
  }
  if (a.key.includes("relic")) {
    return -1;
  }
  if (b.key.includes("relic")) {
    return 1;
  }
  return 0;
}

function compareSamePart(a, b) {
  if (a.key.includes("head")) {
    return -1;
  }
  if (b.key.includes("head")) {
    return 1;
  }
  if (a.key.includes("shoulder")) {
    return -1;
  }
  if (b.key.includes("shoulder")) {
    return 1;
  }
  if (a.key.includes("chest")) {
    return -1;
  }
  if (b.key.includes("chest")) {
    return 1;
  }
  if (a.key.includes("wrist")) {
    return -1;
  }
  if (b.key.includes("wrist")) {
    return 1;
  }
  if (a.key.includes("waist")) {
    return -1;
  }
  if (b.key.includes("waist")) {
    return 1;
  }
  if (a.key.includes("hand")) {
    return -1;
  }
  if (b.key.includes("hand")) {
    return 1;
  }
  if (a.key.includes("leg")) {
    return -1;
  }
  if (b.key.includes("leg")) {
    return 1;
  }
  if (a.key.includes("feet")) {
    return -1;
  }
  if (b.key.includes("feet")) {
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

function getPartOptionBgColor(partId) {
  if(partId.endsWith("cloth")){
    return "#d5f4e6"
  }else if(partId.endsWith("leather")){
    return "#80ced6";
  }else if(partId.endsWith("mail")){
    return "#fefbd8";
  }else if(partId.endsWith("plate")){
    return "#f7cac9";
  }
  return "#FFFFFF";
}
