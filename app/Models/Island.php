<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Island extends Model
{
    protected $table = 'island';

    public $timestamps = false;

    public function cities()
    {
        return $this->hasMany('App\Models\IslandCity');
    }

    public function forest()
    {
        return $this->belongsTo('App\Models\Forest');
    }

    public function donation_forest()
    {
        return $this->hasMany('App\Models\IslandDonation')->where('type',1);
    }

    public function donation_mine()
    {
        return $this->hasMany('App\Models\IslandDonation')->where('type',0);
    }

    public function mine()
    {
        return $this->belongsTo('App\Models\Mine');
    }
}
