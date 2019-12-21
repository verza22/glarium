<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchBuilding extends Model
{
    protected $table = 'research_building';

    public function building()
    {
        return $this->belongsTo('App\Models\Building');
    }
}
