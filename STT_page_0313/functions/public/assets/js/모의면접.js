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
var time_gap;     // 문제별 걸린 시간
var first_time, last_time;

var QIndex = 1;
var questionsLen = 1;


function startRecording() {
    chunks = [];
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


function updateContentAndType(documentName, questionNum) {
    db.collection('questions').doc(documentName + questionNum).get().then((result) => {
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


window.onload = function() {
    db.collection('questions').get().then(snap => {
        size = snap.size;
        questionsLen = size;

        if (size == 1)
            document.getElementById("send").innerText = "다음 단계";
        
        updateProgressBar(0);
    });
    updateContentAndType('users1_questions', QIndex);
}


$('#send').click(function() {
    let contentVal = $('#content').val();
    let currentQNum = QIndex;
    if (contentVal != '') {
        let user = firebase.auth().currentUser;
        let userName = user.email.split('@')[0];
        let storageRef = storage.ref();
        let 저장할경로 = storageRef.child('voicedata/' + userName + ' ' + QIndex + "번 질문");

        let 업로드작업 = 저장할경로.put(blob);
        
        let data = JSON.stringify({sentence: $('#content').val()});
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/submitForm', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(data);

        if (QIndex < questionsLen) {
            let ok = window.confirm("다음 질문으로 넘어가시겠습니까?");
            if (ok) {
                updateContentAndType('users1_questions', QIndex + 1);
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
                window.location.href = "/submit"
            }, 500);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.response);
                console.log(JSON.parse(xhr.response));
                let { tokens, suggestions } = JSON.parse(xhr.response);
                console.log(tokens);
                console.log(suggestions);

                let fixedSentence = fixWrongSpell(contentVal, tokens, suggestions);

                let 저장할거 = {
                    수정전내용: contentVal, 
                    수정후내용: fixedSentence, 
                    날짜: new Date(), 
                    걸린시간: 0, 
                }
                db.collection('teststt').doc(userName + ' ' + currentQNum + "번 질문").set(저장할거).then((result) => {
                    console.log(result);
                    if (currentQNum < questionsLen)
                        alert("정상동작 하였습니다.");
                }).catch((error) => {
                    console.log(error);
                    alert("오류가 발생하였습니다.");
                })
            }
        }
    }
    else {
        alert("공백은 제출할 수 없습니다.");
    }
});