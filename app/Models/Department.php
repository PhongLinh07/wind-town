<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';
    protected $primaryKey = 'id_department';
    protected $fillable = ['name', 'description'];

    public function employees()
    {
        return $this->hasMany(Employee::class, 'id_department', 'id_department');
    }
}
