<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCity extends Model
{
    protected $table = 'user_city';

    public $timestamps = false;

    protected $fillable = ['user_id','city_id','capital'];

    public function city()
    {
        return $this->belongsTo('App\Models\City');
    }
}
