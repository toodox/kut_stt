const db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const userName = user.email.split("@")[0];

    ["A", "B", "C", "GPT"].forEach(type => {
      document.getElementById(`type${type}`).addEventListener("click", e => {
        e.preventDefault();
        saveSelectedType(type, userName);
      });
    });

    function saveSelectedType(type, userName) {
      localStorage.setItem("resultType", type);

      db.collection('answer').doc(userName + type + 1).get()
        .then(result => {
          const checkanswer = result.data().수정전내용;
          if (checkanswer) {
            window.location.href = "/results";
          } else {
            alert("진행되지 않은 면접입니다");
          }
        }).catch(error => {
          alert("진행되지 않은 면접입니다");
          console.log(error);
        });
    }
  } else {
    alert("로그인이 필요한 서비스입니다.");
    window.location.href = "/login";
  }
});
