<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovementResource extends Model
{
    protected $table = 'movement_resource';

    protected $fillable = [
      'movement_id',
      'wood', 
      'wine',
      'marble',
      'glass',
      'sulfur', 
    ];

    public $timestamps = false;
}
