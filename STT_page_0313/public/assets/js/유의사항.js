var isRecoding = false;
var r = document.getElementById('content');
var speechRecognizer = new webkitSpeechRecognition();

var constraints = { audio: true };
var mediaRecorder;
var chunks = [];
var blob ;
var bloburl;

function startRecording() {
  chunks = [];
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
      }

      mediaRecorder.start();
    })
    .catch(function(err) { 
      console.log(err.name + ": " + err.message); 
    });
    count1 = 1;
}

// function stopRecording() {
//   mediaRecorder.stop();
//   var blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
//   // Do something with the blob, e.g. upload it to a server
// }

function startConverting() {
    startRecording();
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

    speechRecognizer.stop();
    mediaRecorder.stop();
    const blob = new Blob(chunks, {
        'type': 'audio/mp3 codecs=opus'
    })

}
var db = firebase.firestore();
var storage = firebase.storage();


$('#send').click(function () {
  var 저장할거 = {
      내용: $('#content').val(),
      날짜: new Date(),
      유저명: "user",
  }


  if (저장할거.내용 != '' ) {
    var ok = window.confirm("전송하시겠습니까?");
    if (ok) {
      var storageRef = storage.ref();
      var 저장할경로 = storageRef.child('sample/' + new Date()); //추후 유저명+시간으로 음성파일이름 바꿈
      var 업로드작업 = 저장할경로.put(blob);

      db.collection('teststt').add(저장할거).then((result) => {
        window.location.href = '/모의면접.html'
        console.log(result)
        alert("정상동작 하였습니다.");
      }).catch((error) => {
        alert("에러가 발생했습니다");
        window.location.href = '/유의사항.html'
        console.log(error)
      })
    }
<<<<<<< Updated upstream
  }
  else if (저장할거.내용 == '') {
    alert("공백은 제출할 수 없습니다.");
  }
  else {
    alert("제출하는 중 에러가 발생했습니다.");
  }
});
=======
    // var file = document.querySelector('#mp3').files[0];
    // var storageRef = storage.ref();
    // var 저장할경로 = storageRef.child('voicedata/' + new Date()); //추후 유저명+시간으로 음성파일이름 바꿈
    // var 업로드작업 = 저장할경로.put(file)
    // var fileCK = $("#mp3").val();
    if (저장할거.내용 != '') //&& fileCK
    {
        const ok = window.confirm("전송하시겠습니까?");
        if (ok) {
            db.collection('sttdata').add(저장할거).then((result) => {
                window.location.href = '/모의면접.html' //다음문제로넘어가게
                console.log(result)
                alert("제출되었습니다.");
            }).catch((error) => {
                alert("에러가 발생했습니다");
                window.location.href = '/유의사항.html'
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
    else 
    { 
      alert("제출하는 중 에러가 발생했습니다.");
    }
});    
>>>>>>> Stashed changes
