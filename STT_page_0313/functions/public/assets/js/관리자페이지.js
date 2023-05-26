var xhr = new XMLHttpRequest();
xhr.open('POST', '/getCollections', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();
let onlyuser = /^u_[\w]+_[A-Z]$/;
var db = firebase.firestore();

xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {

        var { names } = JSON.parse(xhr.response);
        names.forEach(name => {
            if (onlyal.test(name)) {
                //질문 컬렉션 불러와서 목록 띄우기
                let que = document.getElementById('queli');
                let newdiv = document.createElement('div');
                let itype = name.split('_', 3);
                newdiv.innerHTML = 
                que.append(newdiv);
            }
        });
    }
}