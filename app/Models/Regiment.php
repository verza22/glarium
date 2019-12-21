<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Regiment extends Model
{
    protected $table = 'regiment';

    protected $fillable = ['user_id','city_id','travel'];

    protected $attributes = [
        'travel' => 0
    ];

    use SoftDeletes;

    public function tails()
    {
        return $this->hasMany('App\Models\RegimentTail');
    }

    public function units()
    {
        return $this->hasMany('App\Models\RegimentUnit');
    }

    public function scopeTravel($query)
    {
        return $query->where('travel', 1);
    }

    public function scopeNotTravel($query)
    {
        return $query->where('travel', 0);
    }
}
