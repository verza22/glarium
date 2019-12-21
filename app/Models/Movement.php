<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movement extends Model
{
    protected $table = 'movement';

    use SoftDeletes;

    protected $fillable = [
        'start_at',
        'end_at',
        'return_at',
        'user_id',
        'city_from',
        'city_to',
        'movement_type_id',
        'trade_ship'
    ];

    public function resources()
    {
        return $this->hasOne('App\Models\MovementResource');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function movement_regiment()
    {
        return $this->hasOne('App\Models\MovementRegiment');
    }

    public function city_origin()
    {
        return $this->belongsTo('App\Models\City','city_from');
    }

    public function city_destine()
    {
        return $this->belongsTo('App\Models\City','city_to');
    }
}
