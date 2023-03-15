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
        isRecoding = false;
        speechRecognizer.stop();
    }


}
var db = firebase.firestore();
var storage = firebase.storage();
var i = 1;
var questionsLen = 0;
var pbclass = 'class="progress-bar progress-bar-striped progress-bar-animated" ';
var pbrole = 'role="progressbar" ';
var pbfstyle = 'style="width: ';
var pbfvnow = '%" aria-valuenow="0"';
var pbfvmin = ' aria-valuemin="0"'
var pbfvmax = ' aria-valuemax="100"'

window.onload = function() {
    db.collection('questions').get().then(snap => {
        size = snap.size
        questionsLen = size;

        var currP = 0;
        $('#QProgress').html('<div ' + 
        pbclass + pbrole + 
        pbfstyle + currP + 
        pbfvnow + pbfvmin + pbfvmax + '></div>');
    });
    db.collection('questions').doc('users1_questions' + i).get().then((result) => {
        $('#questions').html('<h1 id="Qcon">질문1. ' + result.data().content + '</h1>');
    });
    i ++;
}

$('#send').click(function () {
    db.collection('questions').doc('users1_questions' + i).get().then((result) => {
        if (i - 1 < questionsLen) {
            document.getElementById("Qcon").innerText='질문' + i + '. ' + result.data().content;
            i ++;
            var currP = 100 * (i-2) / questionsLen;
            $('#QProgress').html('<div ' + 
            pbclass + pbrole + 
            pbfstyle + currP + 
            pbfvnow + pbfvmin + pbfvmax + '></div>');

            var 저장할거 = {
                내용: $('#content').val(),
                날짜: new Date(),
                유저명: "user",
            }
            // var file = document.querySelector('#mp3').files[0];
            // var storageRef = storage.ref();
            // var 저장할경로 = storageRef.child('voicedata/' + new Date()); //추후 유저명+시간으로 음성파일이름 바꿈
            // var 업로드작업 = 저장할경로.put(file)
            // var fileCK = $("#mp3").val();
            if (저장할거.내용 != '') //&& fileCK
            {
                const ok = window.confirm("전송하시겠습니까?");
                if (ok) {
                    db.collection('teststt').add(저장할거).then((result) => {
                        
                        console.log(result)
                        alert("정상동작 하였습니다.");
                    }).catch((error) => {
                        alert("에러가 발생했습니다");
                        
                        console.log(err)
                    })
                }
            }
            else if (저장할거.내용 == ''){
                alert("공백은 제출할 수 없습니다.");
            }
            // else if(!fileCK)
            // {
            //   alert("음성파일이 등록되지 않았습니다.");
            // }
            else { 
              alert("제출하는 중 에러가 발생했습니다.");
            }
        }
        else {
            var currP = 100;
            $('#QProgress').html('<div ' + 
            pbclass + pbrole + 
            pbfstyle + currP + 
            pbfvnow + pbfvmin + pbfvmax + '></div>');
            setTimeout(function() {
                alert("end of questions");
                window.location.href = '/완료및제출.html'
            }, 500);
        }
    });
});