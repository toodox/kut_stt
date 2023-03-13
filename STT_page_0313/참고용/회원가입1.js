window.addEventListener(
  "load",
  () => {
    const forms = document.getElementsByClassName("validation-form");

    Array.prototype.filter.call(forms, (form) => {
      form.addEventListener(
        "submit",
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  },
  false
);

// //아이디 유효성 검사
// let isidkValid = false;
// // id 가 nick 인 input 요소에 input 이벤트가 일어났을때 실행할 함수 등록
// document.querySelector("#ID").addEventListener("input", function () {
//   //1. 입력한 value 값을 읽어온다.
//   let inputNick = this.value;
//   //2. 유효성(5글자이상 10글자 이하)을 검증한다.
//   isidkValid = inputNick.length >= 5 && inputNick.length <= 20;
//   //3. 유효하다면 input 요소에 is-valid 클래스 추가, 아니라면 is-invalid 클래스 추가
//   if (isidkValid) {
//     this.classList.remove("is-invalid");
//     this.classList.add("is-valid");
//   } else {
//     this.classList.remove("is-valid");
//     this.classList.add("is-invalid");
//   }
// });

// let ispwValid = false;
// // id 가 nick 인 input 요소에 input 이벤트가 일어났을때 실행할 함수 등록
// document.querySelector("#ID").addEventListener("input", function () {
//   //1. 입력한 value 값을 읽어온다.
//   let inputNick = this.value;
//   //2. 유효성(5글자이상 10글자 이하)을 검증한다.
//   let regpw = /^(?=,*[a-zA-Z])(?=,*[0-9]),{8,15}$/;
//   //3. 유효하다면 input 요소에 is-valid 클래스 추가, 아니라면 is-invalid 클래스 추가
//   if (!regpw) {
//     this.classList.remove("is-invalid");
//     this.classList.add("is-valid");
//   } else {
//     this.classList.remove("is-valid");
//     this.classList.add("is-invalid");
//   }
// });
