<?php

namespace App\Helpers;

use App\Models\City;
use App\Models\CityPopulation;
use App\Models\CityBuilding;
use App\Models\Research;
use App\Models\UserResearch;
use App\Models\UserCity;
use App\Helpers\UserResourceHelper;
use App\Helpers\BuildingHelper;
use App\User;
use Carbon\Carbon;
use Auth;
 
class PopulationHelper {

    public static function getCorruption(City $city)
    {
        //Obtenemos el nivel de residencia
        $cityBuilding = CityBuilding::where('city_id',$city->id)->whereHas('building_level',function($query){
            $query->where('building_id',18);
        })->first();
        $level = $cityBuilding===NULL ? 0 : $cityBuilding->building_level->level;

        //Obtenemos el numero de colonias
        $colonias = UserCity::where('user_id',Auth::id())->where('capital',0)->count();

        $corruption = (1 - ($level + 1) / ($colonias + 1));

        return $corruption;
    }

    public static function comparePopulation(City $city,$collect)
    {
        return $city->population->population >= $collect->population;
    }

    public static function removePopulation(City $city,$collect)
    {
        $cityPopulation = CityPopulation::where('city_id',$city->id)->first();
        $cityPopulation->population = $cityPopulation->population - $collect->population;
        $cityPopulation->save();
        UserResourceHelper::updateResources();
    }
    
    public static function satisfaction(CityPopulation $cityPopulation,$updatedResources = true)
    {
        //Actualiza la satisfancion y los ciudadanos disponibles de una ciudad
        $seconds = Carbon::now()->diffInSeconds(Carbon::parse($cityPopulation->updated_at));
        $diffTime = $seconds/3600;

        $cityBuilding = CityBuilding::where('city_id',$cityPopulation->city_id)->whereHas('building_level',function($query){
            $query->where('building_id',5);
        });

        $otherPopulation = $cityPopulation->worker_forest + $cityPopulation->worker_mine + $cityPopulation->scientists;
        $max_population = $cityPopulation->population_max - $otherPopulation;

        $bonuses = 196;//Bonus base

        //Si existe una taberna sumamos sus bonus
        if($cityBuilding->exists())
        {
            $cityBuilding = $cityBuilding->first();
            $taberna_level = $cityBuilding->building_level->level;//Obtenemos nivel de la taberna

            $per_wine = $cityPopulation->wine/$cityPopulation->wine_max;//Porcentaje que esta dando de vino
            $bonus_wine = ( ( $taberna_level * 60 ) * $per_wine );

            $bonuses += $bonus_wine; //Sumamos el bonus por servir vino
            $bonuses += ($taberna_level * 12); //12 de bonus por cada nivel de taberna
        }

        //Si tiene la investigaciones que dan bonus damos sus respectivos bonus
        $researchs_id = Research::whereIn('name',['Holiday','Well Digging'])->select('id')->pluck('id');
        $userResearchs = UserResearch::where('user_id',Auth::id())->whereIn('research_id',$researchs_id)->get();

        $userCity = UserCity::where('user_id',Auth::id())->where('city_id',$cityPopulation->city_id)->first();
        $capital = $userCity->capital;

        if($userResearchs->count() > 0) 
        {
            $researchBonuses = $userResearchs->map(function($userResearch) use ($capital) {
                switch($userResearch->research->name)
                {
                    case 'Holiday':
                        return 25;
                    break;
                    case 'Well Digging':
                        if($capital === 1)
                        {
                            return 50;
                        }
                    break;
                }
            });

            $bonuses += $researchBonuses->sum();
        }
        
        //Obtenemos los contrabuff
        $deduction = ($cityPopulation->population + $otherPopulation);

        //Si es colonia consultamos si tiene corrupcion
        if($capital==0)
        {
            $corruption = self::getCorruption($userCity->city);
            if($corruption!=0)
            {
                //Aumentamos los contrabuff
                $deduction += $bonuses * $corruption;
            }
        }
        
        $population = $cityPopulation->population;

        $diffTime_decimal = $diffTime-floor($diffTime);

        //Calculamos la parte entera
        for($i=0;$i<floor($diffTime);$i++)
        {
            $satisfaction = $bonuses-$deduction;
            $regeneration = $satisfaction*0.02;
            $population += $regeneration;
            $deduction = ($population + $otherPopulation);
            if($population>=($bonuses-0.01)){
                //Salimos si la $poblacion alcanzo el bonus maximo
                $population = $bonuses;
                break;
            }
        }
        //Calculamos la parte decimal
        if($population<$bonuses&&$population<$max_population){
            $population+= ($diffTime_decimal*(($bonuses-$deduction)*0.02));
        }

        if(($population + $otherPopulation)>$cityPopulation->population_max){
            //Salimos si alcanza la poblacion maxima
            $population = $max_population;
        }

        $cityPopulation->population = $population;
        $cityPopulation->save();
        if($updatedResources)
        {
            UserResourceHelper::updateResources();
        }
        
    }

    public static function setPopulationMax(CityBuilding $cityBuilding)
    {
        $building = $cityBuilding->building_level->building->name;
        $level = $cityBuilding->building_level->level;
        $cityPopulation = CityPopulation::where('city_id',$cityBuilding->city_id)->first();
        switch($building)
        {
            case 'Town Hall':
                //Actualiza la poblacion maxima si se actualiza la intendencia
                $population_max = floor( ( ( 10 * pow($level,1.5) ) * 2 ) + 40 );
                $cityPopulation->population_max = $population_max;
                $cityPopulation->save();

                //Aumentamos el nivel de puntos de accion
                $city = City::whereId($cityBuilding->city_id)->first();
                $city->apoint = (3+floor($level/4));
                $city->save();
            break;
            case 'Academy':
                //Actualiza la capacidad maxima de cientificos 
                $scientists_max = ceil( ( 7 + pow($level,1.8) ) );
                $cityPopulation->scientists_max = $scientists_max;
                $cityPopulation->save();
            break;
            case 'Tavern':
                //Actualiza la capacidad de vino maxima si se actualiza la taberna
                $wine_max = ceil( ( 4 + pow($level,1.75) ) );
                $cityPopulation->wine_max = $wine_max;
                $cityPopulation->save();
            break;
        }
    }
}