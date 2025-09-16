<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';
    protected $primaryKey = 'id_project';
    protected $fillable = ['name', 'start_date', 'end_date', 'status', 'description'];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'assignments', 'id_project', 'id_employee')
                    ->withPivot('role', 'assigned_date', 'description', 'created_at', 'updated_at');
    }
}
