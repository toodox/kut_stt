var db = firebase.firestore();
var storage = firebase.storage();

$('#subit-button').click(function(){

    var 이메일 = $('#username').val();
    var 패스워드 = $('#password').val();

    firebase.auth().createUserWithEmailAndPassword(이메일, 패스워드).then((result)=>{
    alert("가입 완료되었습니다.");
    window.location.href = '/login'
    console.log(result.user)
    }).catch((error)=>{
        alert("아이디 중복");
        // window.location.href = '/회원가입2.html'
        console.log(error)
    })
})