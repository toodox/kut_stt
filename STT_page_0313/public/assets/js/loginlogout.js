
$('#loginbtn').click(function(){
  var user = firebase.auth().currentUser; // 현재 사용자 객체 가져오기
  if(user){
    firebase.auth().signOut().then(function() { // signOut() 메소드 호출 시 then()을 사용하여 로그아웃 성공 시 처리할 작업을 추가합니다.
      alert("로그아웃 되었습니다.");
      window.location.href = '/로그인.html';
    }).catch(function(error) { // 로그아웃 실패 시 오류 메시지를 표시합니다.
      alert(error.message);
    });
  }
  else{
    window.location.href = '/로그인.html';
  }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // 로그인 된 경우
      document.getElementById('loginbtn').innerHTML = 'LogOUT';
      document.getElementById('userInfo').innerHTML = user.displayName + '님 환영합니다!';
    } else {
      // 로그아웃 된 경우
      document.getElementById('loginbtn').innerHTML = 'Login';
      document.getElementById('userInfo').innerHTML = '로그인이 필요합니다.';
    }
  });
  
