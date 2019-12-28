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
        'message',
        'deleted_at_from',
        'deleted_at_to'
    ];

    protected $attributes = [
        'type' => 1
    ];

    public function from()
    {
        return $this->belongsTo('App\User','user_from');
    }

    public function to()
    {
        return $this->belongsTo('App\User','user_to');
    }
}
