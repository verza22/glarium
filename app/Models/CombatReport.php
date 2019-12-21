<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CombatReport extends Model
{
    protected $table = 'combat_report';

    protected $fillable = ['movement_regiment_id'];

    protected $attributes = ['result' => 0];
}
