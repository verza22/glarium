<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'message';

    protected $fillable = [
        'user_from',
        'user_to',
        'type',
        'message'
    ];

    protected $attributes = [
        'type' => 1
    ];

    public function from()
    {
        return $this->belongsTo('App/Users','user_from');
    }

    public function to()
    {
        return $this->belongsTo('App/Users','user_to');
    }
}
