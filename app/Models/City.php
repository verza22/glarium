<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Helpers\WarehouseHelper;
use Carbon\Carbon;

class City extends Model
{
    protected $table = 'city';

    use SoftDeletes;

    protected $fillable = ['constructed_at'];

    protected $attributes = [
        'name' => 'Polis',
        'wood' => 2500,
        'wine' => 0,
        'marble' => 0,
        'glass' => 0,
        'sulfur' => 0,
        'apoint' => 3
    ];

    public function population()
    {
        return $this->hasOne('App\Models\CityPopulation');
    }

    public function building()
    {
        return $this->hasMany('App\Models\CityBuilding');
    }

    public function islandCity()
    {
        return $this->hasOne('App\Models\IslandCity');
    }

    public function userCity()
    {
        return $this->hasOne('App\Models\UserCity');
    }

    public static function boot()
    {
        parent::boot();

        self::updating(function($model){
            WarehouseHelper::checkCapacity($model);
        });
    }

}
