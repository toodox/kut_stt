document.getElementById("typeA").addEventListener("click", function() {
    saveSelectedType("A");
  });
  
  document.getElementById("typeB").addEventListener("click", function() {
    saveSelectedType("B");
  });
  
  document.getElementById("typeC").addEventListener("click", function() {
    saveSelectedType("C");
  });
  
  function saveSelectedType(type) {
    localStorage.setItem("selectedType", type); // 웹 브라우저에 변수를 저장
    window.location.href = "/notice"; // 유의사항.html 페이지로 이동
  }
  