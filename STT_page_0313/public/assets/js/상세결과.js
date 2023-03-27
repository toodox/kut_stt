var db = firebase.firestore();
var storage = firebase.storage();
var i = 1;
var questionsLen = 0;


window.onload = function() {
    db.collection('questions').get().then(snap => {
        size = snap.size
        questionsLen = size;

    });
    db.collection('questions').doc('users1_questions' + i).get().then((result) => {
        $('#questions').html('<h1 id="Qcon">질문1. ' + result.data().content + '</h1>');
        document.getElementById("Qtype").innerText= result.data().type;
    });
    i ++;
}


$('#after').click(function () {
    db.collection('questions').doc('users1_questions' + i).get().then((result) => {
        if (i - 1 < questionsLen) {
            document.getElementById("Qcon").innerText='질문' + i + '. ' + result.data().content;
            document.getElementById("Qtype").innerText= result.data().type;
            i ++;
        }
        else {
            alert("질문 끝~");
        }
    });
});

$('#before').click(function () {
    db.collection('questions').doc('users1_questions' + i).get().then((result) => {
        if (i -2  > 0) {
            i --;
            document.getElementById("Qcon").innerText='질문' + (i-1) + '. ' + result.data().content;
            document.getElementById("Qtype").innerText= result.data().type;
        }
        else {
            alert("처음 질문~");
        }
    });
});