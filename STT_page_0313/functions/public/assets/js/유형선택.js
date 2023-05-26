firebase.auth().onAuthStateChanged(user => {
  if (user) {
  const buttons = ["A", "B", "C"];

  buttons.forEach(function (type) {
    document.getElementById(`type${type}`).addEventListener("click", function () {
      saveSelectedType(type);
    });
  });

  function saveSelectedType(type) {
    localStorage.setItem("selectedType", type); // 웹 브라우저에 변수를 저장
    window.location.href = "/notice"; // 유의사항.html 페이지로 이동
  } 
  }else {
    swal({
      title: "Login",
      text: "로그인이 필요한 서비스입니다.",
      icon: "warning", //"info,success,warning,error" 중 택1
    }).then((ok) => {
        if (ok) {
            window.location.href = '/Login';
        /* "YES"클릭시 로직 */
        }
    });
  }
});
