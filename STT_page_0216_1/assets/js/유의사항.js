var isRecoding = false;
var r = document.getElementById('content');
var speechRecognizer = new webkitSpeechRecognition();

function startConverting() {
    isRecoding = true;
    r.innerHTML = '';
    if ('webkitSpeechRecognition' in window) {
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'ko-KR';
        speechRecognizer.start();

        var finalTranscripts = '';

        speechRecognizer.onresult = function (event) {
            var interimTranscripts = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");
                if (event.results[i].isFinal) {
                    finalTranscripts += transcript;
                }
                else {
                    interimTranscripts += transcript;
                }
            }
            r.innerHTML = finalTranscripts + interimTranscripts;
        };

        speechRecognizer.onerror = function (event) {

        };

    }
    else {
        r.innerHTML = 'Your browser is not supported. If google chrome, please upgrade!';
    }
}

function stopConverting() {
    if (isRecoding) {
        ifRecoding = false;
        speechRecognizer.stop();
    }


}
const db = firebase.firestore();

$('#send').click(function () {
    var 저장할거 = {
        내용: $('#content').val(),
        날짜: new Date(),
        유저명: "user",
    }
    if (저장할거.내용 != '') {
        const ok = window.confirm("전송하시겠습니까?");
        if (ok) {
            db.collection('sttdata').add(저장할거).then((result) => {
                window.location.href = '/result.html'
                console.log(result)
            }).catch((error) => {
                alert("에러가 발생했습니다");
                window.location.href = '/index.html'
                console.log(err)
            })
        }
    }
    else {
        alert("공백은 제출할 수 없습니다.");
    }
});    