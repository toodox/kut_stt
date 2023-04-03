var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();
var i = 1;
var questionsLen = 0;
var audioEl = document.querySelector("audio");
var user = firebase.auth().currentUser;
var qList = document.getElementById("questionLists");


window.onload = function() {
    db.collection('questions').get().then(snap => {
        size = snap.size
        questionsLen = size;
        // 사이드바 생성
        for (var n = 1; n <= questionsLen; n ++) {
            if (n == i) {
                var plusQ = document.createElement('li');
                plusQ.className = "list-group-item bg-primary text-right";
                plusQ.id = "QLcontainer" + n;
                plusQ.innerHTML = '<a class= "text-decoration-none text-white align-items-center" href="#">질문' + n + '</a>';
            }
            else {
                var plusQ = document.createElement('li');
                plusQ.className = "list-group-item bg-light";
                plusQ.id = "QLcontainer" + n;
                plusQ.innerHTML = '<a class= "text-decoration-none text-dark" href="#">질문' + n + '</a>';
            }
            qList.appendChild(plusQ);
        }
    });
    // 질문지 불러오기
    db.collection('questions').doc('users1_questions' + i).get().then((result) => {
        $('#questions').html('<h1 id="Qcon">질문1. ' + result.data().content + '</h1>');
        document.getElementById("Qtype").innerText= result.data().type;
    });
    // 수정 전/후 텍스트 불러오기
    db.collection('teststt').doc(user.email + i).get().then((result) => {
        document.getElementById('contents1').value = result.data().수정전내용;
        document.getElementById('contents2').value = result.data().수정후내용;
    });
    // 오디오 파일 불러오기
    storageRef.child('sample/'+ user + " " + i).getDownloadURL().then(function(url) {
        // 오디오 태그를 사용하여 음성 파일을 표시
        audioEl.src = url;
    }).catch((error) => {
        alert("에러가 발생했습니다");
    });
}


$('#after').click(function () {
    if (i < questionsLen) {
        i ++;
        db.collection('questions').doc('users1_questions' + i).get().then((result) => {
            // 질문 내용 업데이트
            document.getElementById("Qcon").innerText='질문' + i + '. ' + result.data().content;
            // 질문 유형 업데이트
            document.getElementById("Qtype").innerText= result.data().type;
            db.collection('teststt').doc('user' + i).get().then((result) => {
                document.getElementById('contents1').value = result.data().수정전내용;
                document.getElementById('contents2').value = result.data().수정후내용;
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
        alert("질문 끝~");
    }
});

$('#before').click(function () {
    if (i - 1 > 0) {
        i --;
        db.collection('questions').doc('users1_questions' + i).get().then((result) => {
            // 질문 내용 업데이트
            document.getElementById("Qcon").innerText='질문' + i + '. ' + result.data().content;
            // 질문 유형 업데이트
            document.getElementById("Qtype").innerText= result.data().type;
            db.collection('teststt').doc('user' + i).get().then((result) => {
                document.getElementById('contents1').value = result.data().수정전내용;
                document.getElementById('contents2').value = result.data().수정후내용;
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
        alert("처음 질문~");
    }
});