function getCareerColor(career) {
  switch (career) {
    case 1: //DK
      return "#C41F3B";
      break;
    case 2: //DH
      return "#A330C9";
      break;
    case 3: //Druid
      return "#FF7D0A";
      break;
    case 4: //Hunter
      return "#ABD473";
      break;
    case 5: //Mage
      return "#69CCF0";
      break;
    case 6: //Monk
      return "#00FF96";
      break;
    case 7: //Paladin
      return "#F58CBA";
      break;
    case 8: //Priest
      return "#FFFFFF";
      break;
    case 9: //Rogue
      return "#FFF569";
      break;
    case 10: //Shaman
      return "#0070DE";
      break;
    case 11: //Warlock
      return "#9482C9";
      break;
    case 12: //Warrior
      return "#C79C6E";
      break;
  }
}

function getAllCareer() {
  var data = [];
  for (var i = 1; i < 13; i++) {
    var rowData = {
      careerId: i,
      careerName: getCareerName(i),
    };
    data.push(rowData);
  }
  return data;
}

function getCareerName(career) {
  switch (career) {
    case 1: //DK
      return "死亡騎士 DK";
      break;
    case 2: //DH
      return "惡魔獵人 DH";
      break;
    case 3: //Druid
      return "德魯伊 Druid";
      break;
    case 4: //Hunter
      return "獵人 Hunter";
      break;
    case 5: //Mage
      return "法師 Mage";
      break;
    case 6: //Monk
      return "武僧 Monk";
      break;
    case 7: //Paladin
      return "聖騎士 Paladin";
      break;
    case 8: //Priest
      return "牧師 Priest";
      break;
    case 9: //Rogue
      return "盜賊 Rogue";
      break;
    case 10: //Shaman
      return "薩滿 Shaman";
      break;
    case 11: //Warlock
      return "術士 Warlock";
      break;
    case 12: //Warrior
      return "戰士 Warrior";
      break;
  }
}
