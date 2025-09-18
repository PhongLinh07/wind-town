<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hierarchy extends Model
{
    protected $table = 'hierarchys';
    protected $primaryKey = 'id_hierarchy';
    public $timestamps = true;

    protected $fillable = [
        'name_position',
        'name_level',
        'salary_multiplier',
        'allowance',
        'description'
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class, 'id_hierarchys');
    }
}

