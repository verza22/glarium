<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchUnit extends Model
{
    protected $table = 'research_unit';

    public function unit()
    {
        return $this->belongsTo('App\Models\Unit');
    }
}
