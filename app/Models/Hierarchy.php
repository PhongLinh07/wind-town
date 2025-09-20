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

    public static function tableName()
    {
        return (new static)->getTable(); // getTable() là method của Eloquent Model
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'id_hierarchy');
    }
}

