<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $table = 'leaves';
    protected $primaryKey = 'id_leave';
    protected $fillable = ['id_employee', 'start_date', 'end_date', 'type', 'reason', 'status', 'description'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee', 'id_employee');
    }
}
