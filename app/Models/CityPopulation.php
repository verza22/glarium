<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\UserResourceHelper;

class CityPopulation extends Model
{
    protected $table = 'city_population';

    protected $fillable = ['city_id','population_max','population','worker_forest','worker_mine','wine_max','wine','scientists_max','scientists'];

    protected $attributes = [
        'population_max' => 60,
        'population' => 40,
        'worker_forest' => 0,
        'worker_mine' => 0,
        'wine_max' => 0,
        'wine' => 0,
        'scientists_max' => 0,
        'scientists' => 0
    ];

    public function userCity()
    {
        return $this->belongsTo('App\Models\UserCity','city_id','city_id');
    }

    public function city()
    {
        return $this->belongsTo('App\Models\City');
    }

    public static function boot()
    {
        parent::boot();

        /*self::updating(function($model){
            UserResourceHelper::updateResources();
        });*/
    }
}
