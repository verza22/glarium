<?php

namespace App\Helpers;

use Auth;
use App\Models\UserCity;
use App\Models\CityPopulation;
use App\Models\UserResource;
use App\Models\Research;
use App\Models\UserResearch;
use App\Models\Regiment;
use App\Helpers\UnitHelper;
use Carbon\Carbon;

class UserResourceHelper
{
    public static function updateResources()
    {
        $userResource = UserResource::where('user_id', Auth::id())->first();
        $seconds = Carbon::now()->diffInSeconds(Carbon::parse($userResource->updated_at));
        $diffTime = $seconds / 3600;

        self::updateGold($userResource,$diffTime);
        self::updateResearchPoint($userResource,$diffTime);

        $userResource->save();
    }

    private static function updateGold(UserResource $userResource,$diffTime)
    {
        //Conseguimos el total de trabajadores del jugador en todas sus ciudades
        $userCities = UserCity::where('user_id', Auth::id())->select('city_id')->pluck('city_id');
        $cityPopulation = CityPopulation::whereIn('city_id', $userCities);

        $total_population = $cityPopulation->sum('population');

        $goldProduction = 0;

        if ($total_population > 0) {
            //Si tiene poblacion calculamos cuanto de oro sumamos
            $citizen_gold = 3;
            $goldProduction = $citizen_gold * $total_population;

            $userResource->gold += ( $goldProduction * $diffTime);
        }
        //Restamos los costes de manutencion
        $goldConsume = 0;

        //Consumo de oro de unidades
        $regiments = Regiment::where('user_id',Auth::id())->get();
        $units_consume = $regiments->map(function($regiment){
            //Verificamos que no tenga unidades en cosntruccion
            UnitHelper::checkConstructedTime($regiment);
            //Obtenemos el total de oro de todas las unidades de este regimiento
            return $regiment->units->map(function($unit) use($regiment) {
                $consume = $unit->cant * $unit->unit->gold;
                //Si el regimiento esta de viaje consume x2
                return $regiment->travel == 1 ? ($consume * 2) : $consume;
            })->sum();
        })->sum();

        $goldConsume += $units_consume;

        //Verificamos que tenga la investigacion que reduce el coste de los investigadores
        $research_id = Research::where('name','Letter Chute')->select('id')->pluck('id');
        if(UserResearch::where('user_id',Auth::id())->where('research_id',$research_id)->exists())
        {
            $scientists_gold = 3;
        }
        else
        {
            $scientists_gold = 6;
        }

        $scientists_consume = $scientists_gold * $cityPopulation->sum('scientists');

        $goldConsume += $scientists_consume;
        $userResource->gold -= ($goldConsume * $diffTime);
        if($userResource->gold<0)
        {
            //Se acabo el oro activar el sistema de manutencion
            $userResource->gold = 0;
            //Damos de baja a todos los cientificos
            $cityPopulation->update(['scientists' => 0]);
            if($units_consume>$goldProduction)
            {
                //Si consume mas oro en unidades del que produce Borramos las unidades
                UnitHelper::removeUnitFromGoldConsume($units_consume,$goldProduction);
            }
        }
    }

    private static function updateResearchPoint(UserResource $userResource,$diffTime)
    {
        //Conseguimos el total de investigadores del jugador en todas sus ciudades
        $userCities = UserCity::where('user_id', Auth::id())->select('city_id')->pluck('city_id');
        $cityPopulation = CityPopulation::whereIn('city_id', $userCities)->get();

        $scientists = $cityPopulation->map(function($cityPopulation){
            if($cityPopulation->userCity->capital==1)
            {
                return $cityPopulation->scientists;
            }
            else
            {
                //Verificamos si tiene corrupcion
                $corruption = 1 - PopulationHelper::getCorruption($cityPopulation->city);
                return $corruption == 1 ? $cityPopulation->scientists : $cityPopulation->scientists * $corruption;
            }
        });

        $total_scientists = $scientists->sum();

        if ($total_scientists > 0) {
            //Si tiene investigadores calculamos cuantos PI le daremos
            $scientists_pi = 1;
            $pi = $scientists_pi * $total_scientists;

            //Verificamos que tenga las investigaciones que aumentan los PI x hora
            $researchs_id = Research::whereIn('name',['Paper','Ink','Mechanical Pen'])->select('id')->pluck('id');
            $userResearchs = UserResearch::where('user_id',Auth::id())->whereIn('research_id',$researchs_id)->get();

            if($userResearchs->count() > 0)
            {
                $researchBonuses = 1 + $userResearchs->map(function($userResearch) {
                    switch($userResearch->research->name)
                    {
                        case 'Paper':
                            return 0.02;
                        break;
                        case 'Ink':
                            return 0.04;
                        break;
                        case 'Mechanical Pen':
                            return 0.08;
                        break;
                    }
                })->sum();

                $pi = $pi * $researchBonuses;
            }

            $userResource->research_point += ($pi * $diffTime);
        }
    }
}
