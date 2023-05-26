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

      db.collection('u_' + userName + '_' + type).doc(userName + type + 1).get()
        .then(result => {
          const checkanswer = result.data().수정전내용;
          if (checkanswer) {
            window.location.href = "/results";
          } else {
            swal({
              title: "Error",
              text: "진행되지 않은 면접입니다.",
              icon: "error", //"info,success,warning,error" 중 택1
            });
          }
        }).catch(error => {
          swal({
            title: "Error",
            text: "진행되지 않은 면접입니다.",
            icon: "error", //"info,success,warning,error" 중 택1
          });
          console.log(error);
        });
    }
  } else {
    swal({
      title: "Login",
      text: "로그인이 필요한 서비스입니다.",
      icon: "warning", //"info,success,warning,error" 중 택1
    }).then((ok) => {
        if (ok) {
            window.location.href = '/Login';
        /* "YES"클릭시 로직 */
        }
    });
  }
});
