var isRecoding = false;
var r = document.getElementById('content');
var speechRecognizer = new webkitSpeechRecognition();
var db = firebase.firestore();
var storage = firebase.storage();
var user = firebase.auth().currentUser;
var constraints = { audio: true };
var mediaRecorder;
var chunks = [];
var blob;
var bloburl;

function startRecording() {
    chunks = [];
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(mediaStream) {
        mediaRecorder = new MediaRecorder(mediaStream);
  
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
          if (mediaRecorder.state == 'inactive') {
            blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            // Do something with the blob object, such as uploading it to the server
          }
        }
  
        mediaRecorder.start();
      })
      .catch(function(err) { 
        console.log(err.name + ": " + err.message); 
      });
  }
  
  function startConverting() {
    startRecording();
    r.innerHTML = '';
    if ('webkitSpeechRecognition' in window) {
      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = true;
      speechRecognizer.lang = 'ko-KR';
      speechRecognizer.start();
  
      var finalTranscripts = '';
  
      speechRecognizer.onresult = function(event) {
        var interimTranscripts = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var transcript = event.results[i][0].transcript;
          transcript.replace("\n", "<br>");
          if (event.results[i].isFinal) {
            finalTranscripts += transcript;
          } else {
            interimTranscripts += transcript;
          }
        }
        r.innerHTML = finalTranscripts + interimTranscripts;
      };
  
      speechRecognizer.onerror = function(event) {};
    } else {
      r.innerHTML = 'Your browser is not supported. If google chrome, please upgrade!';
    }
  }
  
  function stopConverting() {
    speechRecognizer.stop();
    mediaRecorder.stop();
  }


function createObject(object, variableName) {
    let execString = variableName + " = object"
    console.log("Running '" + execString + "'");
    eval(execString)
}


var db = firebase.firestore();
var storage = firebase.storage();
var i = 1;
var questionsLen = 0;
var pbclass = 'class="progress-bar progress-bar-striped progress-bar-animated" ';
var pbrole = 'role="progressbar" ';
var pbfstyle = 'style="width: ';
var pbfvnow = '%" aria-valuenow="0"';
var pbfvmin = ' aria-valuemin="0"';
var pbfvmax = ' aria-valuemax="100"';


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
        document.getElementById("Qtype").innerText= result.data().type;
    });
    i ++;
}

$('#send').click(function () {
    var check = pyodideGlobals.get('spellChecker');
    db.collection('questions').doc('users1_questions' + i).get().then((result) => {
        if (i - 1 < questionsLen) {
            var 저장할거 = {
                수정전내용: $('#content').val(),
                날짜: new Date(),
                수정후내용: check($('#content').val()),
            }
            if (저장할거.수정전내용 != '') //&& fileCK
            {
                var ok = window.confirm("다음 단계로 넘어가시겠습니까?");
                if (ok) {
                    var storageRef = storage.ref();
                    var user = firebase.auth().currentUser;
                    var 저장할경로 = storageRef.child('voicedata/' + user.email + " " + (i - 1) + "번 질문");
                    var 업로드작업 = 저장할경로.put(blob);
                    document.getElementById("Qcon").innerText='질문' + i + '. ' + result.data().content;
                    document.getElementById("Qtype").innerText= result.data().type;
                    i ++;
                    var currP = 100 * (i-2) / questionsLen;
                    $('#QProgress').html('<div ' + 
                    pbclass + pbrole + 
                    pbfstyle + currP + 
                    pbfvnow + pbfvmin + pbfvmax + '></div>');

                    // 사용자가 답변한 내용을 저장할 때 각 문서의 이름 =
                    // 유저명+질문유형+질문번호+(year month day hour minute second)?
                    db.collection('teststt').doc(user.email + (i - 2)+ "번 질문").set(저장할거).then((result) => {
                        console.log(result)
                        r.innerHTML='';
                        alert("정상동작 하였습니다.");
                    }).catch((error) => {
                        alert("에러가 발생했습니다");
                        
                        console.log(err)
                    })
                }
            }
            else if (저장할거.수정전내용 == '') {
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