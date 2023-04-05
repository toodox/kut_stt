var user = firebase.auth().currentUser; // 현재 사용자 객체 가져오기
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // 로그인 된 경우
    document.getElementById('logoutbtn').classList.remove('hidden');
    document.getElementById('uinfo').classList.remove('hidden');
    document.getElementById("loginbtn").classList.add('hidden');
    document.getElementById("signupbtn").classList.add('hidden');
    document.getElementById("uinfo").innerText = user.email.split("@")[0];
  } else {
    // 로그아웃 된 경우
    document.getElementById("uinfo").classList.add('hidden');
    document.getElementById("logoutbtn").classList.add('hidden');
    document.getElementById('loginbtn').classList.remove('hidden');
    document.getElementById('signupbtn').classList.remove('hidden');
  }
});


