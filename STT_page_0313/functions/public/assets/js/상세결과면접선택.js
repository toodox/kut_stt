var xhr = new XMLHttpRequest();
var db = firebase.firestore();
let onlyuser = /^u_[\w]+_[A-Z]/;
xhr.open('POST', '/getCollections', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();


xhr.onreadystatechange = () => {
  setTimeout(() => {
    let user = firebase.auth().currentUser;
    let userName = user.email.split('@',2)[0];
    if (xhr.readyState == 4 && xhr.status == 200) {
      var { names } = JSON.parse(xhr.response);
      names.forEach(name => {
        itype = name.split("_", 3)
        if (onlyuser.test(name) && itype[1] == userName) {
          let clear = document.getElementById('clemock');
          let newli = document.createElement('li');
          newli.classList.add('select-list');
          newli.innerHTML = '<a href="/results" class="mocktype" id="type_'
            + itype[2] + '" data-hover="대입 수시 면접 ' + itype[2] + '형">'
            + '<span>대입 수시 면접 ' + itype[2] + '형</span></a>';
          clear.append(newli);
        }
      })
    }
  }, 500)
  
}

$(document).on('click', '.mocktype', function (e) {
  let typename = e.target.id.split("_",2);
  console.log(typename[1]);
  localStorage.setItem("resultType", typename[1]);
});