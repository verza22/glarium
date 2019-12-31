<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserResource extends Model
{
    protected $table = 'user_resource';

    protected $fillable = ['user_id','gold','research_point'];

    protected $attributes = [
        'gold' => 50000,
        'research_point' => 50000,
        'trade_ship' => 0,
        'trade_ship_available' => 0
    ];
}
