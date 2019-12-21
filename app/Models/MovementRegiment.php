<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovementRegiment extends Model
{
    protected $table = 'movement_regiment';

    protected $fillable = [
        'movement_id',
        'regiment_id',
        'size'
    ];

    public $timestamps = false;

    public function regiment()
    {
        return $this->belongsTo('App\Models\Regiment');
    }
}
