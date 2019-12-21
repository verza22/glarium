<?php

namespace App\Helpers;

use App\Models\City;
use App\Models\CityBuilding;
 
class WarehouseHelper {

    public static function checkCapacity(City $city) 
    {
        //Verificamos que no pase el limite de la ciudad
        $capacity = 2500;//Capacidad base de la ciudad
        $wareHouse = 8000;//Capacidad por nivel

        $cityBuilding = CityBuilding::where('city_id',$city->id)->whereHas('building_level',function($query){
            $query->where('building_id',3);
        });

        if($cityBuilding->exists())
        {
            //Si existe un deposito calculamos cuanto almacena
            $level = $cityBuilding->first()->building_level->level;
            $capacity += ( $wareHouse * $level );
        }

        $city->wood   = $city->wood   > $capacity ? $capacity : $city->wood;
        $city->wine   = $city->wine   > $capacity ? $capacity : $city->wine;
        $city->marble = $city->marble > $capacity ? $capacity : $city->marble;
        $city->glass  = $city->glass  > $capacity ? $capacity : $city->glass;
        $city->sulfur = $city->sulfur > $capacity ? $capacity : $city->sulfur;   
    }

    public static function checkProtected(City $city)
    {
        //Devuelve la cantidad de recursos protegidos del deposito
        $cityBuilding = CityBuilding::where('city_id',$city->id)->whereHas('building_level',function($query){
            $query->where('building_id',3);
        });
        $capacity = 0;
        if($cityBuilding->exists())
        {
            //Si existe un deposito calculamos cuanto almacena
            $level = $cityBuilding->first()->building_level->level;
            $capacity += ( config('world.warehouse.resource_protected') * $level );
        }

        return $capacity;
    }

}