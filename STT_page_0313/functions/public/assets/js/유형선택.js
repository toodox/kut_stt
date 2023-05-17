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
