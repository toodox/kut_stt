var user = firebase.auth().currentUser; // 현재 사용자 객체 가져오기
function admincheck() {
  var user = firebase.auth().currentUser;
  if (user) {
      if (user.email == 'master@koreatech.ac.kr') {   //관리자 아이디일 경우 관리자 페이지 접속
          location.href='/admin-page1'
      }
      else {
          alert("관리자가 아닙니다.")
      }
  }
  else{
      alert("관리자 아이디로 로그인하세요.")
  }

}


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // 로그인 된 경우
    document.getElementById('logoutbtn').classList.remove('hidden');
    document.getElementById('uinfo').classList.remove('hidden');
    document.getElementById("loginbtn").classList.add('hidden');
    document.getElementById("signupbtn").classList.add('hidden');
    document.getElementById("uinfo").innerText = user.email;
    if (user.email == 'master@koreatech.ac.kr')
      document.getElementById('adminch').classList.remove('hidden');
  } else {
    // 로그아웃 된 경우
    document.getElementById("uinfo").classList.add('hidden');
    document.getElementById("logoutbtn").classList.add('hidden');
    document.getElementById('loginbtn').classList.remove('hidden');
    document.getElementById('signupbtn').classList.remove('hidden');
    document.getElementById('adminch').classList.add('hidden');
  }
});


