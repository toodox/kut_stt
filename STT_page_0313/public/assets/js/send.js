// const userInfo = {
//     email : 
// }

// 전달할 데이터
const email = document.getElementById('userem');
console.log(email.textContent);

email.addEventListener('click', () => {
    localStorage.setItem("email",email.textContent);
});