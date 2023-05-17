// const userInfo = {
//     email : 
// }

// 전달할 데이터
// us 클래스인  a태그가 클릭되면
$(".us").on('click', function (e) {
    console.log(e.target.id)
    const email = document.getElementById(e.target.id);     //클릭된 a태그의 id를 가져온다
    console.log(email.textContent);
    localStorage.setItem("email", email.textContent);
});
