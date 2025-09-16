<!-- https://wind-town.test/getOTP -->
 <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Get OTPt</title>
    <style>
        body 
        {
            font-family: Arial, sans-serif;
            background-color: rgba(51, 51, 51, 1); /* Nền màu tối */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }

        .register-container 
        {
            width: 400px;
            background-color: #444444; /* Nền form tối hơn */
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .logo
        {
            color: #00fff2;
            font-size: 40px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .title 
        {
            font-size: 20px;
            font-weight: bold;
            color: #1c1e21;
            margin-bottom: 20px;
        }

        .input-group 
        {
            margin-bottom: 15px;
        }

        .input-field 
        {
            width: 100%;
            padding: 14px 10px;
            border: 1px solid #000000;
            border-radius: 6px;
            font-size: 17px;
            color: #00ffeaff;
            box-sizing: border-box;
            background-color: #333333;
            margin-bottom: 15px;
          
        }

        .login-button 
        {
            width: 100%;
            padding: 14px;
            background-color: #079e97;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
        }

        .login-button:hover 
        {
            background-color: #0c7d81;
        }

        .forgot-password 
        {
            display: block;
            margin-top: 15px;
            color: #00fff2;
            text-decoration: none;
            font-size: 14px;
        }

        .divider 
        {
            margin: 20px 0;
            display: flex;
            align-items: center;
            color: #c7d3e4;
            font-size: 14px;
        }

        .divider::before,
        .divider::after {
            content: '';
            flex-grow: 1;
            height: 1px;
            background-color: #ffffff;
        }

        .divider span {
            padding: 0 10px;
        }

        .register-account-button {
            width: 80%;
            padding: 14px;
            background-color: #42b72a;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 17px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .register-account-button:hover {
            background-color: #36a420;
        }
    </style>
</head>
<body>
    <div class="register-container">
        <div class="logo">Get OTP</div>
        <form action="{{ route('getOTP.post') }}" method="POST" >
            @csrf

            @if ($errors->has('getOTP_error'))
            <div style="color: red; margin-bottom: 10px;">
            {{ $errors->first('getOTP_error') }}
            </div>
            @endif
            
            <div class="input-group">
                <input type="text" class="input-field" name="email" placeholder="Email address or phone number">
            </div>
            
            <button type="submit" class="login-button">Continue</button>
        </form>
        <div class="divider"></div>
        <a href="{{ route('login') }}"><span style="color: #00fff2; text-decoration: underline; text-decoration-color: rgb(47, 253, 202); /* đổi màu gạch chân */;">Have an account? Go to login</span></a>
    </div>
</body>
</html>