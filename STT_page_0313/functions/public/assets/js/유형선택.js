// firebase.auth().onAuthStateChanged(user => {
//   if (user) {
//   const buttons = ["A", "B", "C"];

//   buttons.forEach(function (type) {
//     document.getElementById(`type${type}`).addEventListener("click", function () {
//       saveSelectedType(type);
//     });
//   });

//   function saveSelectedType(type) {
//     localStorage.setItem("selectedType", type); // 웹 브라우저에 변수를 저장
//     window.location.href = "/notice"; // 유의사항.html 페이지로 이동
//   } 
//   }else {
//     swal({
//       title: "Login",
//       text: "로그인이 필요한 서비스입니다.",
//       icon: "warning", //"info,success,warning,error" 중 택1
//     }).then((ok) => {
//         if (ok) {
//             window.location.href = '/Login';
//         /* "YES"클릭시 로직 */
//         }
//     });
//   }
// });
var db = firebase.firestore();
let n = 1;
var xhr = new XMLHttpRequest();
let onlyal = /question_(?!GPT)[A-Z]/;
xhr.open('POST', '/getCollections', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();

xhr.onreadystatechange = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    var { names } = JSON.parse(xhr.response);
    names.forEach(name => {
      if (onlyal.test(name)) {
        itype = name.split("_", 2)
        let que = document.getElementById('typelist');
        let newli = document.createElement('li');
        newli.classList.add('select-list');
        newli.innerHTML = '<a href="/notice" class="mocktype" id="type_'
          + itype[1] + '" data-hover="대입 수시 면접 ' + itype[1] + '형">'
          + '<span>대입 수시 면접 ' + itype[1] + '형</span></a>';
        que.append(newli);
      }
    })
  }
}

$(document).on('click', '.mocktype', function (e) {
  let typename = e.target.id.split("_",2);
  console.log(typename[1]);
  localStorage.setItem("selectedType", typename[1]);
});