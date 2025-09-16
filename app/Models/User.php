<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;

    protected $table = 'users';
    protected $primaryKey = 'id_user';
    protected $fillable = ['id_employee', 'email', 'password', 'id_role', 'description'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee', 'id_employee');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }
}
