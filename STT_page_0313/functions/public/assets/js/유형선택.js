const db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
  if (user) {
  const buttons = ["typeA", "typeB", "typeC"];

  buttons.forEach(function (type) {
    document.getElementById(type).addEventListener("click", function () {
      saveSelectedType(type);
    });
  });

  function saveSelectedType(type) {
    localStorage.setItem("selectedType", type); // 웹 브라우저에 변수를 저장
    window.location.href = "/notice"; // 유의사항.html 페이지로 이동
  } 
  }else {
    alert("로그인이 필요한 서비스입니다.");
    window.location.href = "/login";
  }
});
