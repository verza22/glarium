<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'message';

    protected $fillable = [
        'city_from',
        'city_to',
        'type',
        'message',
        'deleted_at_from',
        'deleted_at_to'
    ];

    protected $attributes = [
        'type' => 1,
        'readed' => 0
    ];

    public function from()
    {
        return $this->belongsTo('App\Models\City','city_from');
    }

    public function to()
    {
        return $this->belongsTo('App\Models\City','city_to');
    }
}
