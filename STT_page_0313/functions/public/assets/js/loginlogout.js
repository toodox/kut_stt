firebase.auth().onAuthStateChanged(async function () {
  var user = await firebase.auth().currentUser;
  if (user) {
    // 로그인 된 경우
    document.getElementById('logoutbtn').classList.remove('hidden');
    document.getElementById('uinfo').classList.remove('hidden');
    document.getElementById('loginbtn').classList.add('hidden');
    document.getElementById('signupbtn').classList.add('hidden');
    document.getElementById('uinfo').innerText = localStorage.getItem('userName');
    if (user.email == 'master@koreatech.ac.kr') {
      document.getElementById('adminch').classList.remove('hidden');
    }
  } 
  else {// 로그아웃 된 경우
    document.getElementById('logoutbtn').classList.add('hidden');
    document.getElementById('loginbtn').classList.remove('hidden');
    document.getElementById('signupbtn').classList.remove('hidden');
    document.getElementById('adminch').classList.add('hidden');
    document.getElementById('uinfo').classList.add('hidden');
  }
});


