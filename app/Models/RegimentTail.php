<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegimentTail extends Model
{
    protected $table = 'regiment_tail';

    use SoftDeletes;

    protected $fillable = [
        'constructed_at',
        'regiment_id',
        'unit_id',
        'cant',
        'tail'
    ];

    public function regiment()
    {
        return $this->belongsTo('App\Models\Regiment');
    }
}
