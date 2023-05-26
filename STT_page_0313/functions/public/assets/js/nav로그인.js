document.getElementById(`mockinterview`).addEventListener('click', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = '/select-type';
        } else {
            swal({
                title: "Hello",
                text: "로그인이 필요한 서비스입니다.",
                icon: "info", //"info,success,warning,error" 중 택1
            }).then((ok) => {
                if (ok) {
                    window.location.href = '/login';
                /* "YES"클릭시 로직 */
                }
           });
        }
    });
});

document.getElementById(`result`).addEventListener('click', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = '/choiceresults';
        } else {
            swal({
                title: "Hello",
                text: "로그인이 필요한 서비스입니다.",
                icon: "info", //"info,success,warning,error" 중 택1
            }).then((ok) => {
                if (ok) {
                    window.location.href = '/login';
                /* "YES"클릭시 로직 */
                }
           });
        }
    });
});
