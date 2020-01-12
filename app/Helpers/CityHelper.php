<?php

namespace App\Helpers;
use App\Models\City;
use App\Models\CityPopulation;
use App\Models\UserCity;
use App\Helpers\BuildingModifierHelper;
use App\Helpers\UnitHelper;
use App\Helpers\MovementHelper;
use Carbon\Carbon;
use Auth;

class CityHelper {

    public static function addResources(City $city,$resources)
    {
        $city->wood += $resources->wood;
        $city->wine += $resources->wine;
        $city->marble += $resources->marble;
        $city->glass += $resources->glass;
        $city->sulfur += $resources->sulfur;
        $city->save();
    }

    public static function compareResources(City $city,$resources)
    {
        CityHelper::updateResources($city);
        if(
            $city->wood>=$resources->wood &&
            $city->marble>=$resources->marble &&
            $city->wine>=$resources->wine &&
            $city->glass>=$resources->glass &&
            $city->sulfur>=$resources->sulfur
        ){
            return true;
        }else{
            return false;
        }
    }

    public static function removeResources(City $city,$resources)
    {
        //Update resources in city
        $city->wood   = $city->wood   - $resources->wood;
        $city->wine   = $city->wine   - $resources->wine;
        $city->marble = $city->marble - $resources->marble;
        $city->glass  = $city->glass  - $resources->glass;
        $city->sulfur = $city->sulfur - $resources->sulfur;
        $city->save();
    }

    public static function updateResources(City $city)
    {
        //Actualiza los recursos de una ciudad
        $type = $city->islandCity->island->type;
        $worker_forest = $city->population->worker_forest;
        $worker_mine   = $city->population->worker_mine;

        $seconds = Carbon::now()->diffInSeconds(Carbon::parse($city->updated_at));
        $diffTime = $seconds/3600;

        //Obtenemos una coleccion de recursos vacia
        $collect = UnitHelper::newCollect();
        $collect->wood = $diffTime*$worker_forest;

        //Depende del tipo de recurso especial de la isla lo asignamos
        switch($type)
        {
            case 1:
                $collect->wine = $diffTime*$worker_mine;
            break;
            case 2:
                $collect->marble = $diffTime*$worker_mine;
            break;
            case 3:
                $collect->glass = $diffTime*$worker_mine;
            break;
            case 4:
                $collect->sulfur = $diffTime*$worker_mine;
            break;
        }

        BuildingModifierHelper::improvedResources($city,$collect);

        //Verificamos si es capital
        if($city->userCity->capital==0)
        {
            $corruption = 1 - PopulationHelper::getCorruption($city);
            if($corruption!=1)
            {
                $collect->wood   =  $collect->wood   * $corruption;
                $collect->wine   =  $collect->wine   * $corruption;
                $collect->marble =  $collect->marble * $corruption;
                $collect->glass  =  $collect->glass  * $corruption;
                $collect->sulfur =  $collect->sulfur * $corruption;
            }
        }

        //Asignamos los recursos
        $city->wood   += config('world.bonus.resources') * $collect->wood;
        $city->wine   += config('world.bonus.resources') * $collect->wine;
        $city->marble += config('world.bonus.resources') * $collect->marble;
        $city->glass  += config('world.bonus.resources') * $collect->glass;
        $city->sulfur += config('world.bonus.resources') * $collect->sulfur;

        $cityPopulation = CityPopulation::where('city_id',$city->id)->first();
        $cityPopulation->wine = $cityPopulation->wine * config('world.bonus.tavern_consume');
        if($cityPopulation->wine>0)
        {
            //Si tiene sirviendo vino calculamos cuando hay que restarle
            $wineDiff = ( $city->wine - ( $diffTime * $cityPopulation->wine ) );
            if($wineDiff<0)
            {
                //Si Se quedo sin vino dejamos en 0
                $city->wine = 0;
                //Y actualizamos el vino servido a 0
                $cityPopulation->wine = 0;
                $cityPopulation->save();
            }
            else
            {
                //Aplicamos reduccion de vino
                BuildingModifierHelper::lessCost($city,$cityPopulation,false);
                //Si tiene vino se lo descontamos
                $city->wine -= ( $diffTime * $cityPopulation->wine );
            }
        }

        $city->save();
    }

    public static function updateCity(City $city)
    {
        //Actualiza los recursos,movimientos de saqueo, movimientos transportes recibidos a la ciudad de parametro
        self::updateResources($city);

        MovementHelper::returnMovementResources($city);
        MovementHelper::deliveredResourcesTo($city);

        CombatHelper::endAndReturnAttackFromCity($city);
        CombatHelper::endAndReturnAttackToCity($city);

        CombatHelper::endAndReturnDefendCity($city,'city_from');
        CombatHelper::endAndReturnDefendCity($city,'city_to');

        $city->refresh();
    }

    public static function myCities()
    {
        //Devuelve las ciudades del jugador con pluck id
        return UserCity::where('user_id',Auth::id())->pluck('city_id');
    }
}
