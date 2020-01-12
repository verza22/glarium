<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class IslandCity extends Model
{
    protected $table = 'island_city';

    use SoftDeletes;

    protected $fillable = ['island_id','city_id','position'];

    public function island()
    {
        return $this->belongsTo('App\Models\Island');
    }

    public function city()
    {
        return $this->belongsTo('App\Models\City');
    }

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('city', function (Builder $builder) {
            $builder->has('city');
        });
    }
}
