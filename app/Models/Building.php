<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    protected $table = 'building';

    public function research()
    {
        return $this->hasMany('App\Models\ResearchBuilding');
    }
}
