var db = firebase.firestore();
var storage = firebase.storage();
var user = firebase.auth().currentUser;

var isRecording = false;
var r = document.getElementById('content');
var speechRecognizer = new webkitSpeechRecognition();

var constraints = { audio: true };
var mediaRecorder;
var chunks = [];
var blob, bloburl;
var total_time;   // 총 걸린 시간
var time_gap = 0; // 문제별 걸린 시간
var first_time, last_time;
var selectedType;  //문제타입변수
var QIndex = 1;
var questionsLen = 1;
var recodeing = 0; //녹음중인지 확인하는 변수

function startRecording() {
    chunks = [];
    recodeing = 1;
    navigator.mediaDevices.getUserMedia(constraints).then(
        function(mediaStream) {
            mediaRecorder = new MediaRecorder(mediaStream);

            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
                if (mediaRecorder.state == "inactive") {
                    blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                    // Do something with the blob object, such as uploading it to the server
                }
            }

            mediaRecorder.start();
        }).catch(function(error) {
            console.log(error.name + ": " + error.message);
        });
}


function startConverting() {
    startRecording();
    first_time = performance.now();
    r.innerHTML = '';

    if ('webkitSpeechRecognition' in window) {
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'ko-KR';
        speechRecognizer.start();

        var finalTranscripts = '';

        speechRecognizer.onresult = function(event) {
            var interimTranscripts = '';

            for (var i = event.resultIndex; i < event.results.length; i ++) {
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");

                if (event.results[i].isFinal)
                    finalTranscripts += transcript;
                else
                    interimTranscripts += transcript;
            }
            r.innerHTML = finalTranscripts + interimTranscripts;
        };

        speechRecognizer.onerror = function(event) {

        };
    }
    else {
        r.innerHTML = "Your browser is not supported. If google chrome, please upgrade!";
    }
}


function stopConverting() {
    recodeing = 0;
    speechRecognizer.stop();
    mediaRecorder.stop();
    last_time = performance.now();
    time_gap = Math.round(((last_time - first_time) / 1000) * 10) / 10;
    total_time += time_gap;
}


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

function updateContentAndType(selectedTypes, questionNum) {
    db.collection('question_' + selectedTypes).doc(selectedTypes + '_question' + questionNum).get().then((result) => {
        if (questionNum == 1) {
            $('#questions').html('<h1 id="Qcon">질문' + questionNum + '. ' + result.data().content + '</h1>');
            document.getElementById("Qtype").innerText = result.data().type;
        }
        else {
            document.getElementById("Qcon").innerText = '질문' + questionNum + '. ' + result.data().content;
            document.getElementById("Qtype").innerText = result.data().type;
        }
    });
}


function fixWrongSpell(orgSentence, tokens, suggestions) {
    let changedText = orgSentence
    tokens.forEach((token, idx) => {
        console.log(token);
        console.log(suggestions[idx].join('/'));
        changedText = changedText.replace(token, '[' + suggestions[idx].join('/') + ']');
    });
    console.log(changedText);
    return changedText;
}


function createFixArr(tokens, suggestions) {
    let changedObj = {};
    tokens.forEach((token, idx) => {
        changedObj[token] = suggestions[idx].join(" / ");
    });
    return changedObj;
}


window.onload = function() {
    selectedType = localStorage.getItem("selectedType");
    console.log(selectedType);
    db.collection('question_' + selectedType).get().then(snap => {
        size = snap.size;
        questionsLen = size;

        if (size == 1)
            document.getElementById("send").innerText = "다음 단계";
        
        updateProgressBar(0);
    });
    updateContentAndType(selectedType, QIndex);
}


$('#send').click(function() {
    let contentVal = $('#content').val();
    let currentQNum = QIndex;
    if (contentVal != '' && recodeing == 0) {
        let user = firebase.auth().currentUser;
        let userName = user.email.split('@')[0];
        let storageRef = storage.ref();
        let 저장할경로 = storageRef.child('voicedata/' + userName + ' ' + QIndex + "번 질문" + selectedType);

        let 업로드작업 = 저장할경로.put(blob);
        
        let data = JSON.stringify({sentence: $('#content').val(), num: currentQNum});
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/submitForm', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(data);

        if (QIndex < questionsLen) {
            let ok = window.confirm("다음 질문으로 넘어가시겠습니까?");
            if (ok) {
                updateContentAndType(selectedType, QIndex + 1);
                updateProgressBar(100 * QIndex / questionsLen);
            }
            QIndex ++;
            if (QIndex == questionsLen)
                document.getElementById("send").innerText = "다음 단계";
        }
        else {
            updateProgressBar(100);
            setTimeout(function() {
                alert("마지막 질문입니다.");
                let interviewEND = window.confirm("제출하시겠습니까? 처리 중에는 5초 정도 시간이 걸릴 수 있습니다.");
                if(interviewEND)
                {
                    setTimeout(() => window.location.href = "/submit", 5000);
                }
            }, 500);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.response);
                console.log(JSON.parse(xhr.response));
                let { tokens, suggestions, keyword1, moreQuestions } = JSON.parse(xhr.response);
                console.log(tokens);
                console.log(suggestions);
                console.log(keyword1);
                console.log(moreQuestions);

                let fixedSentence = fixWrongSpell(contentVal, tokens, suggestions);
                let fixArr = JSON.stringify(createFixArr(tokens, suggestions));

                let 저장할거 = {
                    수정전내용: contentVal, 
                    수정후내용: fixedSentence, 
                    수정할내용: fixArr, 
                    키워드: keyword1, 
                    추가질문: moreQuestions, 
                    날짜: new Date(), 
                    걸린시간: time_gap, 
                }
                db.collection('answer').doc(userName + selectedType + currentQNum).set(저장할거).then((result) => {
                    console.log(result);
                }).catch((error) => {
                    console.log(error);
                    alert("오류가 발생하였습니다.");
                })
            }
        }
    }
    else if(contentVal = '')
    {
        alert("공백은 제출할 수 없습니다.");
    }
    else if(recodeing = 1)
    {
        alert("녹음 진행 중입니다. 종료 버튼을 눌러주세요.");
    }
    else 
    {
        alert("제출하는 중 에러가 발생했습니다.");
    }
});