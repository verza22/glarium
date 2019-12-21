<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CombatReportDetail extends Model
{
    protected $table = 'combat_report_detail';

    protected $fillable = [
        'combat_report_id',
        'round',
        'type_attack',
        'result',
        'attack_unit_id',
        'attack_before_cant',
        'attack_after_cant',
        'defense_unit_id',
        'defense_before_cant',
        'defense_after_cant'
    ];
}
