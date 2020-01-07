<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Helpers\PopulationHelper;

class CityBuilding extends Model
{
    protected $table = 'city_building';

    use SoftDeletes;

    protected $fillable = ['building_level_id','city_id','position'];

    public function building_level()
    {
        return $this->belongsTo('App\Models\BuildingLevel');
    }

    public function city()
    {
        return $this->belongsTo('App\Models\City');
    }

    public static function boot()
    {
        parent::boot();

        self::created(function($model){
            PopulationHelper::setPopulationMax($model);
        });
        self::saved(function($model){
            PopulationHelper::setPopulationMax($model);
        });
    }

}
