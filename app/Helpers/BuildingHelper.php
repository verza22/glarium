<?php

namespace App\Helpers;

use App\Models\City;
use App\Models\CityBuilding;
use App\Models\UserResearch;
use App\Models\ResearchBuilding;
use App\Models\BuildingLevel;
use App\Models\Research;
use App\Models\Mayor;
use App\Helpers\BuildingModifierHelper;
use App\Events\UserNotification;
use Carbon\Carbon;
use Auth;

class BuildingHelper {

    public static function isContructed(City $city)
    {
        return CityBuilding::where('city_id',$city->id)->where('constructed_at','!=',NULL)->exists();
    }

    public static function positionExist(City $city,$position)
    {
        return CityBuilding::where('city_id',$city->id)->where('position',$position)->exists();
    }

    public static function buildingExist(City $city,$building_id)
    {
        return CityBuilding::where('city_id',$city->id)
                            ->whereHas('building_level',function($level) use($building_id) {
                                $level->where('building_id',$building_id);
                            })->exists();
    }

    public static function building(City $city,$building_id)
    {
        return CityBuilding::where('city_id',$city->id)
                            ->whereHas('building_level',function($level) use($building_id) {
                                $level->where('building_id',$building_id);
                            })->first();
    }

    public static function updateConstructedTime(City $city)
    {
        CityBuilding::where('city_id',$city->id)
        ->where('constructed_at','<',Carbon::now()->addSeconds(3))
        ->get()->map(function($cityBuilding) use ($city){
            //Mejoramos el edificio
            $after = $cityBuilding->building_level;
            $before = BuildingLevel::where('building_id',$after->building_id)->where('level',$after->level+1)->first();
            $cityBuilding->building_level_id = $before->id;
            $cityBuilding->constructed_at = NULL;
            $cityBuilding->save();

            //Notificamos de la creacion del edificio
            Mayor::create([
                'city_id'=> $city->id,
                'type' => 1,
                'data' => json_encode(['building_id'=>$after->building_id,'level'=>$before->level])
            ]);
            event(new UserNotification('advisors','mayor',$city->userCity->user_id));
        });
    }

    public static function checkResearch($building_id)
    {
        //Verificamos si el edificio necesita una investigacion
        $researchBuilding = ResearchBuilding::where('building_id',$building_id);
        if($researchBuilding->exists())
        {
            $research_id = $researchBuilding->first()->research_id;
            if(!UserResearch::where('user_id',Auth::id())->where('research_id',$research_id)->exists())
            {
                return false;
            }
        }

        return true;
    }

    public static function lessBuildingCost(City $city,BuildingLevel $buildingLevel)
    {
        BuildingModifierHelper::lessCost($city,$buildingLevel);
    }

    public static function lessCostResearch()
    {
        $resarchs = Research::whereIn('name',['Pulley','Geometry','Spirit Level'])->select('id')->pluck('id');
        $userResearchs = UserResearch::where('user_id',Auth::id())->whereIn('research_id',$resarchs)->get();

        //Si hay investigaciones aplicamos descuentos
        if($userResearchs->count()>0)
        {
            $totalDiscount = $userResearchs->map(function($userResearch) {
                //Aplicamos los descuentos para cada investigacion
                switch($userResearch->research->name)
                {
                    case 'Pulley':
                        return 0.02;
                    break;
                    case 'Geometry':
                        return 0.04;
                    break;
                    case 'Spirit Level':
                        return 0.08;
                    break;
                }
            })->sum();
            return $totalDiscount;
        }
        else
        {
            return 0;
        }
    }
}
