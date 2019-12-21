<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildingLevel extends Model
{
    protected $table = 'building_level';

    public function building()
    {
        return $this->belongsTo('App\Models\Building');
    }
}
