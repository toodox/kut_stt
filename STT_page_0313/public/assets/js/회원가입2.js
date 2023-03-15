//-------- HTML 요소 셀렉팅 ---------//

const elInputUsername = document.querySelector('#username');

const elFailureMessage = document.querySelector('.failure-message');
const elSuccessMessage = document.querySelector('.success-message');

const elPassword = document.querySelector('#password');
const elPasswordRetype = document.querySelector('#password-retype');

const elPWRetypeFailureMsg = document.querySelector('.mismatch-message');
const elPWRetypeSuccessMsg = document.querySelector('.match-message');

const elPWFailureLeng = document.querySelector('.password-failure-length');
const elPWFailureComb = document.querySelector('.password-failure-comb');
const elPWFailureContn = document.querySelector('.password-failure-contn');
const elPWFailureUpper = document.querySelector('.password-failure-upper');
const elPWSuccessMessage = document.querySelector('.password-success-message');

const elSubmitButton = document.querySelector('#subit-button');

//-------- 유효성 검사 ---------//

// { 아이디 } input 유효성 검사
function usernameFn() {
  /*
  if( isMoreThan4Length(elInputUsername.value) ) {
    //console.log('4보다 길다..')
  } else {
    //console.log('4보다 짧다...!!!')
  }
  
  if( isUserNameChar(elInputUsername.value) ) {
    //console.log('가능한 것만 있네!');
  } else {
    //console.log('안되는 것도 있네?');
  }
  */

  if( isMoreThan4Length(elInputUsername.value) && isUserNameChar(elInputUsername.value) ) {
    elSuccessMessage.classList.remove('hide'); 
    elFailureMessage.classList.add('hide')
  } else {
    elFailureMessage.classList.remove('hide'); 
    elSuccessMessage.classList.add('hide'); 
  }

  isSubmitButton();
}

elInputUsername.addEventListener('click', usernameFn);
elInputUsername.addEventListener('keyup', usernameFn);

// { 비밀번호 } input 유효성 검사  
function passwordFn () {

  if( isMoreThan10Length(elPassword.value) ) {
    elPWFailureLeng.classList.add('hide');
  } else {
    elPWFailureLeng.classList.remove('hide');
  }

  /*
  if( isPasswordEng(elPassword.value) ) {
    console.log('영어가 있다..');
  } else {
    console.log('영어가 없다...!!!');
  }
  
  if( isPasswordNum(elPassword.value) ) {
    console.log('숫자가 있다..');
  } else {
    console.log('숫자가 없다...!!!');
  }
  if( isPasswordSpeci(elPassword.value) ) {
    console.log('특수문자가 있다..');
  } else {
    console.log('특수문자가 없다...!!!');
  }
  if( isPasswordBlank(elPassword.value) ) {
    console.log('공백이 없다..');
  } else {
    console.log('공백이 있다...!!!');
  }
  */

  if( (isPasswordEng(elPassword.value) + isPasswordNum(elPassword.value) + isPasswordSpeci(elPassword.value) >= 2) &&
      (isPasswordBlank(elPassword.value)) &&
      (isPasswordChar(elPassword.value)) 
    ) {
    elPWFailureComb.classList.add('hide');
  } else {
    elPWFailureComb.classList.remove('hide');
  }

  if( isPasswordRepeat(elPassword.value) ) {
    elPWFailureContn.classList.remove('hide');
  } else {
    elPWFailureContn.classList.add('hide');
  }

  if( (isPasswordUpper(elPassword.value)) ) {
    elPWFailureUpper.classList.add('hide');
  } else {
    elPWFailureUpper.classList.remove('hide');
  }

  if( (isMoreThan10Length(elPassword.value)) && 
      (isPasswordEng(elPassword.value) + isPasswordNum(elPassword.value) + isPasswordSpeci(elPassword.value) >= 2) && 
      (isPasswordChar(elPassword.value)) && 
      (isPasswordBlank(elPassword.value)) && 
      (!isPasswordRepeat(elPassword.value)) && 
      ((isPasswordUpper(elPassword.value)))
    ) {
    elPWSuccessMessage.classList.remove('hide');
  } else {
    elPWSuccessMessage.classList.add('hide');
  }

  isSubmitButton();
}

elPassword.addEventListener('click', passwordFn)
elPassword.addEventListener('keyup', passwordFn)
elPassword.addEventListener('keyup', passwordRetypeFn)

// { 비밀번호 확인 } input 유효성 검사
function passwordRetypeFn() {
  if( isMatch(elPassword.value, elPasswordRetype.value) && isPasswordBlank(elPasswordRetype.value) ) {
    //console.log('두 비밀번호가 동일하다..');
    elPWRetypeFailureMsg.classList.add('hide');
    elPWRetypeSuccessMsg.classList.remove('hide');
  } else {
    //console.log('두 비밀번호가 다르다...!!!');
    elPWRetypeFailureMsg.classList.remove('hide');
    elPWRetypeSuccessMsg.classList.add('hide');
  }

  isSubmitButton();
}

elPasswordRetype.onclick = passwordRetypeFn;
elPasswordRetype.onkeyup = passwordRetypeFn;

//-------- 최종 유효성 검사에서 사용하는 함수다 ---------//

// 모든 조건이 충족되었는지 확인하는 함수
function isAllCheck() {
  if( isMoreThan4Length(elInputUsername.value)&& isUserNameChar(elInputUsername.value) ) { // 아이디
    if( (isMoreThan10Length(elPassword.value)) && 
        (isPasswordEng(elPassword.value) + isPasswordNum(elPassword.value) + isPasswordSpeci(elPassword.value) >= 2) &&
        (isPasswordChar(elPassword.value)) &&
        (isPasswordBlank(elPassword.value)) && 
        (!isPasswordRepeat(elPassword.value)) && 
        ((isPasswordUpper(elPassword.value)))
      ) { // 비밀번호
      if( isMatch(elPassword.value, elPasswordRetype.value) ) { // 비밀번호 확인
        //console.log('true!!');
        return true;
      }
    }
  } else {
    //console.log('false!!');
    return false;
  }
}

// [회원가입 버튼] 배경 활성화 함수
function isSubmitButton() {
  if( isAllCheck() ) {
    elSubmitButton.classList.add('allCheck');
  }
  else {
    elSubmitButton.classList.remove('allCheck');
  }
}

// [회원가입 버튼] 클릭 이벤트 함수
elSubmitButton.onclick = function() {
  if( isAllCheck() ) {
    //alert('회원가입이 완료되었습니다!');
    elSubmitButton.classList.remove('allCheck');

    var db = firebase.firestore();
    var storage = firebase.storage();
  }
  
  else {
    alert('모든 조건이 충족되어야합니다.');
  }
};

//-------- 유효성 검사에서 사용하는 함수다 ---------//
// [아이디] 길이가 4자 이상이면 true를 리턴하는 함수
function isMoreThan4Length(value) {
  // 아이디 입력창에 사용자가 입력을 할 때 
  // 글자 수가 4개이상인지 판단한다.
  // 글자가 4개 이상이면 success메세지가 보여야 한다.
  return value.length >= 4;
}
// [아이디] 이메일 형식이면 true를 리턴하는 함수
function isUserNameChar(username) {
  var letters = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

  if( username.match(letters) ) {
    return true;
  } else {   
    return false;
  }
}

// [비밀번호] 길이가 10자 이상이면 true를 리턴하는 함수
function isMoreThan10Length (password) {
  return password.length >= 8;
}

// [비밀번호] 영문이 있으면 true를 리턴하는 함수
function isPasswordEng (password) {
  var letters = /[A-Za-z]/; // 잘 모르겠지만 이것은 정규표현식으로 AZ - az 모든 알파벳을 담고 있다.
  
  if( letters.test(password) ) {  // 정규표현식에 영어문자가 모두 들었고. 정규표현식의 메소드인 test()로 비밀번호 문자에 영어가 있는지 판단한다.
    return true;
  } else {
    return false;
  }
}

// [비밀번호] 숫자가 있으면 true를 리턴하는 함수
function isPasswordNum (password) {
  var letters = /[0-9]/;
  
  if( letters.test(password) ) {
    return true;
  } else {
    return false;
  }
}

// [비밀번호] 특수문자가 있으면 true를 리턴하는 함수
function isPasswordSpeci (password) {
  var letters = /[~!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?]/;
  
  if( letters.test(password) ) {
    return true;
  } else {
    return false;
  }
}

// [비밀번호][비밀번호 확인] 스페이스가 없을 경우 true를 리턴하는 함수
function isPasswordBlank (password) {
  if( password.search(/\s/) === -1 ) {
    return true;
  } else {
    return false;
  }
}

// [비밀번호] '영문, 숫자, 특수문자'만 있으면 true를 리턴하는 함수
function isPasswordChar(password) {
  var letters = /^[A-Za-z0-9~!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?]+$/;

  if( password.match(letters) ) {
    //console.log('가능한 것만 있네!');
    return true;
  } else {
    //console.log('안되는 것도 있네?');
    return false;
  }
}

// [비밀번호] 동일한 숫자 3개 이상 연속 사용하면 true를 리턴하는 함수
function isPasswordRepeat (password) {
  // password의 길이만큼 반복되는 반복문이 있어야 한다.
  // 문자 하나와 나 자신+1과 나자신 +2와 비교한다.
  // 숫자인지 아닌지 판단한다.숫자이면 true 아니면 false
  for( let i=0; i<password.length-2; i++ ) {
    if( password[i]===password[i+1] && password[i]===password[i+2] ) {
      if( !isNaN(Number(password[i])) ) {
        return true;
      }
    }
  }
  return false;
}

// [비밀번호] 영문자 중에 대문자 하나이상 포함되면 true를 리턴하는 함수
function isPasswordUpper (password) {
  var letters = /[A-Z]/; 
  
  if( letters.test(password) ) { 
    return true;
  } else {
    return false;
  }
}

// [비밀번호 확인] 매치가 동일하면 true를 리턴하는 함수
function isMatch (password1, password2) {
  if( password1 && password2 ) {
    if(password1 === password2) {
      return true;
    }
  } else {
    return false;
  }
}