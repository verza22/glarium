<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegimentUnit extends Model
{
    protected $table = 'regiment_unit';

    use SoftDeletes;

    protected $fillable = [
        'regiment_id',
        'unit_id',
        'cant'
    ];

    public function unit()
    {
        return $this->belongsTo('App\Models\Unit');
    }
}
