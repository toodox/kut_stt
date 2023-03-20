var isRecording = false;
var r = document.getElementById('content');
var speechRecognizer = new webkitSpeechRecognition();

var storage = firebase.storage();
var storageRef = storage.ref();
var fileToUpload = null;

function startConverting() {
  isRecording = true;
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
        } else {
          interimTranscripts += transcript;
        }
      }
      r.innerHTML = finalTranscripts + interimTranscripts;
    };

    speechRecognizer.onerror = function (event) {
      console.error(event);
    };

    speechRecognizer.onend = function () {
      isRecording = false;
    };
  } else {
    r.innerHTML = 'Your browser is not supported. If google chrome, please upgrade!';
  }
}

function stopConverting() {
<<<<<<< Updated upstream
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
=======
  if (isRecording) {
    speechRecognizer.stop();
  }
}

$('#send').click(function () {
    var 저장할거 = {
      내용: $('#content').val(),
      날짜: new Date(),
      유저명: "user",
    }
  
    if (저장할거.내용 != '') {
      const ok = window.confirm("전송하시겠습니까?");
      if (ok) {
        // 업로드할 파일이 있을 경우에만 업로드 수행
        if (fileToUpload) {
          var 저장할경로 = storageRef.child('voicedata/' + new Date() + '.mp3'); // 추후 유저명+시간으로 음성파일 이름 변경
          var 업로드작업 = 저장할경로.put(fileToUpload);
  
          업로드작업.on('state_changed', 
            function progress(snapshot) {
              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + percentage + '% done');
            }, 
            function error(error) {
              console.error(error);
              alert("파일 업로드에 실패했습니다.");
            }, 
            function complete() {
              console.log('Upload completed');
              // 업로드 완료 후 데이터베이스에 저장
              저장할경로.getDownloadURL().then(function (url) {
                저장할거['음성파일'] = url;
                db.collection('sttdata').add(저장할거).then((result) => {
                  window.location.href = '/모의면접.html' //다음문제로넘어가게
                  console.log(result)
                  alert("제출되었습니다.");
                }).catch((error) => {
                  alert("에러가 발생했습니다");
                  window.location.href = '/유의사항.html'
                  console.log(error)
                })
              });
            }
          );
        } else {
          // 업로드할 파일이 없는 경우
          db.collection('sttdata').add(저장할거).then((result) => {
            window.location.href = '/모의면접.html' //다음문제로넘어가게
            console.log(result)
            alert("제출되었습니다.");
          }).catch((error) => {
            alert("에러가 발생했습니다");
            window.location.href = '/유의사항.html'
            console.log(error)
          });
        }
      }
    } else {
      alert("공백은 제출할 수 없습니다.");
    }
  });
  
>>>>>>> Stashed changes
