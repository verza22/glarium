<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IslandDonation extends Model
{
    protected $table = 'island_donation';

    protected $fillable = [
        'island_id',
        'city_id',
        'type',
        'donated'
    ];

    protected $attributes = [
        'donated' => 0
    ];

    public function city()
    {
        return $this->belongsTo('App\Models\City');
    }
}
