<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Administrator</title>
  <link href="/css/login.css" rel="stylesheet">

  
</head>

<body>
          @if(session('passwordRecovery_success'))
          <div id="flash-msg" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 9999;
            ">
            {{ session('passwordRecovery_success') }}

            </div>
            <script>
                setTimeout(() => { document.getElementById('flash-msg')?.remove(); }, 3000); // tự động biến mất sau 3s
            </script>
            @endif

             @if ($errors->has('login_error'))
            <div style="color: red; margin-bottom: 10px;">
            {{ $errors->first('login_error') }}
            </div>
            @endif

        <div class="container">
        <div class="login-box">
        <div class="graphic-side">
            <div class="graphic">
            <img src="https://th.bing.com/th/id/OIP.KrfL4ue5ob2st0-7B5L9PAHaEK?w=304&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
                alt="Laptop Icon" />
            <div class="shapes">
                <span class="circle"></span>
                <span class="square"></span>
                <span class="triangle"></span>
            </div>
            </div>
        </div>
        <div class="form-side">
        <h2>Admin Login</h2>


        <form action="{{ route('login.post') }}" method="POST">  @csrf
        
          <div class="input-group">
            <span class="icon">📧</span>
            <input type="email" name="email" placeholder="Email" >
          </div>
          <div class="input-group">
            <span class="icon">🔒</span>
            <input type="password" name="password" placeholder="Password">
          </div>
          <button type="submit">LOGIN</button>
        </form>
        <a href="{{ route('getOTP') }}" class="forgot-password">Forgot password?</a>
        <form action="{{ route('registerAccount') }}" method="GET">
            <button class="create-account-button">Register new account</button>
        </form>
      </div>
    </div>
  </div>
<script src="/fontend/js/login.js"></script>
</body>

</html>
