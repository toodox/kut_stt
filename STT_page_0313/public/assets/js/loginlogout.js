<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/signin.css">
    <title>STT | 로그인</title>
</head>

<body class="text-center" cz-shortcut-listen="true">
    <!-- 파이어베이스 관련 스크립트 -->
    <script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-storage.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>


    <script src="https://code.jquery.com/jquery-3.6.3.min.js" 
    integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" 
    crossorigin="anonymous"></script>
    <script src="assets/js/firebaseset.js"></script>
    <!-- 파이어베이스 관련 스크립트 -->

    <!-- 파이어베이스 관련 스크립트 -->
    <main class="form-signin w-100 m-auto">
        <form>
            <a href="index.html">
                <img class="mb-4" src="assets/image/로고.png" alt="" width="250" height="auto">                
            </a>
            <h1 class="h3 mb-3 fw-normal">로그인</h1>

            <div class="form-floating">
                <input type="email" class="form-control" id="username" placeholder="name@example.com">
                <label for="username">Email address</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="password" placeholder="Password">
                <label for="password">Password</label>
            </div>

            <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"> Remember me
                </label>
            </div>
            <button class="w-100 btn btn-lg btn-primary" type="submit" id="signInButton">Sign in</button>

            <footer class="py-3 my-4">
                <ul class="nav justify-content-center border-bottom pb-3 mb-3"></ul>
                <p class="text-center text-muted">© 2023 KOREATECH, Univ</p>
            </footer>
        </form>
    </main>
    <script>

        var auth = firebase.auth();

        // document.getElementById('signUpButton').addEventListener('click', (event) => {
        //     event.preventDefault()
        //     const signUpEmail = document.getElementById('signUpEmail').value
        //     const signUpPassword = document.getElementById('signUpPassword').value

        //     createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        //         .then((userCredential) => {
        //             console.log(userCredential)
        //             // Signed in
        //             const user = userCredential.user;
        //             // ...
        //         })
        //         .catch((error) => {
        //             console.log('error')
        //             const errorCode = error.code;
        //             const errorMessage = error.message;
        //             // ..
        //         });

        // })

        document.getElementById('signInButton').addEventListener('click', (event) => {
            event.preventDefault()
            if(!username || !password){
                alert("공백은 제출할 수 없습니다.")
            }
            var signInEmail = document.getElementById('username').value
            var signInPassword = document.getElementById('password').value

            auth.signInWithEmailAndPassword(signInEmail, signInPassword)
                .then((userCredential) => {
                    // Signed in
                    console.log('로그인 성공')
                    console.log(userCredential)
                    var user = userCredential.user;
                    alert("로그인 성공");
                    window.location.href = '/index.html'
                    // ...
                })
                .catch((error) => {
                    console.log('로그인 실패')
                    alert("로그인 실패");
                    var errorCode = error.code;
                    var errorMessage = error.message;
                });

        })
    </script>
</body>

<!-- <body class="text-center" cz-shortcut-listen="true">
    <main class="form-signin w-100 m-100">
        <form class="m-500">
            <a href="index.html">
                <img class="mb-4" src="assets/image/로고.png" alt="" width="auto" height="57">
            </a>
            <h1 class="h3 mb-3">로그인</h1>

            <div class="form-floating">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
                <label for="floatingPassword">Password</label>
            </div>

            <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"> Remember me
                </label>
            </div>
            <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            <p class="mt-5 mb-3 text-muted">© 2017–2023</p>
        </form>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body> -->

</html>