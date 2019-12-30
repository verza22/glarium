<?php

namespace App\Helpers;

use App\Models\City;
use App\Models\Movement;
use App\Models\UserResource;
use App\Models\Island;
use App\Models\MovementColonize;
use App\Helpers\OtherHelper;
use App\Helpers\BuildingHelper;
use App\Models\UserCity;
use App\User;
use Auth;
use Carbon\Carbon;

class MovementHelper {

    public static function loadedSpeed(City $city_from,$size)
    {
        //Obtenemos el nivel del puerto para calcular su capacidad de carga
        $loaded = config('world.load_speed_base');//Carga base

        //Obtenemos el puerto
        $level = BuildingHelper::building($city_from,16)->building_level->level;
        $loaded += ($level*config('world.load_speed'));

        $loadedTime = $loaded/60;//Carga por minuto

        return $size/$loadedTime;//Retornamos el tiempo en segundos
    }

    public static function distanceTime(City $city_from,City $city_to)
    {
        //Verificamos si estan en la misma isla
        if($city_to->islandCity->id === $city_to->islandCity->id)
        {
            return config('world.distance.same_island');
        }
    }

    public static function distanceTimeColonize(City $city_from,Island $island)
    {
        //Verificamos si estan en la misma isla
        if($city_from->islandCity->id === $island->id)
        {
            return config('world.distance.same_island');
        }
    }

    public static function getActionPoint(City $city_from)
    {
        $movement = Movement::where('city_from',$city_from->id)->where('user_id',Auth::id())->count();
        $colonize = MovementColonize::where('city_from',$city_from->id)->where('user_id',Auth::id())->count();
        return $movement + $colonize;
    }

    public static function returnMovementResources(City $city_from)
    {
        $cities = [$city_from->id];
        self::deliveredResourcesFrom($cities);
        self::deliveredResourcesReturn($cities);
    }

    public static function returnMovementResourcesAll()
    {
        $cities = UserCity::where('user_id',Auth::id())->pluck('city_id');
        self::deliveredResourcesFrom($cities);
        self::deliveredResourcesReturn($cities);
    }

    public static function deliveredResourcesReturn($cities)
    {
        $movements = Movement::whereIn('city_from',$cities)
                            ->where('movement_type_id',1)
                            ->where('delivered',1)
                            ->where('return_at','<',Carbon::now())->get();
        $movements->map(function($movement){
            $userResource = UserResource::where('user_id',$movement->user_id)->firstOrFail();
            //Actualizamos sus mercantes
            $userResource->trade_ship_available += $movement->trade_ship;
            $userResource->save();

            //Borramos el movimiento
            $movement->delete();
        });
    }

    public static function deliveredResourcesFrom($cities)
    {
        //Entrega los recursos desde una ciudad
        $movements = Movement::whereIn('city_from',$cities)
                            ->where('movement_type_id',1)
                            ->where('delivered',0)
                            ->where('end_at','<',Carbon::now())->get();
        $movements->map(function($movement){
            //Entregamos los recursos
            $city_to = $movement->city_destine;
            $resources = $movement->resources;

            $city_to->wood += $resources->wood;
            $city_to->wine += $resources->wine;
            $city_to->marble += $resources->marble;
            $city_to->glass += $resources->glass;
            $city_to->sulfur += $resources->sulfur;

            $city_to->save();

            //Actualizamos el estado a entregado
            $movement->delivered = 1;
            $movement->save();
        });
    }

    public static function deliveredResourcesTo(City $city_to)
    {
        //Actualiza los recursos que llegan a una ciudad
        $movements = Movement::where('city_to',$city_to->id)
                            ->where('movement_type_id',1)
                            ->where('delivered',0)
                            ->where('end_at','<',Carbon::now())->get();
        $movements->map(function($movement){
            //Entregamos los recursos
            $city_to = $movement->city_destine;
            $resources = $movement->resources;

            $city_to->wood += $resources->wood;
            $city_to->wine += $resources->wine;
            $city_to->marble += $resources->marble;
            $city_to->glass += $resources->glass;
            $city_to->sulfur += $resources->sulfur;

            $city_to->save();

            //Actualizamos el estado a entregado
            $movement->delivered = 1;
            $movement->save();
        });
    }

    public static function checkColonize()
    {
        self::endColonize();
        return MovementColonize::where('user_id',Auth::id())->where('end_at','<',Carbon::now())->exists();
    }

    public static function checkColonizeIsland(Island $island,$position)
    {
        return MovementColonize::where('island_to',$island->id)->where('position',$position)->exists();
    }

    public static function endColonizeIsland(Island $island)
    {
        //Termina las colonizaciones de una isla
        $movements = MovementColonize::where('island_to',$island->id)->where('end_at','<',Carbon::now())->get();
        self::endColonizeAux($movements);
        if($movements->count()>1)
        {
            $island->refresh();
        }
    }

    public static function endColonize()
    {
        //Termina las colonizaciones de un jugador
        $movements = MovementColonize::where('user_id',Auth::id())->where('end_at','<',Carbon::now())->get();
        self::endColonizeAux($movements);
    }

    public static function endColonizeAux($movements)
    {
        $movements->map(function($movement){
            //Quitamos y borramos el movimiento
            $user = User::find($movement->user_id);
            OtherHelper::createCity($user,$movement->island_to,$movement->position);
            $movement->delete();
            //Damos los 3 mercantes
            $userResource = UserResource::where('user_id',$user->id)->first();
            $userResource->trade_ship_available += 3;
            $userResource->save();
        });
    }

}
