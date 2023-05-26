var xhr = new XMLHttpRequest();
xhr.open('POST', '/getCollections', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();
let onlyal = /question_(?!GPT)[A-Z]/;
let qonly = /(?!GPT)[A-Z]/;
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
                newdiv.innerHTML = '<div class="accordion-item"><h2 class="accordion-header" id="panelsStayOpen-heading' + itype[1]
                    + '"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"data-bs-target="#panelsStayOpen-collapse' + itype[1]
                    + '" aria-expanded="false"aria-controls="panelsStayOpen-collapse' + itype[1] + '">' + name + '</button></h2><div id="panelsStayOpen-collapse'
                    + itype[1] + '" class="accordion-collapse collapse"aria-labelledby="panelsStayOpen-heading'
                    + itype[1] + '"><div class="accordion-body" id="qnum"><div id="qqq'
                    + itype[1] + '"></div><button class="btn btn-warning modbtn" id="' + itype[1] + '">수정완료</button></div></div></div>';
                que.append(newdiv);
                db.collection(name).get().then(snap => {
                    for (let quenum = 1; quenum < snap.size + 2; quenum++) {
                        db.collection(name).doc(itype[1] + '_' + itype[0] + quenum).get().then((result) => {
                            let chp = document.getElementById('qqq' + itype[1]);
                            let newp = document.createElement('div');
                            if (quenum == snap.size + 1) {
                                newp.innerHTML = itype[1] + '_' + itype[0] + quenum
                                    + ' <input type="text" id="' + itype[1] + 'type" placeholder="면접질문 유형"></input> <button class="btn btn-outline-success newbtn" id="add_' + itype[1]
                                    + '" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">추가</button><textarea class="admintextarea my-2" id="'
                                    + itype[1] + '_question' + quenum + '" placeholder="추가할 면접 질문을 입력해주세요." ></textarea>';
                                chp.append(newp);
                            }
                            else {
                                newp.innerHTML = itype[1] + '_' + itype[0] + quenum
                                    + ' &lt;<span id="' + itype[1] + quenum + '">' + result.data().type + '</span>&gt; <button class="btn btn-outline-danger delbtn" id="del_' + itype[1] + '_' + quenum + '" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">삭제</button><textarea class="admintextarea my-2" id="'
                                    + itype[1] + '_question' + quenum + '">'
                                    + result.data().content + '</textarea>';
                                chp.append(newp);
                            }
                        });
                    }
                });
                n++;
            }
        })
    }



    //질문 목록 수정하고 완료버튼 누르면 db에 저장

}
$(document).on('click', '.modbtn', function (b) {
    let col = 'question_' + b.target.id;
    let coln = b.target.id + '_question';
    db.collection(col).get().then(snap => {
        for (let j = 1; j < snap.size + 1; j++) {
            db.collection(col).doc(coln + j).update(
                {
                    content: document.getElementById(coln + j).value,
                    type: document.getElementById(coln + j).value
                }
            );
        }
        alert("수정되었습니다.");
        setTimeout(() => window.location.href = "/admin-ans-edit", 500);
    });

});

$(document).on('click', '.newbtn', function (ad) {

    let addtype = ad.target.id.split('_', 2);
    let adcol = 'question_' + addtype[1];
    let adcoln = addtype[1] + '_question';
    db.collection(adcol).get().then(snap => {
        size = snap.size + 1;
        if (document.getElementById(adcoln + size).value == "")
            alert("추가할 면접 질문을 입력해주세요");
        else {
            db.collection(adcol).doc(adcoln + size).set({
                content: document.getElementById(adcoln + size).value,
                type: document.getElementById(addtype[1] + 'type').value
            });
            alert("추가되었습니다.");
            setTimeout(() => window.location.href = "/admin-ans-edit", 1000); s
        }
    });

});

$(document).on('click', '.delbtn', function (del) {
    let deltg = del.target.id.split("_", 3);        // del A 3
    let delcol = 'question_' + deltg[1];            // question_A
    let delcoln = deltg[1] + '_question';           // A_question
    let delnum = deltg[2];                          // 3
    if (!confirm("해당 질문을 삭제하시겠습니까?")) {
        alert("취소되었습니다.");
    }
    else {
        db.collection("question_R").get().then(snap => {
            let size = snap.size;
            for (let k = Number(delnum) + 1; k < size + 1; k++) {
                let t = k - 1;
                console.log(t);
                db.collection(delcol).doc(delcoln + t).update(
                    {
                        content: document.getElementById(delcoln + k).textContent,
                        type: document.getElementById(deltg[1] + k).textContent
                    }
                );
            }
            db.collection(delcol).doc(delcoln + size).delete();
            alert("삭제되었습니다.");
            setTimeout(() => window.location.href = "/admin-ans-edit", 500);
        });

    }
});

$(document).on('click', '.addbtn', function (add) {
    let text = prompt("질문유형집의 이름을 입력해주세요(대문자만 가능합니다.)");
    let question = "question_" + text;
    let questionn = text + "_question";
    if (qonly.test(text)) {
        var { names } = JSON.parse(xhr.response);
        console.log(question);
        names.forEach(name => {
            if (question == name) {
                alert("중복된 이름입니다.")
            }
            else {
                db.collection(question).doc(questionn + 1).set({
                    content: "간단한자기소개 해주세요",
                    type: "기본질문"
                }).then(() => {
                    alert("생성되었습니다.");
                    setTimeout(() => window.location.href = "/admin-ans-edit", 500);
                })
            }
        });
    }
    else {
        alert("영어 대문자로만 입력해주세요");
    }
});