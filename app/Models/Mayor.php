<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mayor extends Model
{
    protected $table = 'mayor';

    protected $fillable = [
        'city_id',
        'type',
        'data'
    ];

    protected $attributes = [
        'readed' => 0
    ];

    public function city()
    {
        return $this->belongsTo('App\Models\City');
    }
}
