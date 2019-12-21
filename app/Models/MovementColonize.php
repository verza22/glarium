<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MovementColonize extends Model
{
    protected $table = 'movement_colonize';

    use SoftDeletes;

    protected $fillable = [
        'start_at',
        'end_at',
        'user_id',
        'city_from',
        'island_to',
        'position'
    ];
}
