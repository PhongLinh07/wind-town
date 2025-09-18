<?php
use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\Login\RegisterAccountController;
use App\Http\Controllers\Login\PasswordChangeController;
use App\Http\Controllers\Login\PasswordRecoveryController;
use App\Http\Controllers\Login\ConfirmOTPController;
use App\Http\Controllers\Login\GetOTPController;

/*
|-------------------------Forgot password?---------------------------
| forgot password -> get OTP -> confirm OTP -> change password
|--------------------------------------------------------------------------
*/

// Dashboard
Route::get('/dashboard', function () { return view('fornt/dashboard/dashboard'); })->name('dashboard'); // file resources/views/welcome.blade.php 

// Data Tables
Route::get('/dataTables', function () { return view('fornt/dashboard/dataTables'); })->name('dataTables'); // file resources/views/welcome.blade.php 

// Login
Route::get('/login', [LoginController::class, 'showForm'])->name('login'); 
Route::post('/login', [LoginController::class, 'login'])->name('login.post');

// Register
Route::get('/registerAccount', [RegisterAccountController::class, 'showForm'])->name('registerAccount'); 
Route::post('/registerAccount', [RegisterAccountController::class, 'register'])->name('registerAccount.post');

// Password Change
Route::get('/passwordChange', [PasswordChangeController::class, 'showForm'])->name('passwordChange'); 
Route::post('/passwordChange', [PasswordChangeController::class, 'login'])->name('passwordChange.post');


// Password Recovery
Route::get('/passwordRecovery', [PasswordRecoveryController::class, 'showForm'])->name('passwordRecovery'); 
Route::post('/passwordRecovery', [PasswordRecoveryController::class , 'login'])->name('passwordRecovery.post');

// Get OTP
Route::get('/getOTP', [GetOTPController::class, 'showForm'])->name('getOTP'); 
Route::post('/getOTP', [GetOTPController::class , 'checkEmail'])->name('getOTP.post');

// Confirm OTP
Route::get('/confirmOTP', [ConfirmOTPController::class, 'showForm'])->name('confirmOTP'); 
Route::post('/confirmOTP', [ConfirmOTPController::class , 'checkOTP'])->name('confirmOTP.post');






use App\Http\Controllers\Models\AttendanceController;
use App\Http\Controllers\Models\ContractController;
use App\Http\Controllers\Models\EmployeeController;
use App\Http\Controllers\Models\HierarchyController;
use App\Http\Controllers\Models\LeaveController;
use App\Http\Controllers\Models\PayrollRuleController;
use App\Http\Controllers\Models\SalaryDetailController;

/*
Method	        URL
GET	            /dataTables/person
POST	        /dataTables/person
GET	            /dataTables/person/{id}
PUT/PATCH	    /dataTables/person/{id}
DELETE	        /dataTables/person/{id}
*/


// 1. attendences
Route::apiResource('/dataTables/attendances', AttendanceController::class);

// 2. contracts
Route::apiResource('/dataTables/contracts', ContractController::class);

// 3. Employees
Route::apiResource('/dataTables/employees', EmployeeController::class);

// 4. hierrachys
Route::apiResource('/dataTables/hierarchys', HierarchyController::class);

// 5. leaves
Route::apiResource('/dataTables/leaves', LeaveController::class);

// 6. payroll_rule
Route::apiResource('/dataTables/payroll_rules', PayrollRuleController::class);

// 7. salary_details
Route::apiResource('/dataTables/salary_details', SalaryDetailController::class);

