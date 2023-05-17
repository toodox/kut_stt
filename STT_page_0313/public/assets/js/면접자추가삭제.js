var db = firebase.firestore();
var n = 0;
var i = 1;
function addlist() {
    db.collection('userInfoListTest').get().then(snap => {
        n = snap.size + 1;
        db.collection('userInfoListTest').doc("user" + n).set(
            {
                이름: document.getElementById('stname').value,
                학번: document.getElementById('stnum').value,
            }
        ).then((result) => {
            document.getElementById('stname').textContent = ' ';
            document.getElementById('stnum').textContent = ' ';
            alert("추가되었습니다.");
            console.log(n);

        });
    });
}

rstname = document.getElementById('rstname');
rstnum = document.getElementById('rstnum');
function checkuser() {

    db.collection('userInfoListTest').get().then(snap => {
        for (i = 1; i < snap.size + 1; i++) {
            db.collection('userInfoListTest').doc("user" + i).get().then((result) => {
                if (rstname.value == result.data().이름 && rstnum.value == result.data().학번) {
                    console.log("검색");
                    alert("검색되었습니다..");
                    // us 클래스인  a태그가 클릭되면
                    const udata = {
                        이름: rstname.value,
                        학번: rstnum.value,
                    }    //클릭된 a태그의 id를 가져온다
                    console.log(udata.학번);
                    localStorage.setItem("udata", udata);
                    window.location.href = '관리자페이지2.html'
                }
            });
        }
    });
}

