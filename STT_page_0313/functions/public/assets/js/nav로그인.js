document.getElementById(`mockinterview`).addEventListener('click', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = '/select-type';
        } else {
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = '/login';
        }
    });
});

document.getElementById(`result`).addEventListener('click', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = '/choiceresults';
        } else {
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = '/login';
        }
    });
});
