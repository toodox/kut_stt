var xhr = new XMLHttpRequest();
xhr.open('POST', '/getCollections', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();
let onlyuser = /^u_[\w]+_[A-Z]$/;
var db = firebase.firestore();
let n = 1;

xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {

        var { names } = JSON.parse(xhr.response);
        names.forEach(name => {
            if (onlyuser.test(name)) {
                //질문 컬렉션 불러와서 목록 띄우기
                let que = document.getElementById('mocklist');
                let newdiv = document.createElement('div');
                let itype = name.split('_', 3);
                newdiv.innerHTML = '<div class="card my-4"><div class="card-body text-center">'
                    + '<a href="/admin-edit-page" class="us" id="' + name + '">'
                    + itype[1] + '  ' + itype[2] + '형</a> 면접내용</div></div>';
                que.append(newdiv);
            }
        });
    }
}
$(document).on('click', '.us', function (e) {
    // console.log(e.target.id)
    const username = e.target.id     //클릭된 a태그의 id를 가져온다
    console.log(username);
    localStorage.setItem("email", username);
});