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






use App\Http\Controllers\Models\DepartmentController;
use App\Http\Controllers\Models\PositionController;
use App\Http\Controllers\Models\EmployeeController;
use App\Http\Controllers\Models\EmployeeManagerController;
use App\Http\Controllers\Models\RoleController;
use App\Http\Controllers\Models\UserController;
use App\Http\Controllers\Models\AttendanceController;
use App\Http\Controllers\Models\SalaryController;
use App\Http\Controllers\Models\ProjectController;
use App\Http\Controllers\Models\AssignmentController;
use App\Http\Controllers\Models\LeaveController;
use App\Http\Controllers\Models\PerformanceReviewController;



/*
Method	        URL
GET	            /dataTables/person
POST	        /dataTables/person
GET	            /dataTables/person/{id}
PUT/PATCH	    /dataTables/person/{id}
DELETE	        /dataTables/person/{id}
*/


// 1. Departments
Route::apiResource('/dataTables/departments', DepartmentController::class);

// 2. Positions
Route::apiResource('/dataTables/positions', PositionController::class);

// 3. Employees
Route::apiResource('/dataTables/employees', EmployeeController::class);

// 4. Employee Manager (quản lý nhân viên)
Route::apiResource('/dataTables/employee_manager', EmployeeManagerController::class);

// 5. Roles
Route::apiResource('/dataTables/roles', RoleController::class);

// 6. Users / Accounts
Route::apiResource('/dataTables/users', UserController::class);

// 7. Attendances
Route::apiResource('/dataTables/attendances', AttendanceController::class);

// 8. Salaries
Route::apiResource('/dataTables/salaries', SalaryController::class);

// 9. Projects
Route::apiResource('/dataTables/projects', ProjectController::class);

// 10. Assignments (Phân công)
Route::apiResource('/dataTables/assignments', AssignmentController::class);

// 11. Leaves
Route::apiResource('/dataTables/leaves', LeaveController::class);

// 12. Performance Reviews
Route::apiResource('/dataTables/performance_reviews', PerformanceReviewController::class);
