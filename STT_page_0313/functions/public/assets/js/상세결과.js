var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();
var i = 1;
var questionsLen = 0;
var audioEl = document.querySelector("audio");
var user = firebase.auth().currentUser;
var qList = document.getElementById("questionLists");
var userName;
var duration; //걸린시간용 변수
var resultType; //선택한 타입


function updateProgressBar(currentPercent) {
    $('#QProgress').html(
        '<div ' 
        + 'class="progress-bar progress-bar-striped progress-bar-animated" ' 
        + 'role="progressbar" ' 
        + 'style="width: '
        + currentPercent
        + '%" aria-valuenow="0"' 
        + ' aria-valuemin="0"' 
        + ' aria-valuemax="100"' 
        + '></div>'
    );
}


window.onload = function() {
    resultType = localStorage.getItem("resultType");
    db.collection('question_' + resultType).get().then(result => {
        questionsLen = result.size;
        console.log(questionsLen);
        updateProgressBar(100 * 1 / questionsLen);
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
    setTimeout(function() {
        // 질문지 불러오기
        db.collection('question_' + resultType).doc(resultType + '_question' + i).get().then((result) => {
            $('#questions').html('<h1 id="Qcon">질문1. ' + result.data().content + '</h1>');
            document.getElementById("Qtype").innerText= result.data().type;
        });

        // 현재 window.onload를 통해 상세결과를 바로 출력할 시
        // user의 값이 null로 나오는 경우가 있음
        // window.onload가 페이지가 로딩되자마자 실행되는 것이라
        // 로딩되는 즉시 user의 정보를 받아오지 못하는 듯 함
        // 개선이 필요할 듯함
        // ex) 상세결과를 누르자 마자 바로 질문 번호가 나오지 않는 방식으로
        var user = firebase.auth().currentUser;
        userName = user.email.split("@")[0];
        console.log(userName);

        // 수정 전/후 텍스트 불러오기
        db.collection('answer').doc(userName + resultType + i).get().then((result) => {
            console.log(result.data().수정전내용);
            let resultArray = result.data().수정전내용.split(' ');
            let showChange = JSON.parse(result.data().수정할내용);
            let objKeys = Object.keys(showChange);
            let idx = 0;
            console.log(showChange);
            console.log(resultArray);
            let createSentence = '';
            for (element of resultArray) {
                if (element == objKeys[idx]) {
                    createSentence +=
                    '<a class="txt_spell txt_spell_high first_line">\n' + 
                    '<span class="txt_word">' + 
                    showChange[element] + '</span>\n' +
                    '<span class="inner_spell">' + 
                    element + '</span>\n</a>\n';
                    idx += 1;
                    console.log(element);
                }
                else {
                    createSentence += '<span>' + element + '</span>\n';
                }
            }
            createSentence += '<br>';
            $('#join_result').html(createSentence);
            
            duration = result.data().걸린시간;
            document.getElementById("timeCall").textContent = `걸린 시간: ${duration}초`;
            document.getElementById("keyword").textContent = "키워드: " + result.data().키워드;

            ques = result.data().추가질문.split("2.");
            document.getElementById("aQ1Label").textContent = ques[0];
            document.getElementById("aQ2Label").textContent = '2.' + ques[1];
        }).catch((error) => {
            alert("답변을 불러오는 중 오류가 발생했습니다");
            console.log(error);
        });
        
        // 오디오 파일 불러오기
        storageRef.child('voicedata/'+ userName + " " + i + "번 질문" + resultType).getDownloadURL().then(function(url) {
            // 오디오 태그를 사용하여 음성 파일을 표시
            audioEl.src = url;
        }).catch((error) => {
            alert("음성 파일을 불러오는 중 오류가 발생했습니다");
        });


    }, 2023);
}


$('#after').click(function () {
    if (i < questionsLen) {
        i ++;
        updateProgressBar(100 * i / questionsLen);
        db.collection('question_' + resultType).doc(resultType + '_question' + i).get().then((result) => {
            // 질문 내용 업데이트
            document.getElementById("Qcon").innerText='질문' + i + '. ' + result.data().content;
            // 질문 유형 업데이트
            document.getElementById("Qtype").innerText= result.data().type;
            db.collection('answer').doc(userName + resultType + i).get().then((result) => {
                console.log(result.data().수정전내용);
                let resultArray = result.data().수정전내용.split(' ');
                let showChange = JSON.parse(result.data().수정할내용);
                let objKeys = Object.keys(showChange);
                let idx = 0;
                console.log(showChange);
                console.log(resultArray);
                let createSentence = '';
                for (element of resultArray) {
                    if (element == objKeys[idx]) {
                        createSentence +=
                        '<a class="txt_spell txt_spell_high first_line">\n' + 
                        '<span class="txt_word">' + 
                        showChange[element] + '</span>\n' +
                        '<span class="inner_spell">' + 
                        element + '</span>\n</a>\n';
                        idx += 1;
                        console.log(element);
                    }
                    else {
                        createSentence += '<span>' + element + '</span>\n';
                    }
                }
                createSentence += '<br>';
                $('#join_result').html(createSentence);
                
                duration = result.data().걸린시간;
                document.getElementById("timeCall").textContent = `걸린 시간: ${duration}초`;
            }).catch((error) => {
                alert("답변을 불러오는 중 오류가 발생했습니다");
            });
            // 오디오 파일 불러오기
            storageRef.child('voicedata/'+ userName + " " + i + "번 질문" + resultType).getDownloadURL().then(function(url) {
                // 오디오 태그를 사용하여 음성 파일을 표시
                audioEl.src = url;
            }).catch((error) => {
                alert("음성 파일을 불러오는 중 오류가 발생했습니다");
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
        i --;
        updateProgressBar(100 * i / questionsLen);
        db.collection('question_' + resultType).doc(resultType + '_question' + i).get().then((result) => {
            // 질문 내용 업데이트
            document.getElementById("Qcon").innerText='질문' + i + '. ' + result.data().content;
            // 질문 유형 업데이트
            document.getElementById("Qtype").innerText= result.data().type;
            db.collection('answer').doc(userName + resultType + i).get().then((result) => {
                console.log(result.data().수정전내용);
                let resultArray = result.data().수정전내용.split(' ');
                let showChange = JSON.parse(result.data().수정할내용);
                let objKeys = Object.keys(showChange);
                let idx = 0;
                console.log(showChange);
                console.log(resultArray);
                let createSentence = '';
                for (element of resultArray) {
                    if (element == objKeys[idx]) {
                        createSentence +=
                        '<a class="txt_spell txt_spell_high first_line">\n' + 
                        '<span class="txt_word">' + 
                        showChange[element] + '</span>\n' +
                        '<span class="inner_spell">' + 
                        element + '</span>\n</a>\n';
                        idx += 1;
                        console.log(element);
                    }
                    else {
                        createSentence += '<span>' + element + '</span>\n';
                    }
                }
                createSentence += '<br>';
                $('#join_result').html(createSentence);
                
                duration = result.data().걸린시간;
                document.getElementById("timeCall").textContent = `걸린 시간: ${duration}초`;
            }).catch((error) => {
                alert("답변을 불러오는 중 오류가 발생했습니다");
            });
            // 오디오 파일 불러오기
            storageRef.child('voicedata/'+ userName + " " + i + "번 질문" + resultType).getDownloadURL().then(function(url) {
                // 오디오 태그를 사용하여 음성 파일을 표시
                audioEl.src = url;
            }).catch((error) => {
                alert("음성 파일을 불러오는 중 오류가 발생했습니다");
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


var target = document.getElementById('cart');
var targetID;

$('#cart').click(function() {
    targetID = this.getAttribute('href');
    document.querySelector(targetID).style.display = 'block';
});

$('#closeBtn').click(function() {
    document.querySelector(targetID).style.display = 'none';
});


$('#gpt').click(function () {
    function saveSelectedType(type) {
        localStorage.setItem("selectedType", type); // 웹 브라우저에 변수를 저장
        window.location.href = "/notice"; // 유의사항.html 페이지로 이동
      }     
    saveSelectedType("GPT");
});