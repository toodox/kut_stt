firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // 로그인 된 경우
      document.getElementById('loginbtn').innerHTML = 'LogOUT';
      document.getElementById('userInfo').innerHTML = user.displayName + '님 환영합니다!';

    } else {
      // 로그아웃 된 경우
      document.getElementById('loginBtn').innerHTML = '로그인';
      document.getElementById('userInfo').innerHTML = '로그인이 필요합니다.';
    }
  });
if(user){
    document.querySelector("#loginbtn").addEventListener('click',function(){
        firebase.auth().signOUT();
        window.location.href = '/로그인.html';
      })
}
