var db = firebase.firestore();
var storage = firebase.storage();

$('#subit-button').click(function(){

    var 이메일 = $('#username').val();
    var 패스워드 = $('#password').val();

    firebase.auth().createUserWithEmailAndPassword(이메일, 패스워드).then((result)=>{
    swal({
        title: "가입 완료",
        text: "가입 완료되었습니다.",
        icon: "success", //"info,success,warning,error" 중 택1
    }).then((ok) => {
        if (ok) {
            window.location.href = '/Login';
        /* "YES"클릭시 로직 */
        }
    });
    console.log(result.user)
    }).catch((error)=>{
        swal({
            title: "아이디 중복",
            text: "해당 아이디는 이미 존재하는 아이디입니다.",
            icon: "error", //"info,success,warning,error" 중 택1
        });
        // window.location.href = '/회원가입2.html'
        console.log(error)
    })
})