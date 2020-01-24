<?php

namespace App\Helpers;

use App\Models\City;
use App\Models\CityBuilding;
use App\Models\Unit;
use App\Models\Regiment;
use App\Models\RegimentUnit;
use App\Models\ResearchUnit;
use App\Models\UserResearch;
use App\Models\RegimentTail;
use App\Models\Mayor;
use App\Events\UserNotification;
use Carbon\Carbon;
use Auth;

class UnitHelper {

    public static function newCollect()
    {
        $collect = collect();
        $collect->wood       = 0;
        $collect->wine       = 0;
        $collect->marble     = 0;
        $collect->glass      = 0;
        $collect->sulfur     = 0;
        $collect->population = 0;
        $collect->time       = 0;

        return $collect;
    }

    public static function addCollect($collect,Unit $unit,$cant)
    {
        $collect->wood       += $unit->wood       * $cant;
        $collect->wine       += $unit->wine       * $cant;
        $collect->glass      += $unit->glass      * $cant;
        $collect->sulfur     += $unit->sulfur     * $cant;
        $collect->population += $unit->population * $cant;
        $collect->time       += $unit->time       * $cant;
    }

    public static function allConstructTails()
    {
        $regiments = Regiment::where('user_id',Auth::id())->pluck('id');
        $tails = RegimentTail::whereIn('regiment_id',$regiments)->where('constructed_at','<',Carbon::now())->get();

        if($tails->count() > 0)
        {
            self::notifyTails($tails);
        }

        $tails->map(function($tail){
            self::endTail($tail);
        });
    }

    public static function checkConstructedTime(Regiment $regiment)
    {
        $tails = $regiment->tails->where('constructed_at','<',Carbon::now());

        if($tails->count() > 0)
        {
            self::notifyTails($tails);
        }

        $tails->map(function($tail){
            self::endTail($tail);
        });

        if($tails->count() > 0)
        {
            $regiment->refresh();
        }
    }

    private static function notifyTails($tails)
    {
        //Notificación al usuario de que se crearon unidades
        $data = array();
        $aux = array();
        //Agrupa las colas por ciudad
        foreach($tails as $tail)
        {
            $city_id = $tail->regiment->city_id;
            if(in_array($city_id,$aux))
            {
                $index = array_search($city_id,$aux);
            }
            else
            {
                $index = count($aux);
                array_push($aux,$city_id);
                $data[$index]['units'] = [];
            }
            $data[$index]['city_id'] = $city_id;
            $tail_aux['unit_id']     = $tail->unit_id;
            $tail_aux['cant']        = $tail->cant;
            array_push($data[$index]['units'],$tail_aux);
        }
        //insertamos registros de las colas terminadas
        foreach($data as $value)
        {
            Mayor::create([
                'city_id'=> $value['city_id'],
                'type' => 5,
                'data' => json_encode($value['units'])
            ]);
        }
        //Notificamos al usuario
        event(new UserNotification('advisors','mayor',Auth::id()));
    }

    private static function endTail(RegimentTail $tail)
    {
        $regimentUnit = RegimentUnit::where('regiment_id',$tail->regiment_id)->where('unit_id',$tail->unit_id)->first();
            if($regimentUnit===NULL)
            {
                RegimentUnit::create([
                    'regiment_id' => $tail->regiment_id,
                    'unit_id'     => $tail->unit_id,
                    'cant'        => $tail->cant
                ]);
            }
            else
            {
                $regimentUnit->cant += $tail->cant;
                $regimentUnit->save();
            }
            $tail->delete();
    }

    public static function checkBarrackLevel(City $city,Unit $unit)
    {
        $cityBuildings = CityBuilding::where('city_id',$city->id)->get();

        $cityBuilding = $cityBuildings->filter(function($cityBuilding) use ($unit){
            if($cityBuilding->building_level->building_id === 4)
            {
                if($cityBuilding->building_level->level >= $unit->barrack_level)
                {
                    return true;
                }
            }
        });

        return $cityBuilding->count() > 0;
    }

    public static function checkResearch(Unit $unit)
    {
        //Verificamos si el edificio necesita una investigacion
        $researchUnit = ResearchUnit::where('unit_id',$unit->id);
        if($researchUnit->exists())
        {
            $research_id = $researchUnit->first()->research_id;
            if(!UserResearch::where('user_id',Auth::id())->where('research_id',$research_id)->exists())
            {
                return false;
            }
        }

        return true;
    }

    public static function removeUnitFromGoldConsume($units_consume,$goldProduction)
    {
        $regiments = Regiment::where('user_id',Auth::id())->select('id')->get();
        $regiments->map(function($regiment) use(&$units_consume,$goldProduction) {
            //Obtenemos el total de oro de todas las unidades de este regimiento
            return $regiment->units->map(function($unit) use(&$units_consume,$goldProduction) {
                if($units_consume > $goldProduction){
                    //Si el consumo es mayor a 0 seguimos borrando unidades
                    $units_consume -= ($unit->cant * $unit->unit->gold);
                    $unit->delete();
                }
            });
        });
    }

}
