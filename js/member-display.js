firestoreDB.collection("member").orderBy("career").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => 暱稱是 ${doc.get("nick_name")}, 是否為管理員 ${doc.get("is_admin")}`);
  });
  tableCreate(querySnapshot);
});

function tableCreate(querySnapshot) {
  var size = querySnapshot.size;
  var data = querySnapshot.docs;
  var container = document.getElementById('member_list');
  var tbl = document.createElement('table');
  tbl.classList.add('col-md-4');
  tbl.classList.add('col-md-offset-4');
  // tbl.classList.add('text-center');
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  // createTitle(tbdy);
  for (var i = 0; i < size; i++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.style.backgroundColor = getCareerColor(data[i].get("career"));
    tr.style.color = "black";
    td.appendChild(document.createTextNode(data[i].get("nick_name") + '\u0020'))
    tr.appendChild(td)
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  container.appendChild(tbl);
}

function createTitle(tbdy) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.style.backgroundColor = "black";
  td.appendChild(document.createTextNode('暱稱\u0020'))
  tr.appendChild(td)
  tbdy.appendChild(tr);
}
