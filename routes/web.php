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

// Login https://wind-town.test/login
Route::get('/login', [LoginController::class, 'showForm'])->name('login'); 
Route::post('/login', [LoginController::class, 'login'])->name('login.post');

// Register https://wind-town.test/registerAccount
Route::get('/registerAccount', [RegisterAccountController::class, 'showForm'])->name('registerAccount'); 
Route::post('/registerAccount', [RegisterAccountController::class, 'register'])->name('registerAccount.post');

// Password Change https://wind-town.test/passwordChange
Route::get('/passwordChange', [PasswordChangeController::class, 'showForm'])->name('passwordChange'); 
Route::post('/passwordChange', [PasswordChangeController::class, 'login'])->name('passwordChange.post');


// Password Recovery https://wind-town.test/passwordRecovery
Route::get('/passwordRecovery', [PasswordRecoveryController::class, 'showForm'])->name('passwordRecovery'); 
Route::post('/passwordRecovery', [PasswordRecoveryController::class , 'login'])->name('passwordRecovery.post');

// Get OTP  https://wind-town.test/getOTP
Route::get('/getOTP', [GetOTPController::class, 'showForm'])->name('getOTP'); 
Route::post('/getOTP', [GetOTPController::class , 'checkEmail'])->name('getOTP.post');

// Confirm OTP https://wind-town.test/confirmOTP
Route::get('/confirmOTP', [ConfirmOTPController::class, 'showForm'])->name('confirmOTP'); 
Route::post('/confirmOTP', [ConfirmOTPController::class , 'checkOTP'])->name('confirmOTP.post');






use App\Http\Controllers\Models\AttendanceController;
use App\Http\Controllers\Models\ContractController;
use App\http\Controllers\Models\EmployeeContractController;
use App\Http\Controllers\Models\EmployeeController;
use App\Http\Controllers\Models\HierarchyController;
use App\Http\Controllers\Models\LeaveController;
use App\Http\Controllers\Models\PayrollRuleController;
use App\Http\Controllers\Models\SalaryDetailController;

/*
Method	        URL
GET	            /modelController/person
POST	        /modelController/person
GET	            /modelController/person/{id}
PUT/PATCH	    /modelController/person/{id}
DELETE	        /modelController/person/{id}
*/


// 1. attendences
Route::apiResource('/modelController/attendances', AttendanceController::class);

// 2. contracts
Route::get('/dataTables/contracts', function () { return view('fornt/dashboard/dataTables/contracts'); })->name('contracts'); 
Route::apiResource('/modelController/contracts', ContractController::class);
Route::apiResource('/modelController/employees.contracts', EmployeeContractController::class);
Route::get('/modelController/contracts/{id_employee}/activeCheck', [ContractController::class, 'activeCheck'])->name('contractCurrent');



// 3. Employees
Route::get('/dataTables/employees', function () { return view('fornt/dashboard/dataTables/employees'); })->name('employees'); 
Route::apiResource('/modelController/employees', EmployeeController::class);
Route::get('modelController/employees/getColumn/{column}', [EmployeeController::class, 'getEnumColumn'])->name('employees.getEnumColumn');


// 4. hierrachys
Route::get('/dataTables/hierarchys', function () { return view('fornt/dashboard/dataTables/hierarchys'); })->name('hierarchys'); 
Route::apiResource('/modelController/hierarchys', HierarchyController::class);
Route::get('modelController/hierarchys/getColumn/{column}', [HierarchyController::class, 'getEnumColumn'])->name('hierarchys.getEnumColumn');


// 5. leaves
Route::apiResource('/modelController/leaves', LeaveController::class);

// 6. payroll_rule
Route::get('/dataTables/payroll_rules', function () { return view('fornt/dashboard/dataTables/payroll_rules'); })->name('payroll_rules'); 
Route::apiResource('/modelController/payroll_rules', PayrollRuleController::class);


// 7. salary_details
Route::apiResource('/modelController/salary_details', SalaryDetailController::class);
