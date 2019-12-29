<?php

namespace App\Helpers;

use App\Models\City;
use App\Models\CityBuilding;
use App\Models\BuildingLevel;
use App\Helpers\BuildingHelper;

class BuildingModifierHelper {

    public static function lessCost(City $city,$resources)
    {
        $discountResearch = BuildingHelper::lessCostResearch();
        //Obtenemos los edificios que descuentan recursos de la ciudad
        $cityBuildings = CityBuilding::where('city_id',$city->id)->select('building_level_id')->pluck('building_level_id');
        $buildingLevels = BuildingLevel::whereIn('id',$cityBuildings)->whereIn('building_id',[6,7,8,9,10])->get();

        $buildingLevels->map(function($buildingLevel) use($resources,$discountResearch) {
            $discount = 1 - ($buildingLevel->level * 0.01) - $discountResearch;
            switch($buildingLevel->building_id)
            {
                case 6://Carpinteria
                    if($resources->wood!=NULL)
                    {
                        $resources->wood = $resources->wood * $discount;
                    }
                break;
                case 7://Optico
                    if($resources->glass!=NULL)
                    {
                        $resources->glass = $resources->glass * $discount;
                    }
                break;
                case 8://Pruebas pirotecnicas
                    if($resources->sulfur!=NULL)
                    {
                        $resources->sulfur = $resources->sulfur * $discount;
                    }
                break;
                case 9://Presa de vino
                    if($resources->wine!=NULL)
                    {
                        $resources->wine = $resources->wine * $discount;
                    }
                break;
                case 10://Oficina del arquitecto
                    if($resources->marble!=NULL)
                    {
                        $resources->marble = $resources->marble * $discount;
                    }
                break;
            }
        });

    }

    public static function improvedResources(City $city,$resources)
    {
        //Obtenemos los edificios que aumenten los recursos de la ciudad
        $cityBuildings = CityBuilding::where('city_id',$city->id)->select('building_level_id')->pluck('building_level_id');
        $buildingLevels = BuildingLevel::whereIn('id',$cityBuildings)->whereIn('building_id',[11,12,13,14,15])->get();

        $buildingLevels->map(function($buildingLevel) use($resources) {
            $increase = 1 + ($buildingLevel->level * 0.02);
            switch($buildingLevel->building_id)
            {
                case 11://Cabania
                    if($resources->wood!=NULL)
                    {
                        $resources->wood = $resources->wood * $increase;
                    }
                break;
                case 12://Soplador de vidrio
                    if($resources->glass!=NULL)
                    {
                        $resources->glass = $resources->glass * $increase;
                    }
                break;
                case 13://Torre del alquimista
                    if($resources->sulfur!=NULL)
                    {
                        $resources->sulfur = $resources->sulfur * $increase;
                    }
                break;
                case 14://Vinocultor
                    if($resources->wine!=NULL)
                    {
                        $resources->wine = $resources->wine * $increase;
                    }
                break;
                case 15://Cantero
                    if($resources->marble!=NULL)
                    {
                        $resources->marble = $resources->marble * $increase;
                    }
                break;
            }
        });


    }
}
