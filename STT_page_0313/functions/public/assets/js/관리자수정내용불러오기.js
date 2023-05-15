var db = firebase.firestore();
var storage = firebase.storage();
var i = 1;
var questionsLen = 0;
var user = firebase.auth().currentUser;
var qList = document.getElementById("quesLists");
var userName;

const data = localStorage.getItem('email');
console.log(data);

window.onload = function () {
    db.collection('questions').get().then(snap => {
        size = snap.size
        questionsLen = size;
        // 사이드바 생성
        console.log(questionsLen);
        for (var n = 1; n <= questionsLen; n++) {
            if (n == i) {
                var addQ = document.createElement('li');
                addQ.className = "list-group-item bg-primary text-right";
                addQ.id = "QLcontainer" + n;
                addQ.innerHTML = '<a class= "text-decoration-none text-white align-items-center" href="#">질문' + n + '</a>';
            }
            else {
                var addQ = document.createElement('li');
                addQ.className = "list-group-item bg-light";
                addQ.id = "QLcontainer" + n;
                addQ.innerHTML = '<a class= "text-decoration-none text-dark" href="#">질문' + n + '</a>';
            }
            qList.appendChild(addQ);
        }
    });
    setTimeout(function () {
        // 질문지 불러오기
        db.collection('questions').doc('users1_questions' + i).get().then((result) => {
            $('#questions').html('<h1 id="Qcon">질문1. ' + result.data().content + '</h1>');
            document.getElementById("Qtype").innerText = result.data().type;
        });

        // 현재 window.onload를 통해 상세결과를 바로 출력할 시
        // user의 값이 null로 나오는 경우가 있음
        // window.onload가 페이지가 로딩되자마자 실행되는 것이라
        // 로딩되는 즉시 user의 정보를 받아오지 못하는 듯 함
        // 개선이 필요할 듯함
        // ex) 상세결과를 누르자 마자 바로 질문 번호가 나오지 않는 방식으로
        document.getElementById('useremail').innerText = data + " " + i + "번 질문";

        // 수정 전/후 텍스트 불러오기
        console.log(data);
        db.collection('answer_stt').doc(data + i + "번 질문").get().then((result) => {
            document.getElementById('answerbf').value = result.data().수정전내용;
            document.getElementById('answeraf').value = result.data().수정후내용;
        }).catch((error) => {
            alert("답변을 불러오는 중 오류가 발생했습니다");
        });

    }, 2023);
}


$('#after').click(function () {
    if (i < questionsLen) {
        i++;
        db.collection('questions').doc('users1_questions' + i).get().then((result) => {
            // 질문 내용 업데이트
            document.getElementById("Qcon").innerText = '질문' + i + '. ' + result.data().content;
            // 질문 유형 업데이트
            document.getElementById("Qtype").innerText = result.data().type;
            document.getElementById('useremail').innerText = data + " " + i + "번 질문";
            db.collection('answer_stt').doc(data + i + "번 질문").get().then((result) => {
                document.getElementById('answerbf').value = result.data().수정전내용;
                document.getElementById('answeraf').value = result.data().수정후내용;
            }).catch((error) => {
                alert("답변을 불러오는 중 오류가 발생했습니다");
            });
            // 현재 질문의 사이드 바를 하이라이트 설정
            document.getElementById('QLcontainer' + i).className = "list-group-item bg-primary text-right";
            document.getElementById('QLcontainer' + i).innerHTML = '<a class= "text-decoration-none text-white align-items-center" href="#">질문' + i + '</a>';
            // 이전 질문의 사이드 바를 하이라이트 해제
            document.getElementById('QLcontainer' + (i - 1)).className = "list-group-item bg-light";
            document.getElementById('QLcontainer' + (i - 1)).innerHTML = '<a class= "text-decoration-none text-dark" href="#">질문' + (i - 1) + '</a>';
        });
    }
    else {
        alert("마지막 질문입니다.");
    }
});

$('#before').click(function () {
    if (i - 1 > 0) {
        i--;
        db.collection('questions').doc('users1_questions' + i).get().then((result) => {
            // 질문 내용 업데이트
            document.getElementById("Qcon").innerText = '질문' + i + '. ' + result.data().content;
            // 질문 유형 업데이트
            document.getElementById("Qtype").innerText = result.data().type;
            document.getElementById('useremail').innerText = data + " " + i + "번 질문";
            db.collection('answer_stt').doc(data + i + "번 질문").get().then((result) => {
                document.getElementById('answerbf').value = result.data().수정전내용;
                document.getElementById('answeraf').value = result.data().수정후내용;
            }).catch((error) => {
                alert("답변을 불러오는 중 오류가 발생했습니다");
            });
            // 현재 질문의 사이드 바를 하이라이트 설정
            document.getElementById('QLcontainer' + i).className = "list-group-item bg-primary text-right";
            document.getElementById('QLcontainer' + i).innerHTML = '<a class= "text-decoration-none text-white align-items-center" href="#">질문' + i + '</a>';
            // 이전 질문의 사이드 바를 하이라이트 해제
            document.getElementById('QLcontainer' + (i + 1)).className = "list-group-item bg-light";
            document.getElementById('QLcontainer' + (i + 1)).innerHTML = '<a class= "text-decoration-none text-dark" href="#">질문' + (i + 1) + '</a>';
        });
    }
    else {
        alert("처음 질문입니다.");
    }
});

function updateanswer() {
    db.collection('answer_stt').doc(data + i + "번 질문").update(
        {
            관리자수정후내용: document.getElementById('answeraf').value
        }
    ).then(() => {
        alert("수정되었습니다.");
        window.location.href = '#';
    });
}