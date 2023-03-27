var user = firebase.auth().currentUser; // 현재 사용자 객체 가져오기
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // 로그인 된 경우
    document.getElementById('logoutbtn').classList.remove('hidden');
    document.getElementById("loginbtn").classList.add('hidden');
  } else {
    // 로그아웃 된 경우
    document.getElementById("logoutbtn").classList.add('hidden');
    document.getElementById('loginbtn').classList.remove('hidden');
  }
});


