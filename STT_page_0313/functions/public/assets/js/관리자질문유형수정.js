var xhr = new XMLHttpRequest();
xhr.open('POST', '/getCollections', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();
let onlyal = /question_[A-Z]/;
let n = 1;
var db = firebase.firestore();

// console.log(itype);

xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {

        var { names } = JSON.parse(xhr.response);
        names.forEach(name => {

            if (onlyal.test(name)) {
                //질문 컬렉션 불러와서 목록 띄우기
                let que = document.getElementById('queli');
                let newdiv = document.createElement('div');
                let itype = name.split('_', 2);
                newdiv.innerHTML = '<div class="accordion-item"><h2 class="accordion-header" id="panelsStayOpen-heading' + itype[1] + '"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"data-bs-target="#panelsStayOpen-collapse' + itype[1] + '" aria-expanded="false"aria-controls="panelsStayOpen-collapse' + itype[1] + '">' + name + '</button></h2><div id="panelsStayOpen-collapse' + itype[1] + '" class="accordion-collapse collapse"aria-labelledby="panelsStayOpen-heading' + itype[1] + '"><div class="accordion-body" id="qnum"><div class="card my-4"><div class="card-body text-center" id="qqq' + itype[1] + '"></div></div></div></div></div>';
                que.append(newdiv);
                db.collection(name).get().then(snap => {

                    for (let quenum = 1; quenum < snap.size + 1; quenum++) {
                        db.collection(name).doc(itype[1] + '_' + itype[0] + quenum).get().then((result) => {
                            let chp = document.getElementById('qqq' + itype[1]);
                            let newp = document.createElement('textarea');
                            newp.innerHTML = result.data().content;
                            chp.append(newp);
                        });
                    }
                });
                n++;
            }
        })
    }
}


