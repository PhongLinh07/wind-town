<?php

namespace App\Http\Controllers\Login;
use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // ⚡ phải thêm dòng này

class GEtOTPController extends Controller
{
    // Hiển thị form đăng nhập
    public function showForm() 
    {
        return view('fornt.login.getOTP'); // Trả về view Blade: resources/views/backend/login.blade.php
    }

    // Xử lý form đăng nhập
    public function checkEmail (Request $request) 
    {
        $validate  = Validator::make
        (
            $request->only('email'),
            ['email' => 'required|email']
        );

        if ($validate ->fails()) 
        {
            return back()->withErrors(['getOTP_error' => 'Invalid or incorrect information']);
        }

        return redirect()->route('confirmOTP'); // Chuyển tới trang dashboard
    }
}
