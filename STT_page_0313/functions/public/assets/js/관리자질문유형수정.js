var xhr = new XMLHttpRequest();
xhr.open('POST', '/getCollections', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();
let onlyal = /question_[A-Z]/;
let n = 1;
var db = firebase.firestore();

xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {

        var { names } = JSON.parse(xhr.response);
        names.forEach(name => {

            if (onlyal.test(name)) {
                //질문 컬렉션 불러와서 목록 띄우기
                let que = document.getElementById('queli');
                let newdiv = document.createElement('div');
                let itype = name.split('_', 2);
                newdiv.innerHTML = '<div class="accordion-item"><h2 class="accordion-header" id="panelsStayOpen-heading' + itype[1] + '"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"data-bs-target="#panelsStayOpen-collapse' + itype[1] + '" aria-expanded="false"aria-controls="panelsStayOpen-collapse' + itype[1] + '">' + name + '</button></h2><div id="panelsStayOpen-collapse' + itype[1] + '" class="accordion-collapse collapse"aria-labelledby="panelsStayOpen-heading' + itype[1] + '"><div class="accordion-body" id="qnum"><div class="card my-4 "><div class="card-body" id="qqq' + itype[1] + '"></div></div><button class="btn btn-outline-primary modbtn" id="' + itype[1] + '">수정완료</button></div></div></div>';
                que.append(newdiv);
                db.collection(name).get().then(snap => {

                    for (let quenum = 1; quenum < snap.size + 1; quenum++) {
                        db.collection(name).doc(itype[1] + '_' + itype[0] + quenum).get().then((result) => {
                            let chp = document.getElementById('qqq' + itype[1]);
                            let newp = document.createElement('div');
                            newp.innerHTML = itype[1] + '_' + itype[0] + quenum + '<textarea class="admintextarea mb-2" id="' + itype[1] + '_question' + quenum + '">' + result.data().content + '</textarea>';
                            chp.append(newp);
                        });
                    }
                });
                n++;
            }
        })
    }

    $('.modbtn').on('click', function (b) {
        let col = 'question_' + b.target.id;
        let coln = b.target.id + '_question';
        console.log(col);
        db.collection(col).get().then(snap => {
            for (let j = 1; j < snap.size + 1; j++) {
                console.log(coln + j);
                db.collection(col).doc(coln + j).update(
                    {
                        content: document.getElementById(coln + j).value
                    }
                );
            }
            alert("수정되었습니다.");
            setTimeout(() => window.location.href = "/admin-ans-edit", 1000);
        });
        
    });
   
}


